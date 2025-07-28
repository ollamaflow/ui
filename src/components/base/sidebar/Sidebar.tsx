import React, { useState, useEffect } from 'react';
import { Layout, Menu, Button } from 'antd';
import {
  FileTextOutlined,
  SettingOutlined,
  HomeOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  SunOutlined,
  MoonOutlined,
} from '@ant-design/icons';
import classNames from 'classnames';
import { useAppContext } from '../../../hooks/appHooks';
import { ThemeEnum } from '../../../types/types';
import '../../../styles/global.scss';

const { Sider } = Layout;

interface SidebarProps {
  collapsed?: boolean;
  onCollapse?: (collapsed: boolean) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ collapsed = false, onCollapse }) => {
  const { theme, setTheme } = useAppContext();
  const [mounted, setMounted] = useState(false);

  // Set mounted flag after mount to avoid hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  const menuItems = [
    {
      key: 'home',
      icon: <HomeOutlined />,
      label: 'Home',
    },
    {
      key: 'configs',
      icon: <FileTextOutlined />,
      label: 'Configurations',
    },
    {
      key: 'settings',
      icon: <SettingOutlined />,
      label: 'Settings',
    },
  ];

  const handleThemeToggle = () => {
    const newTheme = theme === ThemeEnum.LIGHT ? ThemeEnum.DARK : ThemeEnum.LIGHT;
    setTheme(newTheme);
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
      <Menu mode="inline" defaultSelectedKeys={['home']} items={menuItems} className="sidebar__menu" />
    </Sider>
  );
};

export default Sidebar;
