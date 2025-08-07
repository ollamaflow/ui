import { ColumnsType } from "antd/es/table";
import { Backend } from "#/lib/store/slice/types";
import { Tag, Space } from "antd";
import { Tooltip } from "antd";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import OllamaFlowFlex from "#/components/base/flex/Flex";
import Link from "next/link";
import { paths } from "../../constants/constant";

export const columns: (
  deleteBackendHandler: (backend: Backend) => void
) => ColumnsType<Backend> = (deleteBackendHandler) => [
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
    title: "Hostname:Port",
    dataIndex: "Hostname",
    key: "Hostname",
    width: 150,
    render: (text: string, record: Backend) => (
      <span>
        {text}:{record.Port}
      </span>
    ),
  },
  {
    title: "Port",
    dataIndex: "Port",
    key: "Port",
    width: 100,
  },
  {
    title: "SSL",
    dataIndex: "Ssl",
    key: "Ssl",
    width: 80,
    align: "center",
    render: (ssl: boolean) => (
      <Tag color={ssl ? "success" : "default"}>{ssl ? "Yes" : "No"}</Tag>
    ),
  },
  {
    title: "Health Check",
    dataIndex: "HealthCheckMethod",
    key: "HealthCheckMethod",
    width: 120,
    render: (method: { Method: string }, record: Backend) => (
      <span>{record.HealthCheckUrl}</span>
    ),
  },
  {
    title: "Status",
    dataIndex: "Active",
    key: "Active",
    width: 100,
    align: "center",
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
    align: "center",
    render: (record: Backend) => (
      <OllamaFlowFlex align="center" justify="space-around">
        <Link href={`${paths.EditBackend}/${record.Identifier}`}>
          <EditOutlined
            style={{ cursor: "pointer", color: "#1890ff" }}
            title="Edit Backend"
          />{" "}
        </Link>
        <DeleteOutlined
          style={{ cursor: "pointer", color: "#ff4d4f" }}
          title="Delete Backend"
          onClick={() => {
            // This will be handled by the parent component
            deleteBackendHandler(record);
          }}
        />
      </OllamaFlowFlex>
    ),
  },
];
