import React, { useState, useEffect } from 'react';
import {
  Layout,
  Form,
  Input,
  Select,
  Switch,
  Space,
  Divider,
  Row,
  Col,
  InputNumber,
  Tooltip,
  message,
  Button,
} from 'antd';
import {
  ArrowLeftOutlined,
  SaveOutlined,
  DownloadOutlined,
  PlusOutlined,
  DeleteOutlined,
  EditOutlined,
  EyeOutlined,
  FileTextOutlined,
  CloudServerOutlined,
  GlobalOutlined,
  CheckCircleOutlined,
  ExclamationCircleOutlined,
  SettingOutlined,
  ToolOutlined,
  HeartOutlined,
} from '@ant-design/icons';
import OllamaFlowCard from '../../components/base/card/Card';
import OllamaFlowButton from '../../components/base/button/Button';
import OllamaFlowTitle from '../../components/base/typograpghy/Title';
import OllamaFlowText from '../../components/base/typograpghy/Text';
import OllamaFlowFlex from '../../components/base/flex/Flex';
import OllamaFlowModal from '../../components/base/modal/Modal';
import type { FormInstance } from 'antd/es/form';
import { useAppContext } from '../../hooks/appHooks';
import { Configuration } from '../../types/types';
import styles from './ConfigForm.module.scss';

const { Content } = Layout;
const { TextArea } = Input;
const { Option } = Select;

interface ConfigFormProps {
  onClose: () => void;
  editConfig?: Configuration | null;
  mode?: 'create' | 'edit' | 'preview';
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
  Logging: Record<string, unknown>;
  Frontends: Frontend[];
  Backends: Backend[];
  Webserver: Record<string, unknown>;
}

