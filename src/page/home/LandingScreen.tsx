import React from 'react';
import { Row, Col } from 'antd';
import { PlusOutlined, CloudServerOutlined, FileTextOutlined } from '@ant-design/icons';
import OllamaFlowCard from '../../components/base/card/Card';
import OllamaFlowButton from '../../components/base/button/Button';
import OllamaFlowTitle from '../../components/base/typograpghy/Title';
import OllamaFlowText from '../../components/base/typograpghy/Text';
import OllamaFlowFlex from '#/components/base/flex/Flex';
import styles from './home.module.scss';
import Link from 'next/link';

interface LandingScreenProps {
  onNavigate?: (view: string) => void;
}

const LandingScreen: React.FC<LandingScreenProps> = ({ onNavigate }) => {
  const handleCreateFrontend = () => {
    onNavigate?.('create-frontend');
  };

  const handleCreateBackend = () => {
    onNavigate?.('create-backend');
  };

  return (
    <>
      <div>
        <OllamaFlowFlex vertical align="center" className="mt-xl">
          <OllamaFlowTitle level={1}>Welcome to OllamaFlow</OllamaFlowTitle>
          <OllamaFlowText>
            Create and manage your Ollama frontends and backends with our intuitive interface
          </OllamaFlowText>
        </OllamaFlowFlex>

        {/* Main Options */}
        <Row gutter={[40, 40]} justify="center" className="mt-xl">
          <Col xs={24} sm={20} md={10} lg={8}>
            <OllamaFlowCard onClick={handleCreateFrontend} className={styles.card} hoverable>
              <OllamaFlowFlex vertical align="center" className="h-100">
                <div>
                  <FileTextOutlined
                    style={{
                      fontSize: '40px',
                      color: 'var(--ant-color-primary)',
                    }}
                  />
                </div>
                <OllamaFlowTitle level={2} className="mt">
                  Create Frontend
                </OllamaFlowTitle>
                <OllamaFlowText className="text-center">
                  Create a new frontend configuration to handle incoming requests and route them to your backends
                </OllamaFlowText>
                <Link href="/dashboard/create-frontend" className="mt-auto">
                  <OllamaFlowButton type="primary" size="large" icon={<PlusOutlined />}>
                    Create Frontend
                  </OllamaFlowButton>
                </Link>
              </OllamaFlowFlex>
            </OllamaFlowCard>
          </Col>

          <Col xs={24} sm={20} md={10} lg={8}>
            <OllamaFlowCard hoverable onClick={handleCreateBackend} className={styles.card}>
              <OllamaFlowFlex vertical align="center" className="h-100">
                <div>
                  <CloudServerOutlined
                    style={{
                      fontSize: '40px',
                      color: 'var(--ant-color-primary)',
                    }}
                  />
                </div>
                <OllamaFlowTitle level={2} className="mt">
                  Create Backend
                </OllamaFlowTitle>
                <OllamaFlowText className="text-center">
                  Create a new backend configuration to define your Ollama server endpoints and models
                </OllamaFlowText>
                <Link href="/dashboard/create-backend" className="mt-auto">
                  <OllamaFlowButton type="primary" size="large" icon={<PlusOutlined />}>
                    Create Backend
                  </OllamaFlowButton>
                </Link>
              </OllamaFlowFlex>
            </OllamaFlowCard>
          </Col>
        </Row>
      </div>
    </>
  );
};

export default LandingScreen;
