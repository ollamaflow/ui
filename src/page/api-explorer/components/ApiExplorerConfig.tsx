"use client";

import React, { useState, useEffect } from "react";
import OllamaFlowCard from "#/components/base/card/Card";
import OllamaFlowFormItem from "#/components/base/form/FormItem";
import OllamaFlowInput from "#/components/base/input/Input";
import OllamaFlowSelect, { OptionProps } from "#/components/base/select/Select";
import { Checkbox } from "antd";
import styles from "./apiExplorerConfig.module.scss";

interface ApiExplorerConfigProps {
  onUrlChange: (url: string) => void;
  onApiTypeChange: (apiType: string) => void;
  onRequestTypeChange: (requestType: string) => void;
  onModelChange: (model: string) => void;
  onStreamToggle: (stream: boolean) => void;
}

export default function ApiExplorerConfig({
  onUrlChange,
  onApiTypeChange,
  onRequestTypeChange,
  onModelChange,
  onStreamToggle,
}: ApiExplorerConfigProps) {
  const [baseUrl, setBaseUrl] = useState("http://localhost:43411/api/chat");
  const [streamEnabled, setStreamEnabled] = useState(true);
  const [apiType, setApiType] = useState("ollama");
  const [requestType, setRequestType] = useState("chat");
  const [modelName, setModelName] = useState("llama2");

  const requestTypeOptions = {
    ollama: [
      { value: "chat", label: "Generate chat completion" },
      { value: "generate", label: "Generate completion" },
      { value: "pull", label: "Pull model" },
      { value: "list", label: "List models" },
      { value: "delete", label: "Delete model" },
      { value: "ps", label: "List running models" },
      { value: "embeddings", label: "Generate embeddings (single)" },
      { value: "embed", label: "Generate embeddings (batch)" },
    ],
    openai: [
      { value: "chat", label: "Generate chat completion" },
      { value: "completions", label: "Generate completion" },
      { value: "embeddings", label: "Generate embeddings (single)" },
      { value: "embeddings_batch", label: "Generate embeddings (batch)" },
    ],
  };

  const getEndpointForType = (apiType: string, requestType: string) => {
    if (apiType === "openai") {
      switch (requestType) {
        case "chat":
          return "/v1/chat/completions";
        case "completions":
          return "/v1/completions";
        case "embeddings":
        case "embeddings_batch":
          return "/v1/embeddings";
        default:
          return "/v1/chat/completions";
      }
    } else {
      // ollama
      switch (requestType) {
        case "chat":
          return "/api/chat";
        case "generate":
          return "/api/generate";
        case "pull":
          return "/api/pull";
        case "list":
          return "/api/tags";
        case "delete":
          return "/api/delete";
        case "ps":
          return "/api/ps";
        case "embeddings":
          return "/api/embeddings";
        case "embed":
          return "/api/embed";
        default:
          return "/api/chat";
      }
    }
  };

  useEffect(() => {
    setRequestType("chat"); // Reset to default when API type changes
  }, [apiType]);

  useEffect(() => {
    const currentBaseUrl = baseUrl;
    const baseUrlWithoutEndpoint = currentBaseUrl
      .replace(/\/api\/.*$|\/v1\/.*$/, "")
      .replace(/\/$/, "");
    const endpoint = getEndpointForType(apiType, requestType);
    const newUrl = baseUrlWithoutEndpoint + endpoint;

    if (newUrl !== baseUrl) {
      setBaseUrl(newUrl);
    }
  }, [apiType, requestType, baseUrl]);

  useEffect(() => {
    onUrlChange(baseUrl);
  }, [baseUrl, onUrlChange]);

  useEffect(() => {
    onApiTypeChange(apiType);
  }, [apiType, onApiTypeChange]);

  useEffect(() => {
    onRequestTypeChange(requestType);
  }, [requestType, onRequestTypeChange]);

  useEffect(() => {
    onModelChange(modelName);
  }, [modelName, onModelChange]);

  useEffect(() => {
    onStreamToggle(streamEnabled);
  }, [streamEnabled, onStreamToggle]);

  const apiTypeOptions: OptionProps[] = [
    { value: "ollama", label: "Ollama" },
    { value: "openai", label: "OpenAI" },
  ];

  const streamingCheckbox = (
    <Checkbox
      checked={streamEnabled}
      onChange={(e) => {
        setStreamEnabled(e.target.checked);
      }}
    >
      Enable Streaming
    </Checkbox>
  );

  return (
    <OllamaFlowCard title="Settings" className={styles.configCard}>
      <div className={styles.configContent}>
        <div className={styles.configUrlRow}>
          <OllamaFlowFormItem label="Base URL" className={styles.configItem}>
            <OllamaFlowInput
              placeholder="http://localhost:43411/api/chat"
              value={baseUrl}
              onChange={(e) => {
                setBaseUrl(e.target.value);
              }}
            />
          </OllamaFlowFormItem>
          <OllamaFlowFormItem
            label="Streaming"
            className={styles.configCheckbox}
          >
            {streamingCheckbox}
          </OllamaFlowFormItem>
        </div>
        <div className={styles.configGrid}>
          <OllamaFlowFormItem
            label="Request Format"
            className={styles.configItem}
          >
            <OllamaFlowSelect
              options={apiTypeOptions}
              value={apiType}
              onChange={(value: string | number | string[]) => {
                setApiType(String(value));
              }}
            />
          </OllamaFlowFormItem>
          <OllamaFlowFormItem
            label="Request Type"
            className={styles.configItem}
          >
            <OllamaFlowSelect
              options={(requestTypeOptions as any)[apiType]}
              value={requestType}
              onChange={(value: string | number | string[]) => {
                setRequestType(String(value));
              }}
            />
          </OllamaFlowFormItem>
          <OllamaFlowFormItem label="Model" className={styles.configItem}>
            <OllamaFlowInput
              placeholder="llama2"
              value={modelName}
              onChange={(e) => {
                setModelName(e.target.value);
              }}
            />
          </OllamaFlowFormItem>
        </div>
      </div>
    </OllamaFlowCard>
  );
}
