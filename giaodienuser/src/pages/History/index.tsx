import React from 'react';
import { Table, Tag, Space, Typography, Card, Layout } from 'antd';
import { ClockCircleOutlined, CheckCircleOutlined, CloseCircleOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import { PageContainer } from '@ant-design/pro-layout';
import styles from './index.less';

const { Title } = Typography;
const { Content } = Layout;

interface HistoryItem {
  key: string;
  deviceName: string;
  borrowDate: string;
  returnDate: string;
  status: 'pending' | 'approved' | 'rejected' | 'returned';
  requestId: string;
}

// Mock data for history
const mockData: HistoryItem[] = [
  {
    key: '1',
    deviceName: 'Laptop Dell XPS 13',
    borrowDate: '2024-03-15 09:00',
    returnDate: '2024-03-16 17:00',
    status: 'returned',
    requestId: 'REQ001',
  },
  {
    key: '2',
    deviceName: 'Máy chiếu Epson',
    borrowDate: '2024-03-20 13:00',
    returnDate: '2024-03-21 17:00',
    status: 'pending',
    requestId: 'REQ002',
  },
  // Add more history items as needed
];

const getStatusTag = (status: string) => {
  switch (status) {
    case 'pending':
      return <Tag icon={<ClockCircleOutlined />} color="processing">Đang chờ duyệt</Tag>;
    case 'approved':
      return <Tag icon={<CheckCircleOutlined />} color="success">Đã duyệt</Tag>;
    case 'rejected':
      return <Tag icon={<CloseCircleOutlined />} color="error">Từ chối</Tag>;
    case 'returned':
      return <Tag icon={<CheckCircleOutlined />} color="default">Đã trả</Tag>;
    default:
      return null;
  }
};

const HistoryPage: React.FC = () => {
  const columns: ColumnsType<HistoryItem> = [
    {
      title: 'Mã yêu cầu',
      dataIndex: 'requestId',
      key: 'requestId',
      width: 120,
    },
    {
      title: 'Tên thiết bị',
      dataIndex: 'deviceName',
      key: 'deviceName',
      width: 200,
    },
    {
      title: 'Ngày mượn',
      dataIndex: 'borrowDate',
      key: 'borrowDate',
      width: 150,
    },
    {
      title: 'Ngày trả',
      dataIndex: 'returnDate',
      key: 'returnDate',
      width: 150,
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      width: 150,
      render: (status: string) => getStatusTag(status),
    },
  ];

  return (
    <Content className={styles.content}>
      <PageContainer>
        <div className={styles.container}>
          <Card className={styles.historyCard}>
            <Title level={2} className={styles.title}>Lịch sử mượn thiết bị</Title>
            <Table
              columns={columns}
              dataSource={mockData}
              className={styles.table}
              pagination={{
                pageSize: 10,
                showSizeChanger: true,
                showTotal: (total) => `Tổng số ${total} bản ghi`,
              }}
              scroll={{ x: 'max-content' }}
            />
          </Card>
        </div>
      </PageContainer>
    </Content>
  );
};

export default HistoryPage;
