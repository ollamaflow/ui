"use client";
import { StyleProvider } from "@ant-design/cssinjs";
import { AntdRegistry } from "@ant-design/nextjs-registry";
import { AppContext } from "../hooks/appHooks";
import React, { useState, useEffect } from "react";
import { ThemeEnum, Configuration } from "../types/types";
import { darkTheme, primaryTheme } from "../theme/theme";
import { ConfigProvider } from "antd";
// import AuthLayout from '@/components/layout/AuthLayout';
// import StoreProvider from '@/lib/store/StoreProvider';
import { localStorageKeys } from "../constants/constant";

const getThemeFromLocalStorage = () => {
  let theme;
  if (typeof localStorage !== "undefined") {
    theme = localStorage.getItem(localStorageKeys.theme);
  }
  return theme ? (theme as ThemeEnum) : ThemeEnum.LIGHT;
};

const getConfigurationsFromLocalStorage = (): Configuration[] => {
  if (typeof localStorage !== "undefined") {
    const saved = localStorage.getItem("ollamaflow-configurations");
    if (saved) {
      try {
        const configs = JSON.parse(saved);
        return configs.map((config: Configuration) => ({
          ...config,
          createdAt: new Date(config.createdAt),
          updatedAt: new Date(config.updatedAt),
        }));
      } catch (error) {
        console.error("Error parsing configurations from localStorage:", error);
      }
    }
  }
  return [];
};

const AppProviders = ({ children }: { children: React.ReactNode }) => {
  const [theme, setTheme] = useState<ThemeEnum>(ThemeEnum.LIGHT);
  const [configurations, setConfigurations] = useState<Configuration[]>([]);
  const [mounted, setMounted] = useState(false);

  // Load theme and configurations after mount to prevent hydration mismatch
  useEffect(() => {
    setMounted(true);
    const savedTheme = getThemeFromLocalStorage();
    const savedConfigurations = getConfigurationsFromLocalStorage();
    setTheme(savedTheme);
    setConfigurations(savedConfigurations);
  }, []);

  const handleThemeChange = (theme: ThemeEnum) => {
    localStorage.setItem(localStorageKeys.theme, theme);
    setTheme(theme);
  };

  const addConfiguration = (config: Configuration) => {
    const newConfigurations = [...configurations, config];
    setConfigurations(newConfigurations);
    localStorage.setItem(
      "ollamaflow-configurations",
      JSON.stringify(newConfigurations)
    );
  };

  const removeConfiguration = (id: string) => {
    const newConfigurations = configurations.filter(
      (config) => config.id !== id
    );
    setConfigurations(newConfigurations);
    localStorage.setItem(
      "ollamaflow-configurations",
      JSON.stringify(newConfigurations)
    );
  };

  const updateConfiguration = (id: string, updatedConfig: Configuration) => {
    const newConfigurations = configurations.map((config) =>
      config.id === id ? updatedConfig : config
    );
    setConfigurations(newConfigurations);
    localStorage.setItem(
      "ollamaflow-configurations",
      JSON.stringify(newConfigurations)
    );
  };

  return (
    // <StoreProvider>
    <AppContext.Provider
      value={{
        theme,
        setTheme: handleThemeChange,
        configurations,
        addConfiguration,
        removeConfiguration,
        updateConfiguration,
      }}
    >
      <StyleProvider hashPriority="high">
        <AntdRegistry>
          <ConfigProvider
            theme={theme === ThemeEnum.LIGHT ? primaryTheme : darkTheme}
          >
            {children}
          </ConfigProvider>
        </AntdRegistry>
      </StyleProvider>
    </AppContext.Provider>
    // </StoreProvider>
  );
};

export default AppProviders;
