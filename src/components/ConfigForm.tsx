import React, { useState, useEffect } from 'react';
import { Layout, Form, Input, Select, Switch, Space, Divider, Row, Col, Steps, InputNumber } from 'antd';
import { ArrowLeftOutlined, SaveOutlined, DownloadOutlined, PlusOutlined, DeleteOutlined } from '@ant-design/icons';
import OllamaFlowCard from './base/card/Card';
import OllamaFlowButton from './base/button/Button';
import OllamaFlowTitle from './base/typograpghy/Title';
import OllamaFlowText from './base/typograpghy/Text';
import OllamaFlowFlex from './base/flex/Flex';
import OllamaFlowModal from './base/modal/Modal';
import type { FormInstance } from 'antd/es/form';
import styles from './ConfigForm.module.scss';

const { Content } = Layout;
const { TextArea } = Input;
const { Option } = Select;

interface ConfigFormProps {
  onClose: () => void;
}

interface Backend {
  Identifier: string;
  Name: string;
  Hostname: string;
  Port: number;
  Ssl: boolean;
  ModelRefreshIntervalMs: number;
  HealthCheckIntervalMs: number;
  UnhealthyThreshold: number;
  HealthyThreshold: number;
  HealthCheckMethod: {
    Method: string;
  };
  HealthCheckUrl: string;
  MaxParallelRequests: number;
  RateLimitRequestsThreshold: number;
  LogRequestBody: boolean;
  LogResponseBody: boolean;
}

interface Frontend {
  Identifier: string;
  Name: string;
  Hostname: string;
  TimeoutMs: number;
  LoadBalancing: string;
  BlockHttp10: boolean;
  LogRequestFull: boolean;
  LogRequestBody: boolean;
  LogResponseBody: boolean;
  MaxRequestBodySize: number;
  Backends: string[];
  RequiredModels: string[];
  LastIndex: number;
}

interface ConfigFormData {
  Logging: any;
  Frontends: Frontend[];
  Backends: Backend[];
  Webserver: any;
}

