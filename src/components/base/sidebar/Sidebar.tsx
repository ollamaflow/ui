import React, { useState, useEffect } from 'react';
import { Layout, Menu, Button } from 'antd';
import {
  FileTextOutlined,
  HomeOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  SunOutlined,
  MoonOutlined,
  PlusOutlined,
} from '@ant-design/icons';
import classNames from 'classnames';
import { useAppContext } from '../../../hooks/appHooks';
import { ThemeEnum, Configuration } from '../../../types/types';
import '../../../assets/css/globals.scss';

const { Sider } = Layout;

interface SidebarProps {
  collapsed?: boolean;
  onCollapse?: (collapsed: boolean) => void;
  onNavigate?: (view: string, config?: Configuration) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ collapsed = false, onCollapse, onNavigate }) => {
  const { theme, setTheme, configurations } = useAppContext();
  const [mounted, setMounted] = useState(false);

  // Set mounted flag after mount to avoid hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  const handleThemeToggle = () => {
    const newTheme = theme === ThemeEnum.LIGHT ? ThemeEnum.DARK : ThemeEnum.LIGHT;
    setTheme(newTheme);
  };

  const handleMenuClick = ({ key }: { key: string }) => {
    if (key === 'home') {
      onNavigate?.('home');
    } else if (key === 'new-config') {
      onNavigate?.('create-config');
    } else if (key.startsWith('config-')) {
      const configId = key.replace('config-', '');
      const config = configurations.find((c) => c.id === configId);
      if (config) {
        onNavigate?.('view-config', config);
      }
    } else if (key.startsWith('edit-config-')) {
      const configId = key.replace('edit-config-', '');
      const config = configurations.find((c) => c.id === configId);
      if (config) {
        onNavigate?.('edit-config', config);
      }
    }
  };

  // Only render theme toggle when mounted to avoid hydration mismatch
  const renderThemeToggle = () => {
    if (!mounted) {
      return <Button type="text" icon={<SunOutlined />} className="sidebar__header-toggle" title="Switch to Dark" />;
    }

    return (
      <Button
        type="text"
        icon={theme === ThemeEnum.LIGHT ? <MoonOutlined /> : <SunOutlined />}
        onClick={handleThemeToggle}
        className="sidebar__header-toggle"
        title={theme === ThemeEnum.LIGHT ? 'Switch to Dark' : 'Switch to Light'}
      />
    );
  };

  // Create menu items with configurations as sub-items
  const menuItems = [
    {
      key: 'home',
      icon: <HomeOutlined />,
      label: 'Home',
    },
    {
      key: 'configurations',
      icon: <FileTextOutlined />,
      label: 'Configurations',
      children: [
        ...configurations.map((config) => ({
          key: `config-${config.id}`,
          label: config.name,
          icon: <FileTextOutlined />,
        })),
      ],
    },
  ];

  return (
    <Sider collapsed={collapsed} className="sidebar">
      <div className="sidebar__header">
        <h3
          className={classNames('sidebar__header-title', {
            'sidebar__header-title--collapsed': collapsed,
          })}
        >
          {collapsed ? 'OF' : 'OllamaFlow'}
        </h3>
        <div className="sidebar__header-actions">
          {renderThemeToggle()}
          <Button
            type="text"
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={() => onCollapse?.(!collapsed)}
            className="sidebar__header-toggle"
            title={collapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
          />
        </div>
      </div>
      <Menu
        mode="inline"
        defaultSelectedKeys={['home']}
        items={menuItems}
        className="sidebar__menu"
        onClick={handleMenuClick}
      />
    </Sider>
  );
};

export default Sidebar;
