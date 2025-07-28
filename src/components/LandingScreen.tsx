import React, { useState } from 'react';
import { Layout, Row, Col } from 'antd';
import { PlusOutlined, EditOutlined, FileTextOutlined, UploadOutlined } from '@ant-design/icons';
import OllamaFlowCard from './base/card/Card';
import OllamaFlowButton from './base/button/Button';
import OllamaFlowTitle from './base/typograpghy/Title';
import OllamaFlowText from './base/typograpghy/Text';
import OllamaFlowFlex from './base/flex/Flex';
import ConfigForm from '../components/ConfigForm';
import ConfigUploadModal from '../components/ConfigUploadModal';
import '../styles/global.scss';

const { Content } = Layout;

const LandingScreen: React.FC = () => {
  const [showConfigForm, setShowConfigForm] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);

  const handleGenerateNew = () => {
    setShowConfigForm(true);
  };

  const handleEditExisting = () => {
    setShowUploadModal(true);
  };

  const handleCloseConfigForm = () => {
    setShowConfigForm(false);
  };

  const handleCloseUploadModal = () => {
    setShowUploadModal(false);
  };

  if (showConfigForm) {
    return <ConfigForm onClose={handleCloseConfigForm} />;
  }

  return (
    <Layout className="landing-screen">
      <Content>
        <div className="landing-screen__content">
          {/* Header */}
          <div className="landing-screen__header">
            <OllamaFlowTitle level={1} className="landing-screen__header-title">
              Welcome to OllamaFlow
            </OllamaFlowTitle>
            <OllamaFlowText className="landing-screen__header-subtitle">
              Create and manage your Ollama configuration files with our intuitive interface
            </OllamaFlowText>
          </div>

          {/* Main Options */}
          <Row gutter={[40, 40]} justify="center" className="landing-screen__options">
            <Col xs={24} sm={20} md={10} lg={8}>
              <OllamaFlowCard
                hoverable
                className="landing-screen__card"
                onClick={handleGenerateNew}
                styles={{
                  body: {
                    padding: '40px 32px',
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                  },
                }}
              >
                <div>
                  <div className="landing-screen__card-icon landing-screen__card-icon--primary">
                    <PlusOutlined style={{ fontSize: '40px', color: 'var(--ollamaflow-primary)' }} />
                  </div>
                  <OllamaFlowTitle level={2} className="landing-screen__card-title">
                    Generate New Config
                  </OllamaFlowTitle>
                  <OllamaFlowText className="landing-screen__card-description">
                    Create a new configuration file from scratch with our comprehensive guided form
                  </OllamaFlowText>
                </div>
                <OllamaFlowButton
                  type="primary"
                  size="large"
                  icon={<FileTextOutlined />}
                  className="landing-screen__card-button"
                >
                  Start Creating
                </OllamaFlowButton>
              </OllamaFlowCard>
            </Col>

            <Col xs={24} sm={20} md={10} lg={8}>
              <OllamaFlowCard
                hoverable
                className="landing-screen__card"
                onClick={handleEditExisting}
                styles={{
                  body: {
                    padding: '40px 32px',
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                  },
                }}
              >
                <div>
                  <div className="landing-screen__card-icon landing-screen__card-icon--secondary">
                    <EditOutlined style={{ fontSize: '40px', color: 'var(--ollamaflow-secondary-blue)' }} />
                  </div>
                  <OllamaFlowTitle level={2} className="landing-screen__card-title">
                    Edit Existing Config
                  </OllamaFlowTitle>
                  <OllamaFlowText className="landing-screen__card-description">
                    Upload and edit your existing configuration files with our visual editor
                  </OllamaFlowText>
                </div>
                <OllamaFlowButton
                  size="large"
                  icon={<UploadOutlined />}
                  className="landing-screen__card-button landing-screen__card-button--secondary"
                >
                  Upload & Edit
                </OllamaFlowButton>
              </OllamaFlowCard>
            </Col>
          </Row>
        </div>
      </Content>

      <ConfigUploadModal visible={showUploadModal} onClose={handleCloseUploadModal} />
    </Layout>
  );
};

export default LandingScreen;
