import React from 'react';
import { Form, Input, Button, Card, Space, Row, Col, InputNumber, Select, Switch } from 'antd';
import OllamaFlowFlex from '#/components/base/flex/Flex';
import OllamaFlowText from '#/components/base/typograpghy/Text';
import { CreateFrontendPayload, useGetBackendQuery } from '#/lib/store/slice/apiSlice';
import { generateSelectOptionsWithFormatter } from '#/utils/utils';

const { Option } = Select;

interface CreateEditFrontendProps {
  mode?: 'create' | 'edit';
  initialValues?: Partial<CreateFrontendPayload>;
  onSubmit?: (values: CreateFrontendPayload) => void;
  loading?: boolean;
}

const CreateEditFrontend: React.FC<CreateEditFrontendProps> = ({
  mode = 'create',
  initialValues,
  onSubmit,
  loading = false,
}) => {
  const [form] = Form.useForm();

  // Fetch backends for the Backend Identifiers field
  const { data: backends = [], isLoading: backendsLoading, isError: backendsError } = useGetBackendQuery(null);

  // Default values for a new frontend
  const defaultValues: Partial<CreateFrontendPayload> = {
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
  };

  const handleSubmit = (values: CreateFrontendPayload) => {
    console.log('Frontend form values:', values);
    onSubmit?.(values);
  };

  const isEditMode = mode === 'edit';

  return (
    <Card>
      <OllamaFlowFlex vertical gap={20}>
        <OllamaFlowText fontSize={20} weight={600}>
          {isEditMode ? 'Edit Frontend' : 'Create New Frontend'}
        </OllamaFlowText>

        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          initialValues={initialValues || defaultValues}
          autoComplete="off"
        >
          {/* Basic Information */}
          <Row gutter={[16, 16]}>
            <Col span={12}>
              <Form.Item
                label="Identifier"
                name="Identifier"
                rules={[
                  { required: true, message: 'Please enter an identifier' },
                  {
                    min: 2,
                    message: 'Identifier must be at least 2 characters',
                  },
                ]}
              >
                <Input placeholder="e.g., frontend" disabled={isEditMode} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="Name"
                name="Name"
                rules={[
                  { required: true, message: 'Please enter a frontend name' },
                  { min: 2, message: 'Name must be at least 2 characters' },
                ]}
              >
                <Input placeholder="e.g., Default Ollama frontend" />
              </Form.Item>
            </Col>
          </Row>

          {/* Network Configuration */}
          <Row gutter={[16, 16]}>
            <Col span={12}>
              <Form.Item
                label="Hostname"
                name="Hostname"
                rules={[{ required: true, message: 'Please enter a hostname' }]}
              >
                <Input placeholder="localhost" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="Timeout (ms)"
                name="TimeoutMs"
                rules={[{ required: true, message: 'Please enter a timeout value' }]}
              >
                <InputNumber placeholder="60000" style={{ width: '100%' }} min={1000} max={300000} />
              </Form.Item>
            </Col>
          </Row>

          {/* Load Balancing and Request Size */}
          <Row gutter={[16, 16]}>
            <Col span={12}>
              <Form.Item
                label="Load Balancing"
                name="LoadBalancing"
                rules={[
                  {
                    required: true,
                    message: 'Please select a load balancing method',
                  },
                ]}
              >
                <Select placeholder="Select load balancing method">
                  <Option value="RoundRobin">Round Robin</Option>
                  <Option value="LeastConnections">Least Connections</Option>
                  <Option value="Weighted">Weighted</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="Max Request Body Size"
                name="MaxRequestBodySize"
                rules={[
                  {
                    required: true,
                    message: 'Please enter max request body size',
                  },
                ]}
              >
                <InputNumber placeholder="536870912" style={{ width: '100%' }} min={1024} max={1073741824} />
              </Form.Item>
            </Col>
          </Row>

          {/* Boolean Switches */}
          <Row gutter={[16, 16]}>
            <Col span={8}>
              <Form.Item label="Block HTTP/1.0" name="BlockHttp10" valuePropName="checked">
                <Switch />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label="Log Full Request" name="LogRequestFull" valuePropName="checked">
                <Switch />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label="Log Request Body" name="LogRequestBody" valuePropName="checked">
                <Switch />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={[16, 16]}>
            <Col span={24}>
              <Form.Item label="Log Response Body" name="LogResponseBody" valuePropName="checked">
                <Switch />
              </Form.Item>
            </Col>
          </Row>

          {/* Backend and Models Configuration */}
          <Row gutter={[16, 16]}>
            <Col span={24}>
              <Form.Item
                label="Backend Identifiers"
                name="Backends"
                rules={[
                  {
                    required: true,
                    message: 'Please select at least one backend identifier',
                  },
                ]}
              >
                <Select
                  mode="multiple"
                  placeholder={
                    backendsLoading
                      ? 'Loading backends...'
                      : backendsError
                      ? 'Error loading backends'
                      : 'Select backend identifiers'
                  }
                  style={{ width: '100%' }}
                  loading={backendsLoading}
                  disabled={backendsLoading || backendsError}
                  allowClear
                >
                  {generateSelectOptionsWithFormatter(
                    backends,
                    'Identifier',
                    (backend) => `${backend.Name} (${backend.Identifier})`
                  )}
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={[16, 16]}>
            <Col span={24}>
              <Form.Item
                label="Required Models"
                name="RequiredModels"
                rules={[
                  {
                    required: true,
                    message: 'Please select at least one required model',
                  },
                ]}
              >
                <Select mode="tags" placeholder="Enter required models (e.g., all-minilm)" style={{ width: '100%' }}>
                  <Option value="all-minilm">all-minilm</Option>
                  <Option value="llama2">llama2</Option>
                  <Option value="mistral">mistral</Option>
                  <Option value="codellama">codellama</Option>
                  <Option value="vicuna">vicuna</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>

          {/* Submit Buttons */}
          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit" loading={loading}>
                {isEditMode ? 'Update Frontend' : 'Create Frontend'}
              </Button>
              <Button onClick={() => form.resetFields()} disabled={loading}>
                Reset
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </OllamaFlowFlex>
    </Card>
  );
};

export default CreateEditFrontend;