const ConfigForm: React.FC<ConfigFormProps> = ({ onClose, editConfig = null, mode = 'create' }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const { addConfiguration, updateConfiguration } = useAppContext();
  const [isPreviewMode, setIsPreviewMode] = useState(mode === 'preview');
  const [showJsonPreview, setShowJsonPreview] = useState(false);
  const [generatedConfig, setGeneratedConfig] = useState<ConfigFormData | null>(null);
  const [isFormValid, setIsFormValid] = useState(false);
  const isEditMode = mode === 'edit';
  const isCreateMode = mode === 'create';

  const [backends, setBackends] = useState(() => {
    if (editConfig && editConfig.config.Backends) {
      return editConfig.config.Backends;
    }
    return [
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
    ];
  });
  const [frontends, setFrontends] = useState(() => {
    if (editConfig && editConfig.config.Frontends) {
      return editConfig.config.Frontends;
    }
    return [
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
    ];
  });

  // Validation functions
  const validateBackend = (backend: Backend): boolean => {
    return !!(
      backend.Name &&
      backend.Name.trim() !== '' &&
      backend.Identifier &&
      backend.Identifier.trim() !== '' &&
      backend.Hostname &&
      backend.Hostname.trim() !== '' &&
      backend.Port &&
      backend.Port > 0 &&
      backend.MaxParallelRequests &&
      backend.MaxParallelRequests > 0 &&
      backend.RateLimitRequestsThreshold &&
      backend.RateLimitRequestsThreshold > 0 &&
      backend.ModelRefreshIntervalMs &&
      backend.ModelRefreshIntervalMs > 0 &&
      backend.HealthCheckIntervalMs &&
      backend.HealthCheckIntervalMs > 0 &&
      backend.HealthCheckUrl &&
      backend.HealthCheckUrl.trim() !== '' &&
      backend.HealthCheckMethod?.Method &&
      backend.HealthCheckMethod.Method.trim() !== '' &&
      backend.UnhealthyThreshold &&
      backend.UnhealthyThreshold > 0 &&
      backend.HealthyThreshold &&
      backend.HealthyThreshold > 0
    );
  };

  const validateFrontend = (frontend: Frontend): boolean => {
    return !!(
      frontend.Name &&
      frontend.Name.trim() !== '' &&
      frontend.Identifier &&
      frontend.Identifier.trim() !== '' &&
      frontend.Hostname &&
      frontend.Hostname.trim() !== '' &&
      frontend.TimeoutMs &&
      frontend.TimeoutMs > 0 &&
      frontend.LoadBalancing &&
      frontend.LoadBalancing.trim() !== '' &&
      frontend.MaxRequestBodySize &&
      frontend.MaxRequestBodySize > 0 &&
      frontend.Backends &&
      frontend.Backends.length > 0 &&
      frontend.RequiredModels &&
      frontend.RequiredModels.length > 0
    );
  };

  const validateForm = (): boolean => {
    // Check if we have at least one backend and one frontend
    if (backends.length === 0 || frontends.length === 0) {
      return false;
    }

    // Validate all backends
    const backendsValid = backends.every(validateBackend);
    if (!backendsValid) {
      return false;
    }

    // Validate all frontends
    const frontendsValid = frontends.every(validateFrontend);
    if (!frontendsValid) {
      return false;
    }

    return true;
  };

  // Update form validation whenever backends or frontends change
  useEffect(() => {
    const isValid = validateForm();
    setIsFormValid(isValid);
  }, [backends, frontends]);

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

  const handleBackendChange = (index: number, field: string, value: unknown) => {
    const newBackends = [...backends];
    newBackends[index] = { ...newBackends[index], [field]: value };
    setBackends(newBackends);
  };

  const handleFrontendChange = (index: number, field: string, value: unknown) => {
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
      setBackends(backends.filter((_: Backend, i: number) => i !== index));
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
    setFrontends(frontends.filter((_: Frontend, i: number) => i !== index));
  };

  const handleSubmit = async () => {
    // Final validation before submission
    if (!validateForm()) {
      message.error('Please fill in all required fields before generating the configuration.');
      return;
    }

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
      setGeneratedConfig(finalConfig);
      setShowJsonPreview(true);

      // Generate a configuration name based on the first backend
      const configName = backends[0]?.Name || 'New Configuration';

      // Create configuration object
      const newConfiguration = {
        id: Date.now().toString(),
        name: configName,
        createdAt: new Date(),
        updatedAt: new Date(),
        config: finalConfig,
      };

      // Save to app context
      if (isEditMode && editConfig) {
        updateConfiguration(editConfig.id, { ...newConfiguration, id: editConfig.id });
        message.success('Configuration updated and saved to localStorage!');
      } else {
        addConfiguration(newConfiguration);
        message.success('Configuration created and saved to localStorage!');
      }
    } catch (error) {
      console.error('Error saving config:', error);
      message.error('Error generating configuration');
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = () => {
    if (!generatedConfig) return;

    const configName = backends[0]?.Name || 'New Configuration';
    const configData = JSON.stringify(generatedConfig, null, 2);
    const blob = new Blob([configData], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${configName.replace(/\s+/g, '-').toLowerCase()}-config.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    message.success('Configuration downloaded successfully!');
  };

  const handleBackToForm = () => {
    setShowJsonPreview(false);
    setGeneratedConfig(null);
  };

  const handleToggleMode = () => {
    setIsPreviewMode(!isPreviewMode);
  };

  const renderBackendSection = () => (
    <div className={styles.configForm__section}>
      <div className={styles.configForm__sectionHeader}>
        <OllamaFlowFlex align="center" gap="small">
          <CloudServerOutlined className={styles.configForm__sectionIcon} />
          <OllamaFlowTitle level={3} className={styles.configForm__sectionTitle}>
            Backend Configuration
          </OllamaFlowTitle>
        </OllamaFlowFlex>
        <OllamaFlowText className={styles.configForm__sectionDescription}>
          Configure your backend servers. These are the Ollama instances that will handle your requests.
        </OllamaFlowText>
      </div>

      {backends.map((backend: Backend, index: number) => (
        <BackendCard
          key={`backend-${index}`}
          backend={backend}
          index={index}
          onRemove={() => removeBackend(index)}
          onChange={(field, value) => handleBackendChange(index, field, value)}
          canRemove={backends.length > 1}
          isPreview={isPreviewMode}
          isValid={validateBackend(backend)}
        />
      ))}

      {!isPreviewMode && (
        <OllamaFlowButton
          type="dashed"
          onClick={addBackend}
          block
          icon={<PlusOutlined />}
          className={styles.configForm__addButton}
        >
          Add Backend Server
        </OllamaFlowButton>
      )}
    </div>
  );

  const renderFrontendSection = () => (
    <div className={styles.configForm__section}>
      <div className={styles.configForm__sectionHeader}>
        <OllamaFlowFlex align="center" gap="small">
          <GlobalOutlined className={styles.configForm__sectionIcon} />
          <OllamaFlowTitle level={3} className={styles.configForm__sectionTitle}>
            Frontend Configuration
          </OllamaFlowTitle>
        </OllamaFlowFlex>
        <OllamaFlowText className={styles.configForm__sectionDescription}>
          Configure your frontend settings. These settings control how requests are routed to your backends.
        </OllamaFlowText>
      </div>

      {frontends.map((frontend: Frontend, index: number) => (
        <FrontendCard
          key={`frontend-${index}`}
          frontend={frontend}
          index={index}
          onRemove={() => removeFrontend(index)}
          onChange={(field, value) => handleFrontendChange(index, field, value)}
          backends={backends}
          isPreview={isPreviewMode}
          isValid={validateFrontend(frontend)}
        />
      ))}

      {!isPreviewMode && (
        <OllamaFlowButton
          type="dashed"
          onClick={addFrontend}
          block
          icon={<PlusOutlined />}
          className={styles.configForm__addButton}
        >
          Add Frontend Configuration
        </OllamaFlowButton>
      )}
    </div>
  );

  const renderJsonPreview = () => (
    <div className={styles.configForm__preview}>
      <div className={styles.configForm__previewHeader}>
        <OllamaFlowFlex align="center" gap="small">
          <FileTextOutlined className={styles.configForm__sectionIcon} />
          <OllamaFlowTitle level={3} className={styles.configForm__sectionTitle}>
            Configuration Preview
          </OllamaFlowTitle>
        </OllamaFlowFlex>
        <OllamaFlowText className={styles.configForm__sectionDescription}>
          Review your generated configuration JSON. You can download this configuration file.
        </OllamaFlowText>
      </div>

      <OllamaFlowCard className={styles.configForm__previewCard}>
        <div className={styles.configForm__previewActions}>
          <OllamaFlowButton
            type="primary"
            icon={<DownloadOutlined />}
            onClick={handleDownload}
            className={styles.configForm__previewDownloadButton}
          >
            Download Configuration
          </OllamaFlowButton>
          <OllamaFlowButton
            icon={<ArrowLeftOutlined />}
            onClick={handleBackToForm}
            className={styles.configForm__previewBackButton}
          >
            Back to Form
          </OllamaFlowButton>
        </div>

        <div className={styles.configForm__previewContent}>
          <TextArea
            value={generatedConfig ? JSON.stringify(generatedConfig, null, 2) : ''}
            rows={20}
            readOnly
            className={styles.configForm__previewTextarea}
          />
        </div>
      </OllamaFlowCard>
    </div>
  );

  if (showJsonPreview) {
    return (
      <Layout className={styles.configForm}>
        <Content>
          <div className={styles.configForm__container}>
            {/* Header */}
            <div className={styles.configForm__header}>
              <OllamaFlowFlex align="center" className={styles.configForm__headerContent}>
                <OllamaFlowFlex>
                  <Tooltip title="Back to Home">
                    <OllamaFlowButton
                      icon={<ArrowLeftOutlined />}
                      onClick={onClose}
                      className={styles.configForm__headerBackButton}
                    />
                  </Tooltip>
                  <OllamaFlowTitle level={2} className={styles.configForm__headerTitle}>
                    Configuration Preview
                  </OllamaFlowTitle>
                </OllamaFlowFlex>
              </OllamaFlowFlex>
            </div>

            {/* Preview Content */}
            <div className={styles.configForm__content}>{renderJsonPreview()}</div>
          </div>
        </Content>
      </Layout>
    );
  }

  return (
    <Layout className={styles.configForm}>
      <Content>
        <div className={styles.configForm__container}>
          {/* Header */}
          <div className={styles.configForm__header}>
            <OllamaFlowFlex align="center" className={styles.configForm__headerContent}>
              <OllamaFlowFlex>
                <Tooltip title="Back to Home">
                  <OllamaFlowButton
                    icon={<ArrowLeftOutlined />}
                    onClick={onClose}
                    className={styles.configForm__headerBackButton}
                  />
                </Tooltip>
                <OllamaFlowTitle level={2} className={styles.configForm__headerTitle}>
                  {isPreviewMode
                    ? `Preview: ${editConfig?.name || 'Configuration'}`
                    : isEditMode
                    ? `Edit: ${editConfig?.name || 'Configuration'}`
                    : 'Generate New Configuration'}
                </OllamaFlowTitle>
              </OllamaFlowFlex>
              <OllamaFlowFlex className={styles.configForm__headerActions}>
                {(isEditMode || mode === 'preview') && (
                  <div className={styles.configForm__toggleContainer}>
                    <span className={styles.configForm__toggleLabel}>Preview</span>
                    <Switch
                      checked={!isPreviewMode}
                      onChange={handleToggleMode}
                      className={styles.configForm__toggleSwitch}
                    />
                    <span className={styles.configForm__toggleLabel}>Edit</span>
                  </div>
                )}
              </OllamaFlowFlex>
            </OllamaFlowFlex>
          </div>

          {/* Form Content */}
          <div className={styles.configForm__content}>
            <Form form={form} layout="vertical" preserve={true}>
              {renderBackendSection()}
              <Divider />
              {renderFrontendSection()}
            </Form>

            {/* Generate Button at Bottom */}
            {!isPreviewMode && (
              <div className={styles.configForm__bottomActions}>
                <Tooltip
                  title={
                    isFormValid
                      ? isEditMode
                        ? 'Update Configuration'
                        : 'Generate Configuration'
                      : 'Please fill in all required fields'
                  }
                >
                  <OllamaFlowButton
                    type="primary"
                    size="large"
                    icon={<SaveOutlined />}
                    onClick={handleSubmit}
                    loading={loading}
                    disabled={!isFormValid}
                    className={styles.configForm__generateButton}
                  >
                    {isEditMode ? 'Update Configuration' : 'Generate Configuration'}
                  </OllamaFlowButton>
                </Tooltip>
              </div>
            )}
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
  onChange: (field: string, value: unknown) => void;
  canRemove: boolean;
  isPreview?: boolean;
  isValid?: boolean;
}> = ({ backend, index, onRemove, onChange, canRemove, isPreview = false, isValid = false }) => {
  const backendName = backend.Name;

  return (
    <OllamaFlowCard className={`${styles.configForm__card} ${!isValid ? styles.configForm__cardInvalid : ''}`}>
      <div className={styles.configForm__cardHeader}>
        <OllamaFlowFlex align="center" gap="small">
          <CloudServerOutlined className={styles.configForm__cardIcon} />
          <OllamaFlowTitle level={4} className={styles.configForm__cardHeaderTitle}>
            {backendName ? `Backend: ${backendName}` : `Backend ${index + 1}`}
          </OllamaFlowTitle>
          {!isValid && (
            <span className={styles.configForm__cardValidation}>
              <ExclamationCircleOutlined />
              Required fields missing
            </span>
          )}
        </OllamaFlowFlex>
        {!isPreview && (
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
        )}
      </div>

      <div className={styles.configForm__cardContent}>
        {/* Basic Settings Section */}
        <div className={styles.configForm__fieldGroup}>
          <div className={styles.configForm__fieldGroupHeader}>
            <OllamaFlowTitle level={5} className={styles.configForm__fieldGroupTitle}>
              <SettingOutlined /> Basic Settings
            </OllamaFlowTitle>
            <OllamaFlowText className={styles.configForm__fieldGroupDescription}>
              Essential configuration for the backend server
            </OllamaFlowText>
          </div>

          <Row gutter={[16, 16]} className={styles.configForm__formRow}>
            <Col xs={24} md={12}>
              <Form.Item label="Name" required tooltip="A descriptive name for this backend server">
                <Input
                  placeholder="e.g., backend1"
                  value={backend.Name}
                  onChange={(e) => onChange('Name', e.target.value)}
                  disabled={isPreview}
                />
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item label="Identifier" required tooltip="Unique identifier for this backend">
                <Input
                  placeholder="Auto-generated from name"
                  value={backend.Identifier}
                  onChange={(e) => onChange('Identifier', e.target.value)}
                  disabled={isPreview}
                />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={[16, 16]} className={styles.configForm__formRow}>
            <Col xs={24} md={12}>
              <Form.Item label="Hostname" required tooltip="The hostname or IP address of the backend server">
                <Input
                  placeholder="localhost"
                  value={backend.Hostname}
                  onChange={(e) => onChange('Hostname', e.target.value)}
                  disabled={isPreview}
                />
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item label="Port" required tooltip="The port number the backend server is listening on">
                <InputNumber
                  placeholder="11435"
                  style={{ width: '100%' }}
                  min={1}
                  max={65535}
                  value={backend.Port}
                  onChange={(value) => onChange('Port', value)}
                  disabled={isPreview}
                />
              </Form.Item>
            </Col>
          </Row>
        </div>

        {/* Advanced Options Section */}
        <div className={styles.configForm__fieldGroup}>
          <div className={styles.configForm__fieldGroupHeader}>
            <OllamaFlowTitle level={5} className={styles.configForm__fieldGroupTitle}>
              <ToolOutlined /> Advanced Options
            </OllamaFlowTitle>
            <OllamaFlowText className={styles.configForm__fieldGroupDescription}>
              Performance and security settings
            </OllamaFlowText>
          </div>

          <Row gutter={[16, 16]} className={styles.configForm__formRow}>
            <Col xs={24} md={8}>
              <Form.Item label="SSL" valuePropName="checked" tooltip="Enable SSL/TLS encryption">
                <Switch checked={backend.Ssl} onChange={(checked) => onChange('Ssl', checked)} disabled={isPreview} />
              </Form.Item>
            </Col>
            <Col xs={24} md={8}>
              <Form.Item
                label="Max Parallel Requests"
                required
                tooltip="Maximum number of concurrent requests this backend can handle"
              >
                <InputNumber
                  placeholder="4"
                  style={{ width: '100%' }}
                  min={1}
                  max={100}
                  value={backend.MaxParallelRequests}
                  onChange={(value) => onChange('MaxParallelRequests', value)}
                  disabled={isPreview}
                />
              </Form.Item>
            </Col>
            <Col xs={24} md={8}>
              <Form.Item
                label="Rate Limit Threshold"
                required
                tooltip="Maximum requests per second before rate limiting"
              >
                <InputNumber
                  placeholder="10"
                  style={{ width: '100%' }}
                  min={1}
                  max={1000}
                  value={backend.RateLimitRequestsThreshold}
                  onChange={(value) => onChange('RateLimitRequestsThreshold', value)}
                  disabled={isPreview}
                />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={[16, 16]} className={styles.configForm__formRow}>
            <Col xs={24} md={12}>
              <Form.Item
                label="Model Refresh Interval (ms)"
                required
                tooltip="How often to refresh the model list from this backend"
              >
                <InputNumber
                  placeholder="30000"
                  style={{ width: '100%' }}
                  min={1000}
                  max={300000}
                  value={backend.ModelRefreshIntervalMs}
                  onChange={(value) => onChange('ModelRefreshIntervalMs', value)}
                  disabled={isPreview}
                />
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item
                label="Health Check Interval (ms)"
                required
                tooltip="How often to check if this backend is healthy"
              >
                <InputNumber
                  placeholder="5000"
                  style={{ width: '100%' }}
                  min={1000}
                  max={60000}
                  value={backend.HealthCheckIntervalMs}
                  onChange={(value) => onChange('HealthCheckIntervalMs', value)}
                  disabled={isPreview}
                />
              </Form.Item>
            </Col>
          </Row>
        </div>

        {/* Health Checks Section */}
        <div className={styles.configForm__fieldGroup}>
          <div className={styles.configForm__fieldGroupHeader}>
            <OllamaFlowTitle level={5} className={styles.configForm__fieldGroupTitle}>
              <HeartOutlined /> Health Checks
            </OllamaFlowTitle>
            <OllamaFlowText className={styles.configForm__fieldGroupDescription}>
              Configure how to monitor backend health and availability
            </OllamaFlowText>
          </div>

          <Row gutter={[16, 16]} className={styles.configForm__formRow}>
            <Col xs={24} md={12}>
              <Form.Item label="Health Check URL" required tooltip="The endpoint to check for backend health">
                <Input
                  placeholder="/"
                  value={backend.HealthCheckUrl}
                  onChange={(e) => onChange('HealthCheckUrl', e.target.value)}
                  disabled={isPreview}
                />
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item label="Health Check Method" required tooltip="HTTP method to use for health checks">
                <Select
                  placeholder="Select health check method"
                  value={backend.HealthCheckMethod?.Method}
                  onChange={(value) => onChange('HealthCheckMethod', { Method: value })}
                  disabled={isPreview}
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
          </Row>

          <Row gutter={[16, 16]} className={styles.configForm__formRow}>
            <Col xs={24} md={12}>
              <Form.Item
                label="Unhealthy Threshold"
                required
                tooltip="Number of failed checks before marking backend as unhealthy"
              >
                <InputNumber
                  placeholder="2"
                  style={{ width: '100%' }}
                  min={1}
                  max={10}
                  value={backend.UnhealthyThreshold}
                  onChange={(value) => onChange('UnhealthyThreshold', value)}
                  disabled={isPreview}
                />
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item
                label="Healthy Threshold"
                required
                tooltip="Number of successful checks before marking backend as healthy"
              >
                <InputNumber
                  placeholder="2"
                  style={{ width: '100%' }}
                  min={1}
                  max={10}
                  value={backend.HealthyThreshold}
                  onChange={(value) => onChange('HealthyThreshold', value)}
                  disabled={isPreview}
                />
              </Form.Item>
            </Col>
          </Row>
        </div>

        {/* Logging Section */}
        <div className={styles.configForm__fieldGroup}>
          <div className={styles.configForm__fieldGroupHeader}>
            <OllamaFlowTitle level={5} className={styles.configForm__fieldGroupTitle}>
              <FileTextOutlined /> Logging Options
            </OllamaFlowTitle>
            <OllamaFlowText className={styles.configForm__fieldGroupDescription}>
              Configure what information to log for this backend
            </OllamaFlowText>
          </div>

          <Row gutter={[16, 16]} className={styles.configForm__formRow}>
            <Col xs={24} md={12}>
              <Form.Item
                label="Log Request Body"
                valuePropName="checked"
                tooltip="Log the full request body for debugging"
              >
                <Switch
                  checked={backend.LogRequestBody}
                  onChange={(checked) => onChange('LogRequestBody', checked)}
                  disabled={isPreview}
                />
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item
                label="Log Response Body"
                valuePropName="checked"
                tooltip="Log the full response body for debugging"
              >
                <Switch
                  checked={backend.LogResponseBody}
                  onChange={(checked) => onChange('LogResponseBody', checked)}
                  disabled={isPreview}
                />
              </Form.Item>
            </Col>
          </Row>
        </div>
      </div>
    </OllamaFlowCard>
  );
};

const FrontendCard: React.FC<{
  frontend: Frontend;
  index: number;
  onRemove: () => void;
  onChange: (field: string, value: unknown) => void;
  backends: Backend[];
  isPreview?: boolean;
  isValid?: boolean;
}> = ({ frontend, index, onRemove, onChange, backends, isPreview = false, isValid = false }) => {
  const frontendName = frontend.Name;

  return (
    <OllamaFlowCard className={`${styles.configForm__card} ${!isValid ? styles.configForm__cardInvalid : ''}`}>
      <div className={styles.configForm__cardHeader}>
        <OllamaFlowFlex align="center" gap="small">
          <GlobalOutlined className={styles.configForm__cardIcon} />
          <OllamaFlowTitle level={4} className={styles.configForm__cardHeaderTitle}>
            {frontendName ? `Frontend: ${frontendName}` : `Frontend ${index + 1}`}
          </OllamaFlowTitle>
          {!isValid && (
            <span className={styles.configForm__cardValidation}>
              <ExclamationCircleOutlined />
              Required fields missing
            </span>
          )}
        </OllamaFlowFlex>
        {!isPreview && (
          <OllamaFlowButton
            type="text"
            danger
            icon={<DeleteOutlined />}
            onClick={onRemove}
            className={styles.configForm__cardHeaderRemove}
          >
            Remove
          </OllamaFlowButton>
        )}
      </div>

      <div className={styles.configForm__cardContent}>
        <Row gutter={[16, 16]} className={styles.configForm__formRow}>
          <Col span={12}>
            <Form.Item label="Identifier" required>
              <Input
                placeholder="e.g., frontend"
                value={frontend.Identifier}
                onChange={(e) => onChange('Identifier', e.target.value)}
                disabled={isPreview}
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="Name" required>
              <Input
                placeholder="e.g., Default Ollama frontend"
                value={frontend.Name}
                onChange={(e) => onChange('Name', e.target.value)}
                disabled={isPreview}
              />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={[16, 16]} className={styles.configForm__formRow}>
          <Col span={12}>
            <Form.Item label="Hostname" required>
              <Input
                placeholder="localhost"
                value={frontend.Hostname}
                onChange={(e) => onChange('Hostname', e.target.value)}
                disabled={isPreview}
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="Timeout (ms)" required>
              <InputNumber
                placeholder="60000"
                style={{ width: '100%' }}
                min={1000}
                max={300000}
                value={frontend.TimeoutMs}
                onChange={(value) => onChange('TimeoutMs', value)}
                disabled={isPreview}
              />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={[16, 16]} className={styles.configForm__formRow}>
          <Col span={12}>
            <Form.Item label="Load Balancing" required>
              <Select
                placeholder="Select load balancing method"
                value={frontend.LoadBalancing}
                onChange={(value) => onChange('LoadBalancing', value)}
                disabled={isPreview}
              >
                <Option value="RoundRobin">Round Robin</Option>
                <Option value="LeastConnections">Least Connections</Option>
                <Option value="Weighted">Weighted</Option>
              </Select>
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="Max Request Body Size" required>
              <InputNumber
                placeholder="536870912"
                style={{ width: '100%' }}
                min={1024}
                max={1073741824}
                value={frontend.MaxRequestBodySize}
                onChange={(value) => onChange('MaxRequestBodySize', value)}
                disabled={isPreview}
              />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={[16, 16]} className={styles.configForm__formRow}>
          <Col span={8}>
            <Form.Item label="Block HTTP/1.0" valuePropName="checked">
              <Switch
                checked={frontend.BlockHttp10}
                onChange={(checked) => onChange('BlockHttp10', checked)}
                disabled={isPreview}
              />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label="Log Full Request" valuePropName="checked">
              <Switch
                checked={frontend.LogRequestFull}
                onChange={(checked) => onChange('LogRequestFull', checked)}
                disabled={isPreview}
              />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label="Log Request Body" valuePropName="checked">
              <Switch
                checked={frontend.LogRequestBody}
                onChange={(checked) => onChange('LogRequestBody', checked)}
                disabled={isPreview}
              />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={[16, 16]} className={styles.configForm__formRow}>
          <Col span={24}>
            <Form.Item label="Log Response Body" valuePropName="checked">
              <Switch
                checked={frontend.LogResponseBody}
                onChange={(checked) => onChange('LogResponseBody', checked)}
                disabled={isPreview}
              />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={[16, 16]} className={styles.configForm__formRow}>
          <Col span={24}>
            <Form.Item label="Backend Identifiers" required>
              <Select
                mode="tags"
                placeholder="Enter backend identifiers (e.g., backend1, backend2)"
                value={frontend.Backends}
                onChange={(value) => onChange('Backends', value)}
                disabled={isPreview}
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
            <Form.Item label="Required Models" required>
              <Select
                mode="tags"
                placeholder="Enter required models (e.g., all-minilm)"
                value={frontend.RequiredModels}
                onChange={(value) => onChange('RequiredModels', value)}
                disabled={isPreview}
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
