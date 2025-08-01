import React from "react";

import { ReloadOutlined } from "@ant-design/icons";
import PageContainer from "#/components/base/pageContainer/PageContainer";
import OllamaFlowTable from "#/components/base/table/Table";
import FallBack from "#/components/fallback/FallBack";
import OllamaFlowButton from "#/components/base/button/Button";
import { useGetFrontendQuery } from "#/lib/store/slice/apiSlice";
import { columns } from "./constants";
import OllamaFlowFlex from "#/components/base/flex/Flex";
import OllamaFlowText from "#/components/base/typograpghy/Text";

const FrontendsListingPage: React.FC = () => {
  const {
    data: frontends = [],
    isLoading,
    isFetching,
    isError,
    refetch,
  } = useGetFrontendQuery(null);
  const isFrontendLoading = isLoading || isFetching;

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
        columns={columns as any}
        dataSource={frontends}
        loading={isFrontendLoading}
        rowKey="Identifier"
        scroll={{ x: 1400 }}
        pagination={{
          showSizeChanger: true,
          showQuickJumper: true,
          showTotal: (total, range) =>
            `${range[0]}-${range[1]} of ${total} frontends`,
        }}
        size="middle"
      />
    </PageContainer>
  );
};

export default FrontendsListingPage;
