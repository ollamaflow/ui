import React, { useState, useEffect } from "react";
import { Layout, Menu, Button } from "antd";
import {
  FileTextOutlined,
  HomeOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import { useAppContext } from "#/hooks/appHooks";
import { ThemeEnum, Configuration } from "#/types/types";
import "../../../assets/css/globals.scss";
import OllamaFlowFlex from "../flex/Flex";
import styles from "./sidebar.module.scss";
import OllamaFlowText from "../typograpghy/Text";
import Link from "next/link";

const { Sider } = Layout;

interface SidebarProps {
  collapsed?: boolean;
  onCollapse?: (collapsed: boolean) => void;
  onNavigate?: (view: string, config?: Configuration) => void;
}

const Sidebar: React.FC<SidebarProps> = ({
  collapsed = false,
  onCollapse,
  onNavigate,
}) => {
  const { theme, setTheme, configurations } = useAppContext();
  const [mounted, setMounted] = useState(false);

  // Set mounted flag after mount to avoid hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  const handleThemeToggle = () => {
    const newTheme =
      theme === ThemeEnum.LIGHT ? ThemeEnum.DARK : ThemeEnum.LIGHT;
    setTheme(newTheme);
  };

  const handleMenuClick = ({ key }: { key: string }) => {
    if (key === "home") {
      onNavigate?.("home");
    } else if (key === "new-config") {
      onNavigate?.("create-config");
    } else if (key.startsWith("config-")) {
      const configId = key.replace("config-", "");
      const config = configurations.find((c) => c.id === configId);
      if (config) {
        onNavigate?.("view-config", config);
      }
    } else if (key.startsWith("edit-config-")) {
      const configId = key.replace("edit-config-", "");
      const config = configurations.find((c) => c.id === configId);
      if (config) {
        onNavigate?.("edit-config", config);
      }
    }
  };

  // Create menu items with configurations as sub-items
  const menuItems = [
    {
      key: "home",
      icon: <HomeOutlined />,
      label: <Link href="/">Home</Link>,
    },
    {
      key: "create-config",
      icon: <PlusOutlined />,
      label: <Link href="/create-config">Create Config</Link>,
    },
    {
      key: "configurations",
      icon: <FileTextOutlined />,
      label: "Configurations",
      children: [
        ...configurations.map((config) => ({
          key: `config-${config.id}`,
          label: <Link href={`/config/${config.id}`}>{config.name}</Link>,
          icon: <FileTextOutlined />,
        })),
      ],
    },
  ];

  return (
    <Sider
      theme="light"
      width={200}
      trigger={null}
      collapsible
      collapsed={collapsed}
      collapsedWidth={60}
      className={styles.sidebarContainer}
    >
      <OllamaFlowFlex
        justify="center"
        gap={8}
        align="center"
        className={styles.logoContainer}
      >
        <OllamaFlowText weight={600} fontSize={20}>
          {collapsed ? (
            <img
              src="/images/ollama-flow-icon.png"
              alt="OllamaFlow"
              height={30}
            />
          ) : (
            <img
              src="/images/ollama-flow-logo.png"
              alt="OllamaFlow"
              height={35}
            />
          )}
        </OllamaFlowText>
      </OllamaFlowFlex>
      <OllamaFlowFlex
        justify="center"
        className=" mt"
        vertical
        align="center"
        gap={10}
      >
        <Button
          type="text"
          icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
          onClick={() => onCollapse?.(!collapsed)}
          title={collapsed ? "Expand Sidebar" : "Collapse Sidebar"}
        />
      </OllamaFlowFlex>
      <Menu
        mode="inline"
        defaultSelectedKeys={["home"]}
        items={menuItems}
        onClick={handleMenuClick}
      />
    </Sider>
  );
};

export default Sidebar;
