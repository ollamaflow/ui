import React from "react";
import { Row, Col, Form, Input, InputNumber, Select, Switch } from "antd";
import {
  SettingOutlined,
  ToolOutlined,
  HeartOutlined,
  FileTextOutlined,
} from "@ant-design/icons";
import FormHeading from "./FormHeading";
import styles from "../ConfigForm.module.scss";

const { Option } = Select;

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

interface BackendCardProps {
  backend: Backend;
  onChange: (field: string, value: unknown) => void;
  isPreview?: boolean;
}

const BackendCard: React.FC<BackendCardProps> = ({
  backend,
  onChange,
  isPreview = false,
}) => {
  return (
    <div className={`${styles.beFeCard} pl pr mb`}>
      <div>
        {/* Basic Settings Section */}
        <div className="mb">
          <div className="mb-sm">
            <FormHeading title="Basic Settings" icon={<SettingOutlined />} />
          </div>

          <Row gutter={[16, 16]}>
            <Col xs={24} md={12}>
              <Form.Item
                label="Name"
                required
                tooltip="A descriptive name for this backend server"
              >
                <Input
                  placeholder="e.g., backend1"
                  value={backend.Name}
                  onChange={(e) => onChange("Name", e.target.value)}
                  disabled={isPreview}
                />
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item
                label="Identifier"
                required
                tooltip="Unique identifier for this backend"
              >
                <Input
                  placeholder="Auto-generated from name"
                  value={backend.Identifier}
                  onChange={(e) => onChange("Identifier", e.target.value)}
                  disabled={isPreview}
                />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={[16, 16]}>
            <Col xs={24} md={12}>
              <Form.Item
                label="Hostname"
                required
                tooltip="The hostname or IP address of the backend server"
              >
                <Input
                  placeholder="localhost"
                  value={backend.Hostname}
                  onChange={(e) => onChange("Hostname", e.target.value)}
                  disabled={isPreview}
                />
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item
                label="Port"
                required
                tooltip="The port number the backend server is listening on"
              >
                <InputNumber
                  placeholder="11435"
                  style={{ width: "100%" }}
                  min={1}
                  max={65535}
                  value={backend.Port}
                  onChange={(value) => onChange("Port", value)}
                  disabled={isPreview}
                />
              </Form.Item>
            </Col>
          </Row>
        </div>

        {/* Advanced Options Section */}
        <div className="mb">
          <div className="mb-sm">
            <FormHeading title="Advanced Options" icon={<ToolOutlined />} />
          </div>

          <Row gutter={[16, 16]}>
            <Col xs={24} md={8}>
              <Form.Item
                label="SSL"
                valuePropName="checked"
                tooltip="Enable SSL/TLS encryption"
              >
                <Switch
                  checked={backend.Ssl}
                  onChange={(checked) => onChange("Ssl", checked)}
                  disabled={isPreview}
                />
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
                  style={{ width: "100%" }}
                  min={1}
                  max={100}
                  value={backend.MaxParallelRequests}
                  onChange={(value) => onChange("MaxParallelRequests", value)}
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
                  style={{ width: "100%" }}
                  min={1}
                  max={1000}
                  value={backend.RateLimitRequestsThreshold}
                  onChange={(value) =>
                    onChange("RateLimitRequestsThreshold", value)
                  }
                  disabled={isPreview}
                />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={[16, 16]}>
            <Col xs={24} md={12}>
              <Form.Item
                label="Model Refresh Interval (ms)"
                required
                tooltip="How often to refresh the model list from this backend"
              >
                <InputNumber
                  placeholder="30000"
                  style={{ width: "100%" }}
                  min={1000}
                  max={300000}
                  value={backend.ModelRefreshIntervalMs}
                  onChange={(value) =>
                    onChange("ModelRefreshIntervalMs", value)
                  }
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
                  style={{ width: "100%" }}
                  min={1000}
                  max={60000}
                  value={backend.HealthCheckIntervalMs}
                  onChange={(value) => onChange("HealthCheckIntervalMs", value)}
                  disabled={isPreview}
                />
              </Form.Item>
            </Col>
          </Row>
        </div>

        {/* Health Checks Section */}
        <div className="mb">
          <div className="mb-sm">
            <FormHeading
              title="Health Checks"
              icon={<HeartOutlined style={{ marginBottom: "2px" }} />}
            />
          </div>

          <Row gutter={[16, 16]}>
            <Col xs={24} md={12}>
              <Form.Item
                label="Health Check URL"
                required
                tooltip="The endpoint to check for backend health"
              >
                <Input
                  placeholder="/"
                  value={backend.HealthCheckUrl}
                  onChange={(e) => onChange("HealthCheckUrl", e.target.value)}
                  disabled={isPreview}
                />
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item
                label="Health Check Method"
                required
                tooltip="HTTP method to use for health checks"
              >
                <Select
                  placeholder="Select health check method"
                  value={backend.HealthCheckMethod?.Method}
                  onChange={(value) =>
                    onChange("HealthCheckMethod", { Method: value })
                  }
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

          <Row gutter={[16, 16]}>
            <Col xs={24} md={12}>
              <Form.Item
                label="Unhealthy Threshold"
                required
                tooltip="Number of failed checks before marking backend as unhealthy"
              >
                <InputNumber
                  placeholder="2"
                  style={{ width: "100%" }}
                  min={1}
                  max={10}
                  value={backend.UnhealthyThreshold}
                  onChange={(value) => onChange("UnhealthyThreshold", value)}
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
                  style={{ width: "100%" }}
                  min={1}
                  max={10}
                  value={backend.HealthyThreshold}
                  onChange={(value) => onChange("HealthyThreshold", value)}
                  disabled={isPreview}
                />
              </Form.Item>
            </Col>
          </Row>
        </div>

        {/* Logging Section */}
        <div className="mb">
          <div className="mb-sm">
            <FormHeading title="Logging Options" icon={<FileTextOutlined />} />
          </div>

          <Row gutter={[16, 16]}>
            <Col xs={24} md={12}>
              <Form.Item
                label="Log Request Body"
                valuePropName="checked"
                tooltip="Log the full request body for debugging"
              >
                <Switch
                  checked={backend.LogRequestBody}
                  onChange={(checked) => onChange("LogRequestBody", checked)}
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
                  onChange={(checked) => onChange("LogResponseBody", checked)}
                  disabled={isPreview}
                />
              </Form.Item>
            </Col>
          </Row>
        </div>
      </div>
    </div>
  );
};

export default BackendCard;
export type { Backend, BackendCardProps };