const ConfigForm: React.FC<ConfigFormProps> = ({ onClose }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [backends, setBackends] = useState([
    {
      Identifier: '',
      Name: '',
      Hostname: 'localhost',
      Port: 11435,
      Ssl: false,
      ModelRefreshIntervalMs: 30000,
      HealthCheckIntervalMs: 5000,
      UnhealthyThreshold: 2,
      HealthyThreshold: 2,
      HealthCheckMethod: {
        Method: 'HEAD',
      },
      HealthCheckUrl: '/',
      MaxParallelRequests: 4,
      RateLimitRequestsThreshold: 10,
      LogRequestBody: false,
      LogResponseBody: false,
    },
  ]);
  const [frontends, setFrontends] = useState([
    {
      Identifier: '',
      Name: '',
      Hostname: 'localhost',
      TimeoutMs: 60000,
      LoadBalancing: 'RoundRobin',
      BlockHttp10: true,
      LogRequestFull: false,
      LogRequestBody: false,
      LogResponseBody: false,
      MaxRequestBodySize: 536870912,
      Backends: [],
      RequiredModels: ['all-minilm'],
      LastIndex: 0,
    },
  ]);

  // Default configuration template
  const defaultConfig: ConfigFormData = {
    Logging: {
      Servers: [
        {
          Hostname: '127.0.0.1',
          Port: 514,
          RandomizePorts: false,
          MinimumPort: 65000,
          MaximumPort: 65535,
        },
      ],
      LogDirectory: './logs/',
      LogFilename: 'ollamaflow.log',
      ConsoleLogging: true,
      EnableColors: true,
      MinimumSeverity: 0,
    },
    Frontends: frontends,
    Backends: backends,
    Webserver: {
      Hostname: 'localhost',
      Port: 43411,
      Prefix: 'http://localhost:43411/',
      IO: {
        StreamBufferSize: 65536,
        MaxRequests: 1024,
        ReadTimeoutMs: 10000,
        MaxIncomingHeadersSize: 65536,
        EnableKeepAlive: false,
      },
      Ssl: {
        Enable: false,
        MutuallyAuthenticate: false,
        AcceptInvalidAcertificates: true,
      },
      Headers: {
        IncludeContentLength: true,
        DefaultHeaders: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'OPTIONS, HEAD, GET, PUT, POST, DELETE, PATCH',
          'Access-Control-Allow-Headers': '*',
          'Access-Control-Expose-Headers': '',
          Accept: '*/*',
          'Accept-Language': 'en-US, en',
          'Accept-Charset': 'ISO-8859-1, utf-8',
          'Cache-Control': 'no-cache',
          Connection: 'close',
          Host: 'localhost:43411',
        },
      },
      AccessControl: {
        DenyList: {},
        PermitList: {},
        Mode: 'DefaultPermit',
      },
      Debug: {
        AccessControl: false,
        Routing: false,
        Requests: false,
        Responses: false,
      },
    },
  };

  const handleBackendChange = (index: number, field: string, value: any) => {
    const newBackends = [...backends];
    newBackends[index] = { ...newBackends[index], [field]: value };
    setBackends(newBackends);
  };

  const handleFrontendChange = (index: number, field: string, value: any) => {
    const newFrontends = [...frontends];
    newFrontends[index] = { ...newFrontends[index], [field]: value };
    setFrontends(newFrontends);
  };

  const addBackend = () => {
    setBackends([
      ...backends,
      {
        Identifier: '',
        Name: '',
        Hostname: 'localhost',
        Port: 11435,
        Ssl: false,
        ModelRefreshIntervalMs: 30000,
        HealthCheckIntervalMs: 5000,
        UnhealthyThreshold: 2,
        HealthyThreshold: 2,
        HealthCheckMethod: {
          Method: 'HEAD',
        },
        HealthCheckUrl: '/',
        MaxParallelRequests: 4,
        RateLimitRequestsThreshold: 10,
        LogRequestBody: false,
        LogResponseBody: false,
      },
    ]);
  };

  const removeBackend = (index: number) => {
    if (backends.length > 1) {
      setBackends(backends.filter((_, i) => i !== index));
    }
  };

  const addFrontend = () => {
    setFrontends([
      ...frontends,
      {
        Identifier: '',
        Name: '',
        Hostname: 'localhost',
        TimeoutMs: 60000,
        LoadBalancing: 'RoundRobin',
        BlockHttp10: true,
        LogRequestFull: false,
        LogRequestBody: false,
        LogResponseBody: false,
        MaxRequestBodySize: 536870912,
        Backends: [],
        RequiredModels: ['all-minilm'],
        LastIndex: 0,
      },
    ]);
  };

  const removeFrontend = (index: number) => {
    setFrontends(frontends.filter((_, i) => i !== index));
  };

  const handleSubmit = async (values: ConfigFormData) => {
    setLoading(true);
    try {
      // Validate form first
      const validationResult = await form.validateFields();
      console.log('Form validation result:', validationResult);

      // Get all form values
      const formValues = form.getFieldsValue();
      console.log('Form values from getFieldsValue():', formValues);
      console.log('Form values from onFinish:', values);

      // Use the validated values
      const finalValues = validationResult || formValues;
      console.log('Final config form data:', finalValues);

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Here you would typically save the config
    } catch (error) {
      console.error('Error saving config:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleManualSubmit = async () => {
    setLoading(true);
    try {
      // Create the final config object using state data
      const finalConfig = {
        Logging: defaultConfig.Logging,
        Frontends: frontends,
        Backends: backends,
        Webserver: defaultConfig.Webserver,
      };

      console.log('Final config to save:', finalConfig);

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Here you would typically save the config
    } catch (error) {
      console.error('Error saving config:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = () => {
    const values = form.getFieldsValue();
    const configData = JSON.stringify(values, null, 2);
    const blob = new Blob([configData], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'ollamaflow-config.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const steps = [
    {
      title: 'Backends',
      description: 'Configure your backend servers',
    },
    {
      title: 'Frontends',
      description: 'Configure your frontend settings',
    },
    {
      title: 'Review',
      description: 'Review and save configuration',
    },
  ];

  const renderBackendForm = () => (
    <div>
      <OllamaFlowTitle level={3} className={styles.configForm__sectionTitle}>
        Backend Configuration
      </OllamaFlowTitle>
      <OllamaFlowText className={styles.configForm__sectionDescription}>
        Configure your Ollama backend servers. These are the servers that will handle your model requests.
      </OllamaFlowText>

      {backends.map((backend, index) => (
        <BackendCard
          key={`backend-${index}`}
          backend={backend}
          index={index}
          onRemove={() => removeBackend(index)}
          onChange={(field, value) => handleBackendChange(index, field, value)}
          canRemove={backends.length > 1}
        />
      ))}

      <OllamaFlowButton
        type="dashed"
        onClick={addBackend}
        block
        icon={<PlusOutlined />}
        className={styles.configForm__addButton}
      >
        Add Backend
      </OllamaFlowButton>
    </div>
  );

  const renderFrontendForm = () => (
    <div>
      <OllamaFlowTitle level={3} className={styles.configForm__sectionTitle}>
        Frontend Configuration
      </OllamaFlowTitle>
      <OllamaFlowText className={styles.configForm__sectionDescription}>
        Configure your frontend settings. These settings control how requests are routed to your backends.
      </OllamaFlowText>

      {frontends.map((frontend, index) => (
        <FrontendCard
          key={`frontend-${index}`}
          frontend={frontend}
          index={index}
          onRemove={() => removeFrontend(index)}
          onChange={(field, value) => handleFrontendChange(index, field, value)}
          backends={backends}
        />
      ))}

      <OllamaFlowButton
        type="dashed"
        onClick={addFrontend}
        block
        icon={<PlusOutlined />}
        className={styles.configForm__addButton}
      >
        Add Frontend
      </OllamaFlowButton>
    </div>
  );

  const renderReview = () => {
    return (
      <div>
        <OllamaFlowTitle level={3} className={styles.configForm__sectionTitle}>
          Review Configuration
        </OllamaFlowTitle>
        <OllamaFlowText className={styles.configForm__sectionDescription}>
          Review your configuration before saving. The Logging and Webserver sections will use default values.
        </OllamaFlowText>

        <OllamaFlowCard className={styles.configForm__reviewCard}>
          <OllamaFlowTitle level={4}>Backends ({backends.length})</OllamaFlowTitle>
          <OllamaFlowText>
            {backends.length > 0 ? (
              backends.map((backend: Backend, index: number) => (
                <div key={index} className={styles.configForm__reviewItem}>
                  • {backend.Name || backend.Identifier} ({backend.Hostname}:{backend.Port}) - Health Check:{' '}
                  {backend.HealthCheckMethod?.Method || 'Not set'}
                </div>
              ))
            ) : (
              <div className={styles.configForm__reviewEmpty}>No backends configured</div>
            )}
          </OllamaFlowText>
        </OllamaFlowCard>

        <OllamaFlowCard className={styles.configForm__reviewCard}>
          <OllamaFlowTitle level={4}>Frontends ({frontends.length})</OllamaFlowTitle>
          <OllamaFlowText>
            {frontends.length > 0 ? (
              frontends.map((frontend: Frontend, index: number) => (
                <div key={index} className={styles.configForm__reviewItem}>
                  • {frontend.Name || frontend.Identifier} (Load Balancing: {frontend.LoadBalancing})
                </div>
              ))
            ) : (
              <div className={styles.configForm__reviewEmpty}>No frontends configured</div>
            )}
          </OllamaFlowText>
        </OllamaFlowCard>

        <OllamaFlowCard className={styles.configForm__reviewCard}>
          <OllamaFlowTitle level={4}>Other Sections</OllamaFlowTitle>
          <OllamaFlowText>
            <div className={styles.configForm__reviewItem}>• Logging: Using default configuration</div>
            <div className={styles.configForm__reviewItem}>• Webserver: Using default configuration</div>
          </OllamaFlowText>
        </OllamaFlowCard>
      </div>
    );
  };

  const next = () => {
    setCurrentStep(currentStep + 1);
  };

  const prev = () => {
    setCurrentStep(currentStep - 1);
  };

  return (
    <Layout className={styles.configForm}>
      <Content>
        <div className={styles.configForm__container}>
          {/* Header */}
          <div className={styles.configForm__header}>
            <OllamaFlowFlex align="center" className={styles.configForm__headerContent}>
              <OllamaFlowFlex>
                <OllamaFlowButton
                  icon={<ArrowLeftOutlined />}
                  onClick={onClose}
                  className={styles.configForm__headerBackButton}
                >
                  Back to Home
                </OllamaFlowButton>
                <OllamaFlowTitle level={2} className={styles.configForm__headerTitle}>
                  Generate New Configuration
                </OllamaFlowTitle>
              </OllamaFlowFlex>
              <OllamaFlowFlex className={styles.configForm__headerActions}>
                <OllamaFlowButton
                  icon={<DownloadOutlined />}
                  onClick={handleDownload}
                  className={`${styles.configForm__headerActionButton} ${styles.configForm__headerActionButtonSecondary}`}
                >
                  Download Config
                </OllamaFlowButton>
                <OllamaFlowButton
                  type="primary"
                  icon={<SaveOutlined />}
                  onClick={handleManualSubmit}
                  loading={loading}
                  className={`${styles.configForm__headerActionButton} ${styles.configForm__headerActionButtonPrimary}`}
                >
                  Save Configuration
                </OllamaFlowButton>
              </OllamaFlowFlex>
            </OllamaFlowFlex>
          </div>

          {/* Steps */}
          <div className={styles.configForm__steps}>
            <Steps current={currentStep} items={steps} />
          </div>

          {/* Form Content */}
          <div className={styles.configForm__content}>
            <Form form={form} layout="vertical" onFinish={handleSubmit} preserve={true}>
              {currentStep === 0 && renderBackendForm()}
              {currentStep === 1 && renderFrontendForm()}
              {currentStep === 2 && renderReview()}

              <Form.Item className={styles.configForm__actions}>
                <OllamaFlowFlex gap="large">
                  {currentStep > 0 && <OllamaFlowButton onClick={prev}>Previous</OllamaFlowButton>}
                  {currentStep < steps.length - 1 && (
                    <OllamaFlowButton type="primary" onClick={next}>
                      Next
                    </OllamaFlowButton>
                  )}
                  {currentStep === steps.length - 1 && (
                    <OllamaFlowButton type="primary" onClick={handleManualSubmit} loading={loading}>
                      Generate Configuration
                    </OllamaFlowButton>
                  )}
                </OllamaFlowFlex>
              </Form.Item>
            </Form>
          </div>
        </div>
      </Content>
    </Layout>
  );
};

// Separate components to avoid circular references
const BackendCard: React.FC<{
  backend: Backend;
  index: number;
  onRemove: () => void;
  onChange: (field: string, value: any) => void;
  canRemove: boolean;
}> = ({ backend, index, onRemove, onChange, canRemove }) => {
  const backendName = backend.Name;

  return (
    <OllamaFlowCard className={styles.configForm__card}>
      <div className={styles.configForm__cardHeader}>
        <OllamaFlowTitle level={4} className={styles.configForm__cardHeaderTitle}>
          {backendName ? `Backend: ${backendName}` : `Backend ${index + 1}`}
        </OllamaFlowTitle>
        <OllamaFlowButton
          type="text"
          danger
          icon={<DeleteOutlined />}
          onClick={onRemove}
          disabled={!canRemove}
          className={styles.configForm__cardHeaderRemove}
        >
          Remove
        </OllamaFlowButton>
      </div>

      <div className={styles.configForm__cardContent}>
        <Row gutter={[16, 16]} className={styles.configForm__formRow}>
          <Col span={12}>
            <Form.Item label="Name" rules={[{ required: true, message: 'Please enter name' }]}>
              <Input
                placeholder="e.g., backend1"
                value={backend.Name}
                onChange={(e) => onChange('Name', e.target.value)}
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="Identifier" rules={[{ required: true, message: 'Please enter identifier' }]}>
              <Input
                placeholder="Auto-generated from name"
                value={backend.Identifier}
                onChange={(e) => onChange('Identifier', e.target.value)}
              />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={[16, 16]} className={styles.configForm__formRow}>
          <Col span={12}>
            <Form.Item label="Hostname" rules={[{ required: true, message: 'Please enter hostname' }]}>
              <Input
                placeholder="localhost"
                value={backend.Hostname}
                onChange={(e) => onChange('Hostname', e.target.value)}
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="Port" rules={[{ required: true, message: 'Please enter port' }]}>
              <InputNumber
                placeholder="11435"
                style={{ width: '100%' }}
                min={1}
                max={65535}
                value={backend.Port}
                onChange={(value) => onChange('Port', value)}
              />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={[16, 16]} className={styles.configForm__formRow}>
          <Col span={8}>
            <Form.Item label="SSL" valuePropName="checked">
              <Switch checked={backend.Ssl} onChange={(checked) => onChange('Ssl', checked)} />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item
              label="Max Parallel Requests"
              rules={[{ required: true, message: 'Please enter max parallel requests' }]}
            >
              <InputNumber
                placeholder="4"
                style={{ width: '100%' }}
                min={1}
                max={100}
                value={backend.MaxParallelRequests}
                onChange={(value) => onChange('MaxParallelRequests', value)}
              />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item
              label="Rate Limit Threshold"
              rules={[{ required: true, message: 'Please enter rate limit threshold' }]}
            >
              <InputNumber
                placeholder="10"
                style={{ width: '100%' }}
                min={1}
                max={1000}
                value={backend.RateLimitRequestsThreshold}
                onChange={(value) => onChange('RateLimitRequestsThreshold', value)}
              />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={[16, 16]} className={styles.configForm__formRow}>
          <Col span={8}>
            <Form.Item
              label="Model Refresh Interval (ms)"
              rules={[{ required: true, message: 'Please enter refresh interval' }]}
            >
              <InputNumber
                placeholder="30000"
                style={{ width: '100%' }}
                min={1000}
                max={300000}
                value={backend.ModelRefreshIntervalMs}
                onChange={(value) => onChange('ModelRefreshIntervalMs', value)}
              />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item
              label="Health Check Interval (ms)"
              rules={[{ required: true, message: 'Please enter health check interval' }]}
            >
              <InputNumber
                placeholder="5000"
                style={{ width: '100%' }}
                min={1000}
                max={60000}
                value={backend.HealthCheckIntervalMs}
                onChange={(value) => onChange('HealthCheckIntervalMs', value)}
              />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label="Health Check URL" rules={[{ required: true, message: 'Please enter health check URL' }]}>
              <Input
                placeholder="/"
                value={backend.HealthCheckUrl}
                onChange={(e) => onChange('HealthCheckUrl', e.target.value)}
              />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={[16, 16]} className={styles.configForm__formRow}>
          <Col span={8}>
            <Form.Item
              label="Health Check Method"
              rules={[{ required: true, message: 'Please select health check method' }]}
            >
              <Select
                placeholder="Select health check method"
                value={backend.HealthCheckMethod?.Method}
                onChange={(value) => onChange('HealthCheckMethod', { Method: value })}
              >
                <Option value="HEAD">HEAD</Option>
                <Option value="GET">GET</Option>
                <Option value="POST">POST</Option>
                <Option value="PUT">PUT</Option>
                <Option value="DELETE">DELETE</Option>
                <Option value="PATCH">PATCH</Option>
                <Option value="OPTIONS">OPTIONS</Option>
              </Select>
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item
              label="Unhealthy Threshold"
              rules={[{ required: true, message: 'Please enter unhealthy threshold' }]}
            >
              <InputNumber
                placeholder="2"
                style={{ width: '100%' }}
                min={1}
                max={10}
                value={backend.UnhealthyThreshold}
                onChange={(value) => onChange('UnhealthyThreshold', value)}
              />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item
              label="Healthy Threshold"
              rules={[{ required: true, message: 'Please enter healthy threshold' }]}
            >
              <InputNumber
                placeholder="2"
                style={{ width: '100%' }}
                min={1}
                max={10}
                value={backend.HealthyThreshold}
                onChange={(value) => onChange('HealthyThreshold', value)}
              />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={[16, 16]} className={styles.configForm__formRow}>
          <Col span={12}>
            <Form.Item label="Log Request Body" valuePropName="checked">
              <Switch checked={backend.LogRequestBody} onChange={(checked) => onChange('LogRequestBody', checked)} />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="Log Response Body" valuePropName="checked">
              <Switch checked={backend.LogResponseBody} onChange={(checked) => onChange('LogResponseBody', checked)} />
            </Form.Item>
          </Col>
        </Row>
      </div>
    </OllamaFlowCard>
  );
};

const FrontendCard: React.FC<{
  frontend: Frontend;
  index: number;
  onRemove: () => void;
  onChange: (field: string, value: any) => void;
  backends: Backend[];
}> = ({ frontend, index, onRemove, onChange, backends }) => {
  const frontendName = frontend.Name;

  return (
    <OllamaFlowCard className={styles.configForm__card}>
      <div className={styles.configForm__cardHeader}>
        <OllamaFlowTitle level={4} className={styles.configForm__cardHeaderTitle}>
          {frontendName ? `Frontend: ${frontendName}` : `Frontend ${index + 1}`}
        </OllamaFlowTitle>
        <OllamaFlowButton
          type="text"
          danger
          icon={<DeleteOutlined />}
          onClick={onRemove}
          className={styles.configForm__cardHeaderRemove}
        >
          Remove
        </OllamaFlowButton>
      </div>

      <div className={styles.configForm__cardContent}>
        <Row gutter={[16, 16]} className={styles.configForm__formRow}>
          <Col span={12}>
            <Form.Item label="Identifier" rules={[{ required: true, message: 'Please enter identifier' }]}>
              <Input
                placeholder="e.g., frontend"
                value={frontend.Identifier}
                onChange={(e) => onChange('Identifier', e.target.value)}
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="Name" rules={[{ required: true, message: 'Please enter name' }]}>
              <Input
                placeholder="e.g., Default Ollama frontend"
                value={frontend.Name}
                onChange={(e) => onChange('Name', e.target.value)}
              />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={[16, 16]} className={styles.configForm__formRow}>
          <Col span={12}>
            <Form.Item label="Hostname" rules={[{ required: true, message: 'Please enter hostname' }]}>
              <Input
                placeholder="localhost"
                value={frontend.Hostname}
                onChange={(e) => onChange('Hostname', e.target.value)}
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="Timeout (ms)" rules={[{ required: true, message: 'Please enter timeout' }]}>
              <InputNumber
                placeholder="60000"
                style={{ width: '100%' }}
                min={1000}
                max={300000}
                value={frontend.TimeoutMs}
                onChange={(value) => onChange('TimeoutMs', value)}
              />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={[16, 16]} className={styles.configForm__formRow}>
          <Col span={12}>
            <Form.Item
              label="Load Balancing"
              rules={[{ required: true, message: 'Please select load balancing method' }]}
            >
              <Select
                placeholder="Select load balancing method"
                value={frontend.LoadBalancing}
                onChange={(value) => onChange('LoadBalancing', value)}
              >
                <Option value="RoundRobin">Round Robin</Option>
                <Option value="LeastConnections">Least Connections</Option>
                <Option value="Weighted">Weighted</Option>
              </Select>
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label="Max Request Body Size"
              rules={[{ required: true, message: 'Please enter max request body size' }]}
            >
              <InputNumber
                placeholder="536870912"
                style={{ width: '100%' }}
                min={1024}
                max={1073741824}
                value={frontend.MaxRequestBodySize}
                onChange={(value) => onChange('MaxRequestBodySize', value)}
              />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={[16, 16]} className={styles.configForm__formRow}>
          <Col span={8}>
            <Form.Item label="Block HTTP/1.0" valuePropName="checked">
              <Switch checked={frontend.BlockHttp10} onChange={(checked) => onChange('BlockHttp10', checked)} />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label="Log Full Request" valuePropName="checked">
              <Switch checked={frontend.LogRequestFull} onChange={(checked) => onChange('LogRequestFull', checked)} />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label="Log Request Body" valuePropName="checked">
              <Switch checked={frontend.LogRequestBody} onChange={(checked) => onChange('LogRequestBody', checked)} />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={[16, 16]} className={styles.configForm__formRow}>
          <Col span={24}>
            <Form.Item label="Log Response Body" valuePropName="checked">
              <Switch checked={frontend.LogResponseBody} onChange={(checked) => onChange('LogResponseBody', checked)} />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={[16, 16]} className={styles.configForm__formRow}>
          <Col span={24}>
            <Form.Item
              label="Backend Identifiers"
              rules={[{ required: true, message: 'Please enter backend identifiers' }]}
            >
              <Select
                mode="tags"
                placeholder="Enter backend identifiers (e.g., backend1, backend2)"
                value={frontend.Backends}
                onChange={(value) => onChange('Backends', value)}
              >
                {backends.map((backend: Backend, index: number) => (
                  <Option key={backend.Identifier} value={backend.Identifier}>
                    {backend.Identifier}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={[16, 16]} className={styles.configForm__formRow}>
          <Col span={24}>
            <Form.Item label="Required Models">
              <Select
                mode="tags"
                placeholder="Enter required models (e.g., all-minilm)"
                value={frontend.RequiredModels}
                onChange={(value) => onChange('RequiredModels', value)}
              >
                <Option value="all-minilm">all-minilm</Option>
                <Option value="llama2">llama2</Option>
                <Option value="mistral">mistral</Option>
              </Select>
            </Form.Item>
          </Col>
        </Row>
      </div>
    </OllamaFlowCard>
  );
};

export default ConfigForm;
