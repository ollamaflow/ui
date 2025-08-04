/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from 'react';

import { ReloadOutlined } from '@ant-design/icons';
import PageContainer from '#/components/base/pageContainer/PageContainer';
import OllamaFlowTable from '#/components/base/table/Table';
import FallBack from '#/components/fallback/FallBack';
import { useGetFrontendQuery, useDeleteFrontendMutation } from '#/lib/store/slice/apiSlice';
import { columns } from './constants';
import OllamaFlowFlex from '#/components/base/flex/Flex';
import OllamaFlowText from '#/components/base/typograpghy/Text';
import { TableColumnType, Modal, message } from 'antd';
import { Frontend } from '#/lib/store/slice/types';

// Extend Window interface to include our custom handlers
declare global {
  interface Window {
    deleteFrontendHandler?: (frontend: Frontend) => void;
  }
}

const FrontendsListingPage: React.FC = () => {
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
  const [deletingFrontend, setDeletingFrontend] = useState<Frontend | null>(null);

  const { data: frontends = [], isLoading, isFetching, isError, refetch } = useGetFrontendQuery(null);
  const isFrontendLoading = isLoading || isFetching;

  const [deleteFrontend, { isLoading: isDeleteLoading }] = useDeleteFrontendMutation();

  // Handle delete frontend
  const handleDeleteFrontend = (frontend: Frontend) => {
    setDeletingFrontend(frontend);
    setIsDeleteModalVisible(true);
  };

  // Set up global handler for delete button clicks
  useEffect(() => {
    window.deleteFrontendHandler = handleDeleteFrontend;
    return () => {
      delete window.deleteFrontendHandler;
    };
  }, [handleDeleteFrontend]);

  // Handle delete confirmation
  const handleDeleteConfirm = async () => {
    if (!deletingFrontend) return;

    try {
      await deleteFrontend(deletingFrontend.Identifier).unwrap();
      message.success('Frontend deleted successfully');
      setIsDeleteModalVisible(false);
      setDeletingFrontend(null);
      // Refresh the frontends list
      refetch();
    } catch (error) {
      console.error('Failed to delete frontend:', error);
      message.error('Failed to delete frontend');
    }
  };

  // Handle modal close
  const handleDeleteModalClose = () => {
    setIsDeleteModalVisible(false);
    setDeletingFrontend(null);
  };

  if (isError) {
    return <FallBack retry={refetch} />;
  }

  return (
    <PageContainer
      pageTitle={
        <OllamaFlowFlex align="center" gap={10}>
          <OllamaFlowText>Frontends</OllamaFlowText>
          <ReloadOutlined onClick={refetch} title="Refresh" />
        </OllamaFlowFlex>
      }
    >
      <OllamaFlowTable
        columns={columns as TableColumnType<Partial<Frontend>>[]}
        dataSource={frontends}
        loading={isFrontendLoading}
        rowKey="Identifier"
        scroll={{ x: 1600 }}
        pagination={{
          showSizeChanger: true,
          showQuickJumper: true,
          showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} frontends`,
        }}
        size="middle"
      />

      {/* Delete Confirmation Modal */}
      <Modal
        title="Delete Frontend"
        open={isDeleteModalVisible}
        onOk={handleDeleteConfirm}
        onCancel={handleDeleteModalClose}
        confirmLoading={isDeleteLoading}
        okText="Delete"
        cancelText="Cancel"
        okButtonProps={{ danger: true }}
      >
        {deletingFrontend && (
          <p>
            Are you sure you want to delete the frontend <strong>&ldquo;{deletingFrontend.Name}&rdquo;</strong> (
            {deletingFrontend.Identifier})?
          </p>
        )}
      </Modal>
    </PageContainer>
  );
};

export default FrontendsListingPage;
