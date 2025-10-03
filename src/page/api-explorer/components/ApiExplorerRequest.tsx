'use client';

import React from 'react';
import OllamaFlowCard from '#/components/base/card/Card';
import OllamaFlowButton from '#/components/base/button/Button';
import { Input } from 'antd';
import styles from './apiExplorerRequest.module.scss';

interface ApiExplorerRequestProps {
  requestBody: string;
  onRequestBodyChange: (body: string) => void;
  onSendRequest: () => void;
  onStopRequest: () => void;
  isSending: boolean;
}

export default function ApiExplorerRequest({
  requestBody,
  onRequestBodyChange,
  onSendRequest,
  onStopRequest,
  isSending,
}: ApiExplorerRequestProps) {
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      onSendRequest();
    }
  };

  return (
    <div className={styles.leftPanel}>
      <OllamaFlowCard title="Request Body" className={styles.requestCard}>
        <Input.TextArea
          id="request-body"
          className={styles.requestTextarea}
          spellCheck={false}
          value={requestBody}
          onChange={(e) => onRequestBodyChange(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder='{
  "model": "llama2",
  "messages": [
    { "role": "user", "content": "Hello, how are you?" }
  ],
  "stream": true
}'
          autoSize={{ minRows: 15 }}
        />
      </OllamaFlowCard>
      <div className={styles.buttonGroup}>
        <OllamaFlowButton
          id="send-button"
          type="primary"
          loading={isSending}
          onClick={onSendRequest}
          disabled={isSending}
          className={styles.sendButton}
        >
          {isSending ? 'Sending...' : 'Send Request'}
        </OllamaFlowButton>
        <OllamaFlowButton
          id="stop-button"
          type="default"
          danger
          onClick={onStopRequest}
          disabled={!isSending}
          className={styles.stopButton}
        >
          Stop
        </OllamaFlowButton>
      </div>
    </div>
  );
}
