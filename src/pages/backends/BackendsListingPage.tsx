import React from "react";

import { ReloadOutlined } from "@ant-design/icons";
import PageContainer from "#/components/base/pageContainer/PageContainer";
import OllamaFlowTable from "#/components/base/table/Table";
import FallBack from "#/components/fallback/FallBack";
import OllamaFlowButton from "#/components/base/button/Button";
import { useGetBackendQuery } from "#/lib/store/slice/apiSlice";
import { columns } from "./constants";
import OllamaFlowFlex from "#/components/base/flex/Flex";
import OllamaFlowText from "#/components/base/typograpghy/Text";

const BackendsListingPage: React.FC = () => {
  const {
    data: backends = [],
    isLoading,
    isFetching,
    isError,
    refetch,
  } = useGetBackendQuery(null);
  const isBackendLoading = isLoading || isFetching;
  console.log(backends);
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
    >
      <OllamaFlowTable
        columns={columns as any}
        dataSource={backends}
        loading={isBackendLoading}
        rowKey="Identifier"
        scroll={{ x: 1400 }}
        pagination={{
          showSizeChanger: true,
          showQuickJumper: true,
          showTotal: (total, range) =>
            `${range[0]}-${range[1]} of ${total} backends`,
        }}
        size="middle"
      />
    </PageContainer>
  );
};

export default BackendsListingPage;
