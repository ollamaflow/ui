import { ColumnsType } from "antd/es/table";
import { Backend, BackendHealth } from "#/lib/store/slice/types";
import { Tag, Space } from "antd";
import OllamaFlowTooltip from "#/components/base/tooltip/Tooltip";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import OllamaFlowFlex from "#/components/base/flex/Flex";
import Link from "next/link";
import { NOT_AVAILABLE, paths } from "../../constants/constant";
import { formatDate } from "#/utils/utils";

export const columns: (
  deleteBackendHandler: (backend: Backend) => void
) => ColumnsType<Backend> = (deleteBackendHandler) => [
  {
    title: (
      <OllamaFlowTooltip title="A unique identifier for the backend">
        Identifier
      </OllamaFlowTooltip>
    ),
    dataIndex: "Identifier",
    key: "Identifier",
    width: 150,
    render: (text: string) => (
      <OllamaFlowTooltip title={text}>{text}</OllamaFlowTooltip>
    ),
  },
  {
    title: (
      <OllamaFlowTooltip title="The name of the backend">
        Name
      </OllamaFlowTooltip>
    ),
    dataIndex: "Name",
    key: "Name",
    width: 200,
  },
  {
    title: (
      <OllamaFlowTooltip title="The hostname and port to which requests will be proxied">
        Hostname:Port
      </OllamaFlowTooltip>
    ),
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
    title: (
      <OllamaFlowTooltip title="Indicates whether SSL is enabled or disabled">
        SSL
      </OllamaFlowTooltip>
    ),
    dataIndex: "Ssl",
    key: "Ssl",
    width: 80,
    render: (ssl: boolean) => (
      <Tag color={ssl ? "success" : "error"}>{ssl ? "Yes" : "No"}</Tag>
    ),
  },
  {
    title: (
      <OllamaFlowTooltip title="The expected format of API requests expected by this backend">
        API Format
      </OllamaFlowTooltip>
    ),
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
    title: (
      <OllamaFlowTooltip title="Indicates whether or not the backend is active or administratively disabled">
        Status
      </OllamaFlowTooltip>
    ),
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
    title: (
      <OllamaFlowTooltip title="Timestamp from which the backend was created">
        Created
      </OllamaFlowTooltip>
    ),
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
    title: (
      <OllamaFlowTooltip title="A unique identifier for the backend">
        Identifier
      </OllamaFlowTooltip>
    ),
    dataIndex: "Identifier",
    key: "Identifier",
    width: 150,
    render: (text: string) => (
      <OllamaFlowTooltip title={text}>{text}</OllamaFlowTooltip>
    ),
  },
  {
    title: (
      <OllamaFlowTooltip title="The name of the backend">
        Name
      </OllamaFlowTooltip>
    ),
    dataIndex: "Name",
    key: "Name",
    width: 200,
  },
  {
    title: (
      <OllamaFlowTooltip title="The timestamp at which the backend became healthy">
        Healthy Since
      </OllamaFlowTooltip>
    ),
    dataIndex: "HealthySinceUtc",
    key: "HealthySinceUtc",
    width: 150,
    render: (date: string) => {
      if (!date) return <Tag color="default">{NOT_AVAILABLE}</Tag>;
      return formatDate(date);
    },
  },
  {
    title: (
      <OllamaFlowTooltip title="The timestamp at which the backend became unhealthy">
        Unhealthy Since
      </OllamaFlowTooltip>
    ),
    dataIndex: "UnhealthySinceUtc",
    key: "UnhealthySinceUtc",
    width: 150,
    render: (date: string) => {
      if (!date) return <Tag color="default">{NOT_AVAILABLE}</Tag>;
      return formatDate(date);
    },
  },
  {
    title: (
      <OllamaFlowTooltip title="The amount of time the backend has been healthy, of the form hours:minutes:seconds.subseconds">
        Uptime
      </OllamaFlowTooltip>
    ),
    dataIndex: "Uptime",
    key: "Uptime",
    width: 120,
    render: (uptime: string) => {
      if (!uptime) return <Tag color="default">N/A</Tag>;
      return <span style={{ fontFamily: "monospace" }}>{uptime}</span>;
    },
  },
  {
    title: (
      <OllamaFlowTooltip title="The amount of time the backend has been unhealthy, of the form hours:minutes:seconds.subseconds">
        Downtime
      </OllamaFlowTooltip>
    ),
    dataIndex: "Downtime",
    key: "Downtime",
    width: 120,
    render: (downtime: string) => {
      if (!downtime) return <Tag color="default">N/A</Tag>;
      return <span style={{ fontFamily: "monospace" }}>{downtime}</span>;
    },
  },
  {
    title: (
      <OllamaFlowTooltip title="The number of requests currently being actively served by this backend">
        Active Requests
      </OllamaFlowTooltip>
    ),
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
