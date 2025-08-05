import { ColumnsType } from 'antd/es/table';
import { Frontend } from '#/lib/store/slice/types';
import { Tag, Space } from 'antd';
import { Tooltip } from 'antd';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';

export const columns: ColumnsType<Frontend> = [
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
    title: 'Timeout (ms)',
    dataIndex: 'TimeoutMs',
    key: 'TimeoutMs',
    width: 120,
    render: (value: number) => value.toLocaleString(),
  },
  {
    title: 'Load Balancing',
    dataIndex: 'LoadBalancing',
    key: 'LoadBalancing',
    width: 150,
    render: (text: string) => <Tag color="blue">{text}</Tag>,
  },
  {
    title: 'Max Request Size',
    dataIndex: 'MaxRequestBodySize',
    key: 'MaxRequestBodySize',
    width: 150,
    render: (size: number) => {
      const mb = size / (1024 * 1024);
      return `${mb.toFixed(1)} MB`;
    },
  },
  {
    title: 'Backends',
    dataIndex: 'Backends',
    key: 'Backends',
    width: 100,
    render: (backends: string[]) => <Tag color="green">{backends.length}</Tag>,
  },
  {
    title: 'Required Models',
    dataIndex: 'RequiredModels',
    key: 'RequiredModels',
    width: 150,
    render: (models: string[]) => (
      <Tooltip title={models.join(', ')}>
        <Tag color="orange">{models.length} models</Tag>
      </Tooltip>
    ),
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
    render: (_, record: Frontend) => (
      <Space>
        <EditOutlined
          style={{ cursor: 'pointer', color: '#1890ff' }}
          title="Edit Frontend"
          onClick={() => {
            // Navigate to edit page
            window.location.href = `/dashboard/edit-frontend/${record.Identifier}`;
          }}
        />
        <DeleteOutlined
          style={{ cursor: 'pointer', color: '#ff4d4f' }}
          title="Delete Frontend"
          onClick={() => {
            // This will be handled by the parent component
            if (window.deleteFrontendHandler) {
              window.deleteFrontendHandler(record);
            }
          }}
        />
      </Space>
    ),
  },
];
