import React, { useState, useEffect } from "react";
import { Form, Input, Divider, Tooltip, message } from "antd";
import {
  ArrowLeftOutlined,
  SaveOutlined,
  DownloadOutlined,
  PlusOutlined,
  DeleteOutlined,
  FileTextOutlined,
} from "@ant-design/icons";
import OllamaFlowCard from "../../components/base/card/Card";
import OllamaFlowButton from "../../components/base/button/Button";
import OllamaFlowTitle from "../../components/base/typograpghy/Title";
import OllamaFlowText from "../../components/base/typograpghy/Text";
import OllamaFlowFlex from "../../components/base/flex/Flex";
import OllamaFlowModal from "../../components/base/modal/Modal";
import type { FormInstance } from "antd/es/form";
import { useAppContext } from "../../hooks/appHooks";
import { Configuration } from "../../types/types";
import styles from "./ConfigForm.module.scss";
import PageContainer from "#/components/pageContainer/PageContainer";
import FormHeading from "./component/FormHeading";
import OllamaFlowCollapse from "#/components/base/collapse/Collpase";
import BackendCard, { type Backend } from "./component/BackendCard";
import FrontendCard, { type Frontend } from "./component/FrontendCard";

const { TextArea } = Input;

interface ConfigFormProps {
  onClose: () => void;
  editConfig?: Configuration | null;
  mode?: "create" | "edit" | "preview";
}

interface ConfigFormData {
  Logging: Record<string, unknown>;
  Frontends: Frontend[];
  Backends: Backend[];
  Webserver: Record<string, unknown>;
}

