import { ColumnsType } from "antd/es/table";
import { Frontend } from "#/lib/store/slice/types";
import { Tag } from "antd";
import { Tooltip } from "antd";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import Link from "next/link";
import OllamaFlowFlex from "#/components/base/flex/Flex";
import OllamaFlowText from "#/components/base/typograpghy/Text";
import { paths } from "../../constants/constant";

export const columns: (
  deleteFrontendHandler: (frontend: Frontend) => void
) => ColumnsType<Frontend> = (deleteFrontendHandler) => [
  {
    title: "Identifier",
    dataIndex: "Identifier",
    key: "Identifier",
    width: 150,
    render: (text: string) => (
      <Tooltip title={text}>
        <span style={{ fontFamily: "monospace" }}>{text}</span>
      </Tooltip>
    ),
  },
  {
    title: "Name",
    dataIndex: "Name",
    key: "Name",
    width: 200,
  },
  {
    title: "Hostname",
    dataIndex: "Hostname",
    key: "Hostname",
    width: 150,
    render: (text: string, _record: Frontend) => <span>{text}</span>,
  },
  {
    title: "Load Balancing",
    dataIndex: "LoadBalancing",
    key: "LoadBalancing",
    width: 150,
    render: (text: string) => <Tag color="blue">{text}</Tag>,
  },
  {
    title: "Backends",
    dataIndex: "Backends",
    key: "Backends",
    width: 100,
    render: (backends: string[]) => <Tag color="green">{backends.length}</Tag>,
  },
  {
    title: "Required Models",
    dataIndex: "RequiredModels",
    key: "RequiredModels",
    width: 150,
    render: (models: string[]) => (
      <Tooltip title={models.join(", ")}>
        <Tag color="orange">{models.length} models</Tag>
      </Tooltip>
    ),
  },
  {
    title: "Status",
    dataIndex: "Active",
    key: "Active",
    width: 100,
    render: (active: boolean) => (
      <Tag color={active ? "success" : "error"}>
        {active ? "Active" : "Inactive"}
      </Tag>
    ),
  },
  {
    title: "Created",
    dataIndex: "CreatedUtc",
    key: "CreatedUtc",
    width: 150,
    render: (date: string) => {
      try {
        return new Date(date).toLocaleDateString();
      } catch {
        return "Invalid Date";
      }
    },
  },
  {
    title: "Actions",
    key: "actions",
    width: 120,
    render: (record: Frontend) => (
      <OllamaFlowFlex align="center" justify="space-around">
        <Link href={`${paths.EditFrontend}/${record.Identifier}`}>
          <EditOutlined
            style={{ cursor: "pointer", color: "#1890ff" }}
            title="Edit Frontend"
          />
        </Link>
        <DeleteOutlined
          style={{ cursor: "pointer", color: "#ff4d4f" }}
          title="Delete Frontend"
          onClick={() => {
            // This will be handled by the parent component
            deleteFrontendHandler(record);
          }}
        />
      </OllamaFlowFlex>
    ),
  },
];
