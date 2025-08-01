import React from "react";
import { Layout, Menu, Button } from "antd";
import {
  FileTextOutlined,
  HomeOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  PlusOutlined,
  CloudServerOutlined,
} from "@ant-design/icons";
import { useAppContext } from "#/hooks/appHooks";
import "../../../assets/css/globals.scss";
import OllamaFlowFlex from "../flex/Flex";
import styles from "./sidebar.module.scss";
import OllamaFlowText from "../typograpghy/Text";
import Link from "next/link";
import { paths } from "#/constants/constant";

const { Sider } = Layout;

interface SidebarProps {
  collapsed?: boolean;
  onCollapse?: (collapsed: boolean) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ collapsed = false, onCollapse }) => {
  const { configurations } = useAppContext();

  // Create menu items with configurations as sub-items
  const menuItems = [
    {
      key: "home",
      icon: <HomeOutlined />,
      label: <Link href={paths.Dashboard}>Home</Link>,
    },
    {
      key: "create-config",
      icon: <PlusOutlined />,
      label: <Link href={paths.DashboardCreateConfig}>Create Config</Link>,
    },
    {
      key: "frontends",
      icon: <FileTextOutlined />,
      label: <Link href={paths.DashboardFrontends}>Frontends</Link>,
    },
    {
      key: "backends",
      icon: <CloudServerOutlined />,
      label: <Link href={paths.DashboardBackends}>Backends</Link>,
    },
    {
      key: "configurations",
      icon: <FileTextOutlined />,
      label: "Configurations",
      children: [
        ...configurations.map((config) => ({
          key: `config-${config.id}`,
          label: (
            <Link href={`${paths.Dashboard}/${config.id}`}>{config.name}</Link>
          ),
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
              height={40}
            />
          ) : (
            <OllamaFlowFlex align="center" gap={7} className="fade-in">
              <img
                src="/images/ollama-flow-icon.png"
                alt="OllamaFlow"
                height={40}
              />
              OllamaFlow
            </OllamaFlowFlex>
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
      <Menu mode="inline" defaultSelectedKeys={["home"]} items={menuItems} />
    </Sider>
  );
};

export default Sidebar;
