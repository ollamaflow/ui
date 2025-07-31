import React from "react";
import { Row, Col, Form, Input, InputNumber, Select, Switch } from "antd";
import { DeleteOutlined } from "@ant-design/icons";
import OllamaFlowButton from "../../../components/base/button/Button";
import OllamaFlowFlex from "../../../components/base/flex/Flex";
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

interface FrontendCardProps {
  frontend: Frontend;
  index: number;
  onRemove: () => void;
  onChange: (field: string, value: unknown) => void;
  backends: Backend[];
  isPreview?: boolean;
  isValid?: boolean;
}

const FrontendCard: React.FC<FrontendCardProps> = ({
  frontend,
  index,
  onRemove,
  onChange,
  backends,
  isPreview = false,
  isValid = false,
}) => {
  const frontendName = frontend.Name;

  return (
    <div className={`${styles.beFeCard} pl pr mb`}>
      <div className="mb">
        {/* {!isValid && (
          <span className="ml">
            <ExclamationCircleOutlined />
            Required fields missing
          </span>
        )} */}
      </div>

      <div>
        <Row gutter={[16, 16]}>
          <Col span={12}>
            <Form.Item label="Identifier" required>
              <Input
                placeholder="e.g., frontend"
                value={frontend.Identifier}
                onChange={(e) => onChange("Identifier", e.target.value)}
                disabled={isPreview}
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="Name" required>
              <Input
                placeholder="e.g., Default Ollama frontend"
                value={frontend.Name}
                onChange={(e) => onChange("Name", e.target.value)}
                disabled={isPreview}
              />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={[16, 16]}>
          <Col span={12}>
            <Form.Item label="Hostname" required>
              <Input
                placeholder="localhost"
                value={frontend.Hostname}
                onChange={(e) => onChange("Hostname", e.target.value)}
                disabled={isPreview}
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="Timeout (ms)" required>
              <InputNumber
                placeholder="60000"
                style={{ width: "100%" }}
                min={1000}
                max={300000}
                value={frontend.TimeoutMs}
                onChange={(value) => onChange("TimeoutMs", value)}
                disabled={isPreview}
              />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={[16, 16]}>
          <Col span={12}>
            <Form.Item label="Load Balancing" required>
              <Select
                placeholder="Select load balancing method"
                value={frontend.LoadBalancing}
                onChange={(value) => onChange("LoadBalancing", value)}
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
                style={{ width: "100%" }}
                min={1024}
                max={1073741824}
                value={frontend.MaxRequestBodySize}
                onChange={(value) => onChange("MaxRequestBodySize", value)}
                disabled={isPreview}
              />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={[16, 16]}>
          <Col span={8}>
            <Form.Item label="Block HTTP/1.0" valuePropName="checked">
              <Switch
                checked={frontend.BlockHttp10}
                onChange={(checked) => onChange("BlockHttp10", checked)}
                disabled={isPreview}
              />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label="Log Full Request" valuePropName="checked">
              <Switch
                checked={frontend.LogRequestFull}
                onChange={(checked) => onChange("LogRequestFull", checked)}
                disabled={isPreview}
              />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label="Log Request Body" valuePropName="checked">
              <Switch
                checked={frontend.LogRequestBody}
                onChange={(checked) => onChange("LogRequestBody", checked)}
                disabled={isPreview}
              />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={[16, 16]}>
          <Col span={24}>
            <Form.Item label="Log Response Body" valuePropName="checked">
              <Switch
                checked={frontend.LogResponseBody}
                onChange={(checked) => onChange("LogResponseBody", checked)}
                disabled={isPreview}
              />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={[16, 16]}>
          <Col span={24}>
            <Form.Item label="Backend Identifiers" required>
              <Select
                mode="tags"
                placeholder="Enter backend identifiers (e.g., backend1, backend2)"
                value={frontend.Backends}
                onChange={(value) => onChange("Backends", value)}
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

        <Row gutter={[16, 16]}>
          <Col span={24}>
            <Form.Item label="Required Models" required>
              <Select
                mode="tags"
                placeholder="Enter required models (e.g., all-minilm)"
                value={frontend.RequiredModels}
                onChange={(value) => onChange("RequiredModels", value)}
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
    </div>
  );
};

export default FrontendCard;
export type { Frontend, FrontendCardProps };
