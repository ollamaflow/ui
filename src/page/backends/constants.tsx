import { ColumnsType } from "antd/es/table";
import { Backend, BackendHealth } from "#/lib/store/slice/types";
import { Tag, Space } from "antd";
import { Tooltip } from "antd";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import OllamaFlowFlex from "#/components/base/flex/Flex";
import Link from "next/link";
import { NOT_AVAILABLE, paths } from "../../constants/constant";
import { formatDate } from "#/utils/utils";

export const columns: (
  deleteBackendHandler: (backend: Backend) => void
) => ColumnsType<Backend> = (deleteBackendHandler) => [
  {
    title: "Identifier",
    dataIndex: "Identifier",
    key: "Identifier",
    width: 150,
    render: (text: string) => <Tooltip title={text}>{text}</Tooltip>,
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
    title: "SSL",
    dataIndex: "Ssl",
    key: "Ssl",
    width: 80,
    render: (ssl: boolean) => (
      <Tag color={ssl ? "success" : "error"}>{ssl ? "Yes" : "No"}</Tag>
    ),
  },
  {
    title: "API Format",
    dataIndex: "ApiFormat",
    key: "ApiFormat",
    width: 100,
    render: (apiFormat: string) => (
      <Tag color={apiFormat === "Ollama" ? "blue" : "green"}>
        {apiFormat || "Ollama"}
      </Tag>
    ),
  },
  {
    title: "Health Check URL",
    dataIndex: "HealthCheckUrl",
    key: "HealthCheckUrl",
    width: 120,
    render: (healthCheckUrl: string, record: Backend) => (
      <span>
        <Tag color="blue" className="mr-0">
          {record.HealthCheckMethod.Method}
        </Tag>{" "}
        {healthCheckUrl}
      </span>
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
export const healthColumns: (
  deleteBackendHandler: (backend: BackendHealth) => void
) => ColumnsType<BackendHealth> = (deleteBackendHandler) => [
  {
    title: "Identifier",
    dataIndex: "Identifier",
    key: "Identifier",
    width: 150,
    render: (text: string) => <Tooltip title={text}>{text}</Tooltip>,
  },
  {
    title: "Name",
    dataIndex: "Name",
    key: "Name",
    width: 200,
  },
  {
    title: "Healthy Since",
    dataIndex: "HealthySinceUtc",
    key: "HealthySinceUtc",
    width: 150,
    render: (date: string) => {
      if (!date) return <Tag color="default">{NOT_AVAILABLE}</Tag>;
      return formatDate(date);
    },
  },
  {
    title: "Unhealthy Since",
    dataIndex: "UnhealthySinceUtc",
    key: "UnhealthySinceUtc",
    width: 150,
    render: (date: string) => {
      if (!date) return <Tag color="default">{NOT_AVAILABLE}</Tag>;
      return formatDate(date);
    },
  },
  {
    title: "Uptime",
    dataIndex: "Uptime",
    key: "Uptime",
    width: 120,
    render: (uptime: string) => {
      if (!uptime) return <Tag color="default">N/A</Tag>;
      return <span style={{ fontFamily: "monospace" }}>{uptime}</span>;
    },
  },
  {
    title: "Downtime",
    dataIndex: "Downtime",
    key: "Downtime",
    width: 120,
    render: (downtime: string) => {
      if (!downtime) return <Tag color="default">N/A</Tag>;
      return <span style={{ fontFamily: "monospace" }}>{downtime}</span>;
    },
  },
  {
    title: "Active Requests",
    dataIndex: "ActiveRequests",
    key: "ActiveRequests",
    width: 120,
    render: (count: number) => (
      <Tag color={count > 0 ? "processing" : "default"}>{count || 0}</Tag>
    ),
  },
  // {
  //   title: "Actions",
  //   key: "actions",
  //   width: 120,
  //   render: (record: BackendHealth) => (
  //     <OllamaFlowFlex align="center" justify="space-around">
  //       <Link href={`${paths.EditBackend}/${record.Identifier}`}>
  //         <EditOutlined
  //           style={{ cursor: "pointer", color: "#1890ff" }}
  //           title="Edit Backend"
  //         />{" "}
  //       </Link>
  //       <DeleteOutlined
  //         style={{ cursor: "pointer", color: "#ff4d4f" }}
  //         title="Delete Backend"
  //         onClick={() => {
  //           // This will be handled by the parent component
  //           deleteBackendHandler(record);
  //         }}
  //       />
  //     </OllamaFlowFlex>
  //   ),
  // },
];
