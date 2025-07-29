'use client';

import React, { useState } from 'react';
import { Layout } from 'antd';
import Sidebar from '../components/base/sidebar';
import LandingScreen from '../pages/home/LandingScreen';
import ConfigForm from '../pages/config/ConfigForm';
import { Configuration } from '../types/types';

const { Content } = Layout;

type ViewType = 'home' | 'create-config' | 'view-config' | 'edit-config';

export default function Home() {
  const [collapsed, setCollapsed] = useState(false);
  const [currentView, setCurrentView] = useState<ViewType>('home');
  const [selectedConfig, setSelectedConfig] = useState<Configuration | null>(null);

  const handleNavigate = (view: string, config?: Configuration) => {
    setCurrentView(view as ViewType);
    setSelectedConfig(config || null);
  };

  const handleCloseConfigForm = () => {
    setCurrentView('home');
    setSelectedConfig(null);
  };

  const renderContent = () => {
    switch (currentView) {
      case 'create-config':
        return <ConfigForm onClose={handleCloseConfigForm} mode="create" />;
      case 'view-config':
        return selectedConfig ? (
          <ConfigForm onClose={handleCloseConfigForm} mode="preview" editConfig={selectedConfig} />
        ) : (
          <LandingScreen onNavigate={handleNavigate} />
        );
      case 'edit-config':
        return selectedConfig ? (
          <ConfigForm onClose={handleCloseConfigForm} mode="edit" editConfig={selectedConfig} />
        ) : (
          <LandingScreen onNavigate={handleNavigate} />
        );
      case 'home':
      default:
        return <LandingScreen onNavigate={handleNavigate} />;
    }
  };

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sidebar collapsed={collapsed} onCollapse={setCollapsed} onNavigate={handleNavigate} />
      <Layout>
        <Content style={{ margin: 0, minHeight: '100vh' }}>{renderContent()}</Content>
      </Layout>
    </Layout>
  );
}
