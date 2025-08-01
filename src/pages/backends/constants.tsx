import { ColumnsType } from "antd/es/table";
import { Backend } from "#/lib/store/slice/types";
import { Tag } from "antd";
import { Tooltip } from "antd";

export const columns: ColumnsType<Backend> = [
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
  },
  {
    title: "Port",
    dataIndex: "Port",
    key: "Port",
    width: 80,
    render: (port: number) => <Tag color="blue">{port}</Tag>,
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
    title: "Unhealthy Threshold",
    dataIndex: "UnhealthyThreshold",
    key: "UnhealthyThreshold",
    width: 140,
    render: (value: number) => <Tag color="red">{value}</Tag>,
  },
  {
    title: "Healthy Threshold",
    dataIndex: "HealthyThreshold",
    key: "HealthyThreshold",
    width: 130,
    render: (value: number) => <Tag color="green">{value}</Tag>,
  },
  {
    title: "Max Parallel Requests",
    dataIndex: "MaxParallelRequests",
    key: "MaxParallelRequests",
    width: 160,
    render: (value: number) => value.toLocaleString(),
  },
  {
    title: "Rate Limit Threshold",
    dataIndex: "RateLimitRequestsThreshold",
    key: "RateLimitRequestsThreshold",
    width: 160,
    render: (value: number) => value.toLocaleString(),
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
    render: (date: Date | string) => {
      try {
        const dateObj = typeof date === "string" ? new Date(date) : date;
        return dateObj.toLocaleDateString();
      } catch {
        return "Invalid Date";
      }
    },
  },
];
