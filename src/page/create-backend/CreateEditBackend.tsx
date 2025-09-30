import React from "react";
import {
  Form,
  Input,
  Button,
  Space,
  Row,
  Col,
  InputNumber,
  Select,
  Switch,
  Alert,
} from "antd";
import dynamic from "next/dynamic";
import { CreateBackendPayload } from "#/lib/store/slice/apiSlice";
import PageLoading from "#/components/base/loading/PageLoading";

// Dynamically import JsonEditor to avoid SSR issues
const JsonEditor = dynamic(
  () => import("jsoneditor-react").then((mod) => mod.JsonEditor),
  {
    ssr: false,
    loading: () => <PageLoading message="Loading JSON Editor..." />,
  }
) as any;

const { Option } = Select;

interface CreateEditBackendProps {
  mode?: "create" | "edit";
  initialValues?: Partial<CreateBackendPayload>;
  onSubmit?: (values: CreateBackendPayload) => void;
  loading?: boolean;
}

const CreateEditBackend: React.FC<CreateEditBackendProps> = ({
  mode = "create",
  initialValues,
  onSubmit,
  loading = false,
}) => {
  const [form] = Form.useForm();
  const [logRequestBody, setLogRequestBody] = React.useState(false);
  const [logResponseBody, setLogResponseBody] = React.useState(false);

  // Sync state with initial values
  React.useEffect(() => {
    if (initialValues) {
      setLogRequestBody(initialValues.LogRequestBody || false);
      setLogResponseBody(initialValues.LogResponseBody || false);
    }
  }, [initialValues]);

  // Default values for a new backend
  const defaultValues: Partial<CreateBackendPayload> = {
    Identifier: "",
    Hostname: "localhost",
    Port: 11435,
    Ssl: false,
    ApiFormat: "Ollama",
    HealthCheckMethod: { Method: "HEAD" },
    HealthCheckUrl: "/",
    MaxParallelRequests: 4,
    RateLimitRequestsThreshold: 10,
    UnhealthyThreshold: 2,
    HealthyThreshold: 2,
    LogRequestBody: false,
    LogResponseBody: false,
    PinnedEmbeddingsProperties: {},
    PinnedCompletionsProperties: {},
    AllowEmbeddings: true,
    AllowCompletions: true,
  };

  const handleSubmit = (values: CreateBackendPayload) => {
    console.log("Backend form values:", values);
    onSubmit?.(values);
  };

  const isEditMode = mode === "edit";

  return (
    <Form
      form={form}
      layout="vertical"
      onFinish={handleSubmit}
      initialValues={initialValues || defaultValues}
      autoComplete="off"
    >
      {/* Basic Information */}
      <Row gutter={16}>
        <Col xs={24} sm={24} md={24} lg={12} xl={12}>
          <Form.Item
            label="Identifier"
            name="Identifier"
            rules={[
              { required: true, message: "Please enter an identifier" },
              {
                min: 2,
                message: "Identifier must be at least 2 characters",
              },
              {
                pattern: /^\S*$/,
                message: "Identifier cannot contain spaces",
              },
            ]}
          >
            <Input placeholder="e.g., backend" disabled={isEditMode} />
          </Form.Item>
        </Col>
        <Col xs={24} sm={24} md={24} lg={12} xl={12}>
          <Form.Item
            label="Name"
            name="Name"
            rules={[
              { required: true, message: "Please enter a backend name" },
              { min: 2, message: "Name must be at least 2 characters" },
            ]}
          >
            <Input placeholder="e.g., Default Ollama backend" />
          </Form.Item>
        </Col>
      </Row>

      {/* Network Configuration */}
      <Row gutter={16}>
        <Col xs={24} sm={24} md={24} lg={12} xl={12}>
          <Form.Item
            label="Hostname"
            name="Hostname"
            rules={[{ required: true, message: "Please enter a hostname" }]}
          >
            <Input placeholder="localhost" />
          </Form.Item>
        </Col>
        <Col xs={24} sm={24} md={24} lg={12} xl={12}>
          <Form.Item
            label="Port"
            name="Port"
            rules={[{ required: true, message: "Please enter a port number" }]}
          >
            <InputNumber
              placeholder="11435"
              style={{ width: "100%" }}
              min={1}
              max={65535}
            />
          </Form.Item>
        </Col>
      </Row>

      {/* API Configuration */}
      <Row gutter={16}>
        <Col xs={24} sm={24} md={24} lg={12} xl={12}>
          <Form.Item
            label="API Format"
            name="ApiFormat"
            rules={[
              {
                required: true,
                message: "Please select an API format",
              },
            ]}
          >
            <Select placeholder="Select API format">
              <Option value="Ollama">Ollama</Option>
              <Option value="OpenAI">OpenAI</Option>
            </Select>
          </Form.Item>
        </Col>
      </Row>

      {/* SSL and Advanced Options */}
      <Row gutter={16}>
        <Col xs={24} sm={24} md={24} lg={12} xl={12}>
          <Form.Item
            label="Max Parallel Requests"
            name="MaxParallelRequests"
            rules={[
              {
                required: true,
                message: "Please enter max parallel requests",
              },
            ]}
          >
            <InputNumber
              placeholder="4"
              style={{ width: "100%" }}
              min={1}
              max={100}
            />
          </Form.Item>
        </Col>
        <Col xs={24} sm={24} md={24} lg={12} xl={12}>
          <Form.Item
            label="Rate Limit Threshold"
            name="RateLimitRequestsThreshold"
            tooltip="The maximum number of concurrent requests that can be serviced by this backend before API throttling occurs"
            rules={[
              {
                required: true,
                message: "Please enter rate limit threshold",
              },
            ]}
          >
            <InputNumber
              placeholder="10"
              style={{ width: "100%" }}
              min={1}
              max={1000}
            />
          </Form.Item>
        </Col>
      </Row>

      {/* Health Check Configuration */}
      <Row gutter={16}>
        <Col xs={24} sm={24} md={24} lg={12} xl={12}>
          <Form.Item
            label="Health Check Method"
            name={["HealthCheckMethod", "Method"]}
            tooltip="The HTTP method to use when validating that this backend is online and operational"
            rules={[
              {
                required: true,
                message: "Please select health check method",
              },
            ]}
          >
            <Select placeholder="Select health check method">
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
        <Col xs={24} sm={24} md={24} lg={12} xl={12}>
          <Form.Item
            label="Health Check URL"
            name="HealthCheckUrl"
            tooltip="The URL to use when validating that this backend is online and operational"
            rules={[
              {
                required: true,
                message: "Please enter health check URL",
              },
            ]}
          >
            <Input placeholder="/" />
          </Form.Item>
        </Col>
      </Row>

      {/* Thresholds */}
      <Row gutter={16}>
        <Col xs={24} sm={24} md={24} lg={12} xl={12}>
          <Form.Item
            label="Unhealthy Threshold"
            name="UnhealthyThreshold"
            tooltip="The maximum number of allowed failed healthchecks before the backend is taken out of rotation"
            rules={[
              {
                required: true,
                message: "Please enter unhealthy threshold",
              },
            ]}
          >
            <InputNumber
              placeholder="2"
              style={{ width: "100%" }}
              min={1}
              max={10}
            />
          </Form.Item>
        </Col>
        <Col xs={24} sm={24} md={24} lg={12} xl={12}>
          <Form.Item
            label="Healthy Threshold"
            name="HealthyThreshold"
            tooltip="The minimum number of successful healthchecks before the backend is added to rotation"
            rules={[
              {
                required: true,
                message: "Please enter healthy threshold",
              },
            ]}
          >
            <InputNumber
              placeholder="2"
              style={{ width: "100%" }}
              min={1}
              max={10}
            />
          </Form.Item>
        </Col>
      </Row>

      {/* Logging Options */}
      <Row gutter={16}>
        <Col xs={24} sm={24} md={8} lg={8} xl={8}>
          <Form.Item label="SSL" name="Ssl" valuePropName="checked">
            <Switch />
          </Form.Item>
        </Col>
        <Col xs={24} sm={24} md={8} lg={8} xl={8}>
          <Form.Item
            label="Log Request Body"
            name="LogRequestBody"
            valuePropName="checked"
          >
            <Switch onChange={(checked) => setLogRequestBody(checked)} />
          </Form.Item>
        </Col>
        <Col xs={24} sm={24} md={8} lg={8} xl={8}>
          <Form.Item
            label="Log Response Body"
            name="LogResponseBody"
            valuePropName="checked"
          >
            <Switch onChange={(checked) => setLogResponseBody(checked)} />
          </Form.Item>
        </Col>
      </Row>
      {/* Request Type Permissions */}
      <Row gutter={16}>
        <Col xs={24} sm={24} md={12} lg={12} xl={12}>
          <Form.Item
            label="Allow Embeddings"
            name="AllowEmbeddings"
            valuePropName="checked"
            tooltip="Indicates whether or not embeddings requests are allowed to pass and be processed"
          >
            <Switch />
          </Form.Item>
        </Col>
        <Col xs={24} sm={24} md={12} lg={12} xl={12}>
          <Form.Item
            label="Allow Completions"
            name="AllowCompletions"
            valuePropName="checked"
            tooltip="Indicates whether or not completions requests are allowed to pass and be processed"
          >
            <Switch />
          </Form.Item>
        </Col>
      </Row>

      {/* Pinned Properties Configuration */}
      <Row gutter={16}>
        <Col xs={24} sm={24} md={12} lg={12} xl={12}>
          <Form.Item
            label="Pinned Embeddings Properties"
            name="PinnedEmbeddingsProperties"
            tooltip="A JSON dictionary containing key-value pairs that will be merged into any received embeddings request"
          >
            <JsonEditor
              value={form.getFieldValue("PinnedEmbeddingsProperties") || {}}
              onChange={(value: Record<string, any>) => {
                form.setFieldValue("PinnedEmbeddingsProperties", value);
              }}
              mode="code"
              mainMenuBar={true}
              navigationBar={true}
              statusBar={true}
              style={{ height: "200px" }}
            />
          </Form.Item>
        </Col>
        <Col xs={24} sm={24} md={12} lg={12} xl={12}>
          <Form.Item
            label="Pinned Completions Properties"
            name="PinnedCompletionsProperties"
            tooltip="A JSON dictionary containing key-value pairs that will be merged into any received completions request"
          >
            <JsonEditor
              value={form.getFieldValue("PinnedCompletionsProperties") || {}}
              onChange={(value: Record<string, any>) => {
                form.setFieldValue("PinnedCompletionsProperties", value);
              }}
              mode="code"
              mainMenuBar={true}
              navigationBar={true}
              statusBar={true}
              style={{ height: "200px" }}
            />
          </Form.Item>
        </Col>
      </Row>
      {(logRequestBody || logResponseBody) && (
        <Alert
          type="warning"
          className="mb mt-sm"
          message={
            <>
              Note: Enabling
              <strong> Log Request Body</strong> or{" "}
              <strong>Log Response Body</strong> will implicitly disable
              response streaming
            </>
          }
        />
      )}

      {/* Submit Buttons */}
      <Form.Item>
        <Space>
          <Button type="primary" htmlType="submit" loading={loading}>
            {isEditMode ? "Update Backend" : "Create Backend"}
          </Button>
          <Button onClick={() => form.resetFields()} disabled={loading}>
            Reset
          </Button>
        </Space>
      </Form.Item>
    </Form>
  );
};

export default CreateEditBackend;
