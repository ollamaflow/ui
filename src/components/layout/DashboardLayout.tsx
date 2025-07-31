"use client";

import React, { useState } from "react";
import { Layout } from "antd";
import Sidebar from "#/components/base/sidebar";
import { ThemeEnum } from "#/types/types";
import OllamaFlowFlex from "#/components/base/flex/Flex";
import ThemeModeSwitch from "#/components/theme-mode-switch/ThemeModeSwitch";
import OllamaFlowTooltip from "#/components/base/tooltip/Tooltip";

import styles from "./dashboardLayout.module.scss";
import { useAppContext } from "#/hooks/appHooks";

const { Content, Header } = Layout;

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  const { theme } = useAppContext();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sidebar collapsed={collapsed} onCollapse={setCollapsed} />
      <Layout>
        <Header className={styles.header}>
          <OllamaFlowFlex
            align="center"
            justify="flex-end"
            data-testid="user-section"
          >
            <OllamaFlowTooltip
              title={`Switch to ${
                theme === ThemeEnum.DARK ? "Light" : "Dark"
              } mode`}
            >
              <ThemeModeSwitch />
            </OllamaFlowTooltip>
          </OllamaFlowFlex>
        </Header>
        {children}
      </Layout>
    </Layout>
  );
};

export default DashboardLayout;
