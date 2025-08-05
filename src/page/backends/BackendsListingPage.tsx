/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import React, { useState, useEffect } from "react";

import { ReloadOutlined, PlusOutlined } from "@ant-design/icons";
import PageContainer from "#/components/base/pageContainer/PageContainer";
import OllamaFlowTable from "#/components/base/table/Table";
import FallBack from "#/components/fallback/FallBack";
import {
  useGetBackendQuery,
  useDeleteBackendMutation,
} from "#/lib/store/slice/apiSlice";
import { columns } from "./constants";
import OllamaFlowFlex from "#/components/base/flex/Flex";
import OllamaFlowText from "#/components/base/typograpghy/Text";
import OllamaFlowButton from "#/components/base/button/Button";
import { TableColumnType, Modal, message } from "antd";
import { Backend } from "#/lib/store/slice/types";
import { useRouter } from "next/navigation";
import { paths } from "#/constants/constant";

// Extend Window interface to include our custom handlers
declare global {
  interface Window {
    deleteBackendHandler?: (backend: Backend) => void;
  }
}

const BackendsListingPage: React.FC = () => {
  const router = useRouter();
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
  const [deletingBackend, setDeletingBackend] = useState<Backend | null>(null);

  const {
    data: backends = [],
    isLoading,
    isFetching,
    isError,
    refetch,
  } = useGetBackendQuery(null);
  const isBackendLoading = isLoading || isFetching;

  const [deleteBackend, { isLoading: isDeleteLoading }] =
    useDeleteBackendMutation();

  // Handle create backend navigation
  const handleCreateBackend = () => {
    router.push(paths.DashboardCreateBackend);
  };

  // Handle delete backend
  const handleDeleteBackend = (backend: Backend) => {
    setDeletingBackend(backend);
    setIsDeleteModalVisible(true);
  };

  // Set up global handler for delete button clicks
  useEffect(() => {
    window.deleteBackendHandler = handleDeleteBackend;
    return () => {
      delete window.deleteBackendHandler;
    };
  }, [handleDeleteBackend]);

  // Handle delete confirmation
  const handleDeleteConfirm = async () => {
    if (!deletingBackend) return;

    try {
      await deleteBackend(deletingBackend.Identifier).unwrap();
      message.success("Backend deleted successfully");
      setIsDeleteModalVisible(false);
      setDeletingBackend(null);
      // Refresh the backends list
      refetch();
    } catch (error) {
      console.error("Failed to delete backend:", error);
      message.error("Failed to delete backend");
    }
  };

  // Handle modal close
  const handleDeleteModalClose = () => {
    setIsDeleteModalVisible(false);
    setDeletingBackend(null);
  };

  if (isError) {
    return <FallBack retry={refetch} />;
  }

  return (
    <PageContainer
      pageTitle={
        <OllamaFlowFlex align="center" gap={10}>
          <OllamaFlowText>Backends</OllamaFlowText>
          <ReloadOutlined onClick={refetch} title="Refresh" />
        </OllamaFlowFlex>
      }
      pageTitleRightContent={
        <OllamaFlowButton
          type="primary"
          variant="link"
          icon={<PlusOutlined />}
          onClick={handleCreateBackend}
        >
          Create Backend
        </OllamaFlowButton>
      }
    >
      <OllamaFlowTable
        columns={columns as TableColumnType<Partial<Backend>>[]}
        dataSource={backends}
        loading={isBackendLoading}
        rowKey="Identifier"
        scroll={{ x: 1600 }}
        pagination={{
          showSizeChanger: true,
          showQuickJumper: true,
          showTotal: (total, range) =>
            `${range[0]}-${range[1]} of ${total} backends`,
        }}
        size="middle"
      />

      {/* Delete Confirmation Modal */}
      <Modal
        title="Delete Backend"
        open={isDeleteModalVisible}
        onOk={handleDeleteConfirm}
        onCancel={handleDeleteModalClose}
        confirmLoading={isDeleteLoading}
        okText="Delete"
        cancelText="Cancel"
        okButtonProps={{ danger: true }}
      >
        {deletingBackend && (
          <p>
            Are you sure you want to delete the backend{" "}
            <strong>&ldquo;{deletingBackend.Name}&rdquo;</strong> (
            {deletingBackend.Identifier})?
          </p>
        )}
      </Modal>
    </PageContainer>
  );
};

export default BackendsListingPage;
