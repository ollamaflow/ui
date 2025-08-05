"use client";
import React from "react";
import { useParams, useRouter } from "next/navigation";
import { message } from "antd";
import PageContainer from "#/components/base/pageContainer/PageContainer";
import CreateEditBackend from "#/page/create-backend/CreateEditBackend";
import {
  useGetBackendQuery,
  useEditBackendMutation,
  EditBackendPayload,
} from "#/lib/store/slice/apiSlice";
import OllamaFlowFlex from "#/components/base/flex/Flex";
import OllamaFlowText from "#/components/base/typograpghy/Text";
import OllamaFlowButton from "#/components/base/button/Button";
import { ArrowLeftOutlined } from "@ant-design/icons";
import { Backend } from "#/lib/store/slice/types";

const EditBackendPage: React.FC = () => {
  const params = useParams();
  const router = useRouter();
  const backendId = params?.id as string;

  const [editBackend, { isLoading: isEditLoading }] = useEditBackendMutation();

  // Fetch the specific backend data
  const {
    data: backends,
    isLoading: isBackendLoading,
    isError: isBackendError,
  } = useGetBackendQuery(null);

  const currentBackend = backends?.find(
    (b: Backend) => b.Identifier === backendId
  );

  // Handle form submission for editing
  const handleEditSubmit = async (
    values: Omit<EditBackendPayload, "Identifier">
  ) => {
    try {
      // Add the identifier to the payload for edit requests
      const editPayload: EditBackendPayload = {
        ...values,
        Identifier: backendId,
      };

      await editBackend(editPayload).unwrap();
      message.success("Backend updated successfully");
      router.push("/dashboard/backends");
    } catch (error) {
      console.error("Failed to edit backend:", error);
      message.error("Failed to update backend");
    }
  };

  // Handle back navigation
  const handleBack = () => {
    router.push("/dashboard/backends");
  };

  if (isBackendLoading) {
    return (
      <PageContainer>
        <OllamaFlowFlex
          justify="center"
          align="center"
          style={{ height: "400px" }}
        >
          <OllamaFlowText>Loading backend data...</OllamaFlowText>
        </OllamaFlowFlex>
      </PageContainer>
    );
  }

  if (isBackendError || !currentBackend) {
    return (
      <PageContainer>
        <OllamaFlowFlex
          vertical
          gap={20}
          align="center"
          style={{ height: "400px" }}
        >
          <OllamaFlowText>Backend not found</OllamaFlowText>
          <OllamaFlowButton onClick={handleBack}>
            <ArrowLeftOutlined /> Back to Backends
          </OllamaFlowButton>
        </OllamaFlowFlex>
      </PageContainer>
    );
  }

  return (
    <PageContainer
      pageTitle={
        <OllamaFlowFlex align="center" gap={10}>
          <OllamaFlowButton
            type="text"
            icon={<ArrowLeftOutlined />}
            onClick={handleBack}
            style={{ padding: 0 }}
          />
          <OllamaFlowText>Edit Backend: {currentBackend.Name}</OllamaFlowText>
        </OllamaFlowFlex>
      }
    >
      <CreateEditBackend
        mode="edit"
        initialValues={currentBackend}
        onSubmit={handleEditSubmit}
        loading={isEditLoading}
      />
    </PageContainer>
  );
};

export default EditBackendPage;
