import { ColumnsType } from 'antd/es/table';
import { Backend } from '#/lib/store/slice/types';
import { Tag, Space } from 'antd';
import { Tooltip } from 'antd';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';

export const columns: ColumnsType<Backend> = [
  {
    title: 'Identifier',
    dataIndex: 'Identifier',
    key: 'Identifier',
    width: 150,
    render: (text: string) => (
      <Tooltip title={text}>
        <span style={{ fontFamily: 'monospace' }}>{text}</span>
      </Tooltip>
    ),
  },
  {
    title: 'Name',
    dataIndex: 'Name',
    key: 'Name',
    width: 200,
  },
  {
    title: 'Hostname',
    dataIndex: 'Hostname',
    key: 'Hostname',
    width: 150,
  },
  {
    title: 'Port',
    dataIndex: 'Port',
    key: 'Port',
    width: 100,
  },
  {
    title: 'SSL',
    dataIndex: 'Ssl',
    key: 'Ssl',
    width: 80,
    align: 'center',
    render: (ssl: boolean) => <Tag color={ssl ? 'success' : 'default'}>{ssl ? 'Yes' : 'No'}</Tag>,
  },
  {
    title: 'Max Parallel',
    dataIndex: 'MaxParallelRequests',
    key: 'MaxParallelRequests',
    width: 120,
  },
  {
    title: 'Rate Limit',
    dataIndex: 'RateLimitRequestsThreshold',
    key: 'RateLimitRequestsThreshold',
    width: 120,
  },
  {
    title: 'Health Check',
    dataIndex: 'HealthCheckMethod',
    key: 'HealthCheckMethod',
    width: 120,
    render: (method: { Method: string }) => <Tag color="blue">{method?.Method}</Tag>,
  },
  {
    title: 'Status',
    dataIndex: 'Active',
    key: 'Active',
    width: 100,
    align: 'center',
    render: (active: boolean) => <Tag color={active ? 'success' : 'error'}>{active ? 'Active' : 'Inactive'}</Tag>,
  },
  {
    title: 'Created',
    dataIndex: 'CreatedUtc',
    key: 'CreatedUtc',
    width: 150,
    render: (date: string) => {
      try {
        return new Date(date).toLocaleDateString();
      } catch {
        return 'Invalid Date';
      }
    },
  },
  {
    title: 'Actions',
    key: 'actions',
    width: 120,
    align: 'center',
    render: (_, record: Backend) => (
      <Space>
        <EditOutlined
          style={{ cursor: 'pointer', color: '#1890ff' }}
          title="Edit Backend"
          onClick={() => {
            // Navigate to edit page
            window.location.href = `/dashboard/edit-backend/${record.Identifier}`;
          }}
        />
        <DeleteOutlined
          style={{ cursor: 'pointer', color: '#ff4d4f' }}
          title="Delete Backend"
          onClick={() => {
            // This will be handled by the parent component
            if (window.deleteBackendHandler) {
              window.deleteBackendHandler(record);
            }
          }}
        />
      </Space>
    ),
  },
];
