import React, { useState } from "react";
import { Layout, Row, Col, message } from "antd";
import {
  PlusOutlined,
  EditOutlined,
  FileTextOutlined,
  UploadOutlined,
} from "@ant-design/icons";
import OllamaFlowCard from "../../components/base/card/Card";
import OllamaFlowButton from "../../components/base/button/Button";
import OllamaFlowTitle from "../../components/base/typograpghy/Title";
import OllamaFlowText from "../../components/base/typograpghy/Text";
import ConfigUploadModal from "../upload/ConfigUploadModal";
import { Configuration } from "../../types/types";
import { useAppContext } from "../../hooks/appHooks";
import OllamaFlowFlex from "#/components/base/flex/Flex";
import styles from "./home.module.scss";

interface LandingScreenProps {
  onNavigate?: (view: string, config?: Configuration) => void;
}

const LandingScreen: React.FC<LandingScreenProps> = ({ onNavigate }) => {
  const [showUploadModal, setShowUploadModal] = useState(false);
  const { addConfiguration } = useAppContext();

  const handleGenerateNew = () => {
    onNavigate?.("create-config");
  };

  const handleEditExisting = () => {
    setShowUploadModal(true);
  };

  const handleCloseUploadModal = () => {
    setShowUploadModal(false);
  };

  const handleConfigLoaded = (config: Record<string, unknown>) => {
    const configuration: Configuration = {
      id: Date.now().toString(),
      name: "Loaded Configuration",
      createdAt: new Date(),
      updatedAt: new Date(),
      config: config,
    };

    // Save the loaded configuration to localStorage
    addConfiguration(configuration);
    message.success("Configuration loaded and saved to localStorage!");

    onNavigate?.("edit-config", configuration);
    setShowUploadModal(false);
  };

  return (
    <>
      {/* <Content className="landing-screen__content"> */}
      <div>
        <OllamaFlowFlex vertical align="center" className="mb">
          <OllamaFlowTitle level={1}>Welcome to OllamaFlow</OllamaFlowTitle>
          <OllamaFlowText>
            Create and manage your Ollama configuration files with our intuitive
            interface
          </OllamaFlowText>
        </OllamaFlowFlex>

        {/* Main Options */}
        <Row gutter={[40, 40]} justify="center">
          <Col xs={24} sm={20} md={10} lg={8}>
            <OllamaFlowCard onClick={handleGenerateNew}>
              <OllamaFlowFlex vertical align="center" className="mb">
                <div>
                  <PlusOutlined
                    style={{
                      fontSize: "40px",
                      color: "var(--ant-color-primary)",
                    }}
                  />
                </div>
                <OllamaFlowTitle level={2}>Generate New Config</OllamaFlowTitle>
                <OllamaFlowText>
                  Create a new configuration file from scratch with our
                  comprehensive guided form
                </OllamaFlowText>
              </OllamaFlowFlex>
              <OllamaFlowButton
                type="primary"
                size="large"
                icon={<FileTextOutlined />}
              >
                Start Creating
              </OllamaFlowButton>
            </OllamaFlowCard>
          </Col>

          <Col xs={24} sm={20} md={10} lg={8}>
            <OllamaFlowCard onClick={handleEditExisting}>
              <OllamaFlowFlex vertical align="center" className="mb">
                <div>
                  <EditOutlined
                    style={{
                      fontSize: "40px",
                      color: "var(--ant-color-primary)",
                    }}
                  />
                </div>
                <OllamaFlowTitle level={2}>
                  Edit Existing Config
                </OllamaFlowTitle>
                <OllamaFlowText>
                  Upload and edit your existing configuration files with our
                  visual editor
                </OllamaFlowText>
              </OllamaFlowFlex>
              <OllamaFlowButton size="large" icon={<UploadOutlined />}>
                Upload & Edit
              </OllamaFlowButton>
            </OllamaFlowCard>
          </Col>
        </Row>
      </div>
      {/* </Content> */}

      <ConfigUploadModal
        visible={showUploadModal}
        onClose={handleCloseUploadModal}
        onConfigLoaded={handleConfigLoaded}
      />
    </>
  );
};

export default LandingScreen;
