'use client';

import React, { useState } from 'react';
import { Layout } from 'antd';
import Sidebar from '../components/base/sidebar';
import LandingScreen from '../components/LandingScreen';

const { Content } = Layout;

export default function Home() {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sidebar collapsed={collapsed} onCollapse={setCollapsed} />
      <Layout>
        <Content style={{ margin: 0, minHeight: '100vh' }}>
          <LandingScreen />
        </Content>
      </Layout>
    </Layout>
  );
}