const ConfigForm: React.FC<ConfigFormProps> = ({
  onClose,
  editConfig = null,
  mode = "create",
}) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const { addConfiguration, updateConfiguration } = useAppContext();
  const [isPreviewMode, setIsPreviewMode] = useState(mode === "preview");
  const [showJsonPreview, setShowJsonPreview] = useState(false);
  const [generatedConfig, setGeneratedConfig] = useState<ConfigFormData | null>(
    null
  );
  const [isFormValid, setIsFormValid] = useState(false);
  const isEditMode = mode === "edit";
  const isCreateMode = mode === "create";

  const [backends, setBackends] = useState(() => {
    if (editConfig && editConfig.config.Backends) {
      return editConfig.config.Backends;
    }
    return [
      {
        Identifier: "",
        Name: "",
        Hostname: "localhost",
        Port: 11435,
        Ssl: false,
        ModelRefreshIntervalMs: 30000,
        HealthCheckIntervalMs: 5000,
        UnhealthyThreshold: 2,
        HealthyThreshold: 2,
        HealthCheckMethod: {
          Method: "HEAD",
        },
        HealthCheckUrl: "/",
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
        Identifier: "",
        Name: "",
        Hostname: "localhost",
        TimeoutMs: 60000,
        LoadBalancing: "RoundRobin",
        BlockHttp10: true,
        LogRequestFull: false,
        LogRequestBody: false,
        LogResponseBody: false,
        MaxRequestBodySize: 536870912,
        Backends: [],
        RequiredModels: ["all-minilm"],
        LastIndex: 0,
      },
    ];
  });

  // Validation functions
  const validateBackend = (backend: Backend): boolean => {
    return !!(
      backend.Name &&
      backend.Name.trim() !== "" &&
      backend.Identifier &&
      backend.Identifier.trim() !== "" &&
      backend.Hostname &&
      backend.Hostname.trim() !== "" &&
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
      backend.HealthCheckUrl.trim() !== "" &&
      backend.HealthCheckMethod?.Method &&
      backend.HealthCheckMethod.Method.trim() !== "" &&
      backend.UnhealthyThreshold &&
      backend.UnhealthyThreshold > 0 &&
      backend.HealthyThreshold &&
      backend.HealthyThreshold > 0
    );
  };

  const validateFrontend = (frontend: Frontend): boolean => {
    return !!(
      frontend.Name &&
      frontend.Name.trim() !== "" &&
      frontend.Identifier &&
      frontend.Identifier.trim() !== "" &&
      frontend.Hostname &&
      frontend.Hostname.trim() !== "" &&
      frontend.TimeoutMs &&
      frontend.TimeoutMs > 0 &&
      frontend.LoadBalancing &&
      frontend.LoadBalancing.trim() !== "" &&
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
          Hostname: "127.0.0.1",
          Port: 514,
          RandomizePorts: false,
          MinimumPort: 65000,
          MaximumPort: 65535,
        },
      ],
      LogDirectory: "./logs/",
      LogFilename: "ollamaflow.log",
      ConsoleLogging: true,
      EnableColors: true,
      MinimumSeverity: 0,
    },
    Frontends: frontends,
    Backends: backends,
    Webserver: {
      Hostname: "localhost",
      Port: 43411,
      Prefix: "http://localhost:43411/",
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
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods":
            "OPTIONS, HEAD, GET, PUT, POST, DELETE, PATCH",
          "Access-Control-Allow-Headers": "*",
          "Access-Control-Expose-Headers": "",
          Accept: "*/*",
          "Accept-Language": "en-US, en",
          "Accept-Charset": "ISO-8859-1, utf-8",
          "Cache-Control": "no-cache",
          Connection: "close",
          Host: "localhost:43411",
        },
      },
      AccessControl: {
        DenyList: {},
        PermitList: {},
        Mode: "DefaultPermit",
      },
      Debug: {
        AccessControl: false,
        Routing: false,
        Requests: false,
        Responses: false,
      },
    },
  };

  const handleBackendChange = (
    index: number,
    field: string,
    value: unknown
  ) => {
    const newBackends = [...backends];
    newBackends[index] = { ...newBackends[index], [field]: value };
    setBackends(newBackends);
  };

  const handleFrontendChange = (
    index: number,
    field: string,
    value: unknown
  ) => {
    const newFrontends = [...frontends];
    newFrontends[index] = { ...newFrontends[index], [field]: value };
    setFrontends(newFrontends);
  };

  const addBackend = () => {
    setBackends([
      ...backends,
      {
        Identifier: "",
        Name: "",
        Hostname: "localhost",
        Port: 11435,
        Ssl: false,
        ModelRefreshIntervalMs: 30000,
        HealthCheckIntervalMs: 5000,
        UnhealthyThreshold: 2,
        HealthyThreshold: 2,
        HealthCheckMethod: {
          Method: "HEAD",
        },
        HealthCheckUrl: "/",
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
        Identifier: "",
        Name: "",
        Hostname: "localhost",
        TimeoutMs: 60000,
        LoadBalancing: "RoundRobin",
        BlockHttp10: true,
        LogRequestFull: false,
        LogRequestBody: false,
        LogResponseBody: false,
        MaxRequestBodySize: 536870912,
        Backends: [],
        RequiredModels: ["all-minilm"],
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
      message.error(
        "Please fill in all required fields before generating the configuration."
      );
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

      console.log("Final config to save:", finalConfig);
      setGeneratedConfig(finalConfig);
      setShowJsonPreview(true);

      // Generate a configuration name based on the first backend
      const configName = backends[0]?.Name || "New Configuration";

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
        updateConfiguration(editConfig.id, {
          ...newConfiguration,
          id: editConfig.id,
        });
        message.success("Configuration updated and saved to localStorage!");
      } else {
        addConfiguration(newConfiguration);
        message.success("Configuration created and saved to localStorage!");
      }
    } catch (error) {
      console.error("Error saving config:", error);
      message.error("Error generating configuration");
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = () => {
    if (!generatedConfig) return;

    const configName = backends[0]?.Name || "New Configuration";
    const configData = JSON.stringify(generatedConfig, null, 2);
    const blob = new Blob([configData], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${configName.replace(/\s+/g, "-").toLowerCase()}-config.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    message.success("Configuration downloaded successfully!");
  };

  const handleBackToForm = () => {
    setShowJsonPreview(false);
    setGeneratedConfig(null);
  };

  const handleToggleMode = () => {
    setIsPreviewMode(!isPreviewMode);
  };

  const renderBackendSection = () => (
    <div className="mb-lg">
      <div className="mb">
        <FormHeading
          title="Backend Configuration"
          description="Configure your backend servers. These are the Ollama instances that will handle your requests."
          type="section"
        />
        <Divider className="mt mb divider-primary" />
      </div>

      <div className="mb">
        <OllamaFlowCollapse
          className={styles.configCollapse}
          items={backends.map((backend: Backend, index: number) => ({
            key: `backend-${index}`,
            label: (
              <OllamaFlowFlex
                justify="space-between"
                align="center"
                className="mb"
              >
                <FormHeading
                  type="sub-section"
                  title={
                    backend.Name
                      ? `Backend: ${backend.Name}`
                      : `Backend ${index + 1}`
                  }
                  // description="Configure your backend servers. These are the Ollama instances that will handle your requests."
                />

                {!isPreviewMode && (
                  <OllamaFlowButton
                    type="text"
                    danger
                    icon={<DeleteOutlined />}
                    onClick={() => removeBackend(index)}
                    disabled={backends.length <= 1}
                  >
                    Remove
                  </OllamaFlowButton>
                )}
              </OllamaFlowFlex>
            ),
            children: (
              <BackendCard
                backend={backend}
                index={index}
                onRemove={() => removeBackend(index)}
                onChange={(field, value) =>
                  handleBackendChange(index, field, value)
                }
                canRemove={backends.length > 1}
                isPreview={isPreviewMode}
                isValid={validateBackend(backend)}
              />
            ),
          }))}
        />
      </div>

      {!isPreviewMode && (
        <OllamaFlowButton
          type="dashed"
          onClick={addBackend}
          block
          icon={<PlusOutlined />}
          className="mt"
        >
          Add Backend Server
        </OllamaFlowButton>
      )}
    </div>
  );

  const renderFrontendSection = () => (
    <div className="mb-lg">
      <div className="mb">
        <FormHeading
          title="Frontend Configuration"
          description="Configure your frontend settings. These settings control how requests are routed to your frontend."
          type="section"
        />
        <Divider className="mt mb divider-primary" />
      </div>

      <div className="mb">
        <OllamaFlowCollapse
          className={styles.configCollapse}
          items={frontends.map((frontend: Frontend, index: number) => ({
            key: `frontend-${index}`,
            label: (
              <OllamaFlowFlex
                justify="space-between"
                align="center"
                className="mb"
              >
                <FormHeading
                  type="sub-section"
                  title={
                    frontend.Name
                      ? `Frontend: ${frontend.Name}`
                      : `Frontend ${index + 1}`
                  }
                  // description="Configure your frontend settings. These settings control how requests are routed to your frontend."
                />

                {!isPreviewMode && (
                  <OllamaFlowButton
                    type="text"
                    danger
                    icon={<DeleteOutlined />}
                    onClick={() => removeFrontend(index)}
                    disabled={frontends.length <= 1}
                  >
                    Remove
                  </OllamaFlowButton>
                )}
              </OllamaFlowFlex>
            ),
            children: (
              <FrontendCard
                frontend={frontend}
                index={index}
                backends={backends}
                isPreview={isPreviewMode}
                isValid={validateFrontend(frontend)}
                onRemove={() => removeFrontend(index)}
                onChange={(field, value) =>
                  handleFrontendChange(index, field, value)
                }
              />
            ),
          }))}
        />
      </div>

      {!isPreviewMode && (
        <OllamaFlowButton
          type="dashed"
          onClick={addFrontend}
          block
          icon={<PlusOutlined />}
          className="mt"
        >
          Add Frontend Configuration
        </OllamaFlowButton>
      )}
    </div>
  );

  const renderJsonPreview = () => (
    <div className="p">
      <div className="mb-lg">
        <OllamaFlowFlex align="center" gap="small" className="mb-sm">
          <FileTextOutlined />
          <OllamaFlowTitle level={3}>Configuration Preview</OllamaFlowTitle>
        </OllamaFlowFlex>
        <OllamaFlowText className="mb">
          Review your generated configuration JSON. You can download this
          configuration file.
        </OllamaFlowText>
      </div>

      <OllamaFlowCard className="p">
        <div className="mb">
          <OllamaFlowButton
            type="primary"
            icon={<DownloadOutlined />}
            onClick={handleDownload}
            className="mr"
          >
            Download Configuration
          </OllamaFlowButton>
          <OllamaFlowButton
            icon={<ArrowLeftOutlined />}
            onClick={handleBackToForm}
          >
            Back to Form
          </OllamaFlowButton>
        </div>

        <div>
          <TextArea
            value={
              generatedConfig ? JSON.stringify(generatedConfig, null, 2) : ""
            }
            rows={20}
            readOnly
            className="mt"
          />
        </div>
      </OllamaFlowCard>
    </div>
  );

  return (
    <PageContainer
      pageTitle="Configuration"
      pageTitleRightContent={
        <OllamaFlowButton
          type="primary"
          icon={<SaveOutlined />}
          onClick={handleSubmit}
        >
          Save Configuration
        </OllamaFlowButton>
      }
    >
      <div>
        {/* Form Content */}
        <div>
          <Form form={form} layout="vertical" preserve={true}>
            {renderBackendSection()}
            {renderFrontendSection()}
          </Form>

          {/* Generate Button at Bottom */}
          {!isPreviewMode && (
            <div className="mt-lg pt text-center">
              <Tooltip
                title={
                  isFormValid
                    ? isEditMode
                      ? "Update Configuration"
                      : "Generate Configuration"
                    : "Please fill in all required fields"
                }
              >
                <OllamaFlowButton
                  type="primary"
                  size="large"
                  icon={<SaveOutlined />}
                  onClick={handleSubmit}
                  loading={loading}
                  disabled={!isFormValid}
                >
                  {isEditMode
                    ? "Update Configuration"
                    : "Generate Configuration"}
                </OllamaFlowButton>
              </Tooltip>
            </div>
          )}
        </div>
      </div>
    </PageContainer>
  );
};

export default ConfigForm;
