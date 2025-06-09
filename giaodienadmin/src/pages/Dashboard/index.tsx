
import React, { useState, useEffect } from 'react';
import {
  Card,
  Row,
  Col,
  Statistic,
  Table,
  List,
  Avatar,
  Tag,
  Typography,
  Alert,
  Button,
  Spin,
  Space,
  Progress,
} from 'antd';
import {
  UserOutlined,
  SettingOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  ExclamationCircleOutlined,
  WarningOutlined,
  ClockCircleOutlined,
  TrophyOutlined,
  ReloadOutlined,
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import {
  getAdminOverviewStatistics,
  getTopBorrowedDevices,
  getOverdueDevices,
  getDueSoonDevices,
  getMonthlyStatistics,
  AdminOverviewStatistics,
  TopBorrowedDevice,
  OverdueDevice,
  DueSoonDevice,
  MonthlyStatistics,
} from '@/services/admin/statistics.service';

const { Title, Text } = Typography;

const Dashboard: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [overviewStats, setOverviewStats] = useState<AdminOverviewStatistics | null>(null);
  const [topDevices, setTopDevices] = useState<TopBorrowedDevice[]>([]);
  const [overdueDevices, setOverdueDevices] = useState<OverdueDevice[]>([]);
  const [dueSoonDevices, setDueSoonDevices] = useState<DueSoonDevice[]>([]);
  const [monthlyStats, setMonthlyStats] = useState<MonthlyStatistics[]>([]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [overview, top, overdue, dueSoon, monthly] = await Promise.all([
        getAdminOverviewStatistics(),
        getTopBorrowedDevices(5),
        getOverdueDevices(),
        getDueSoonDevices(),
        getMonthlyStatistics(6),
      ]);

      setOverviewStats(overview);
      setTopDevices(top);
      setOverdueDevices(overdue);
      setDueSoonDevices(dueSoon);
      setMonthlyStats(monthly);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const overdueColumns: ColumnsType<OverdueDevice> = [
    {
      title: 'Thiết bị',
      dataIndex: ['deviceId', 'name'],
      key: 'deviceName',
      render: (text, record) => (
        <div>
          <div>{record.deviceId.name}</div>
          <Text type="secondary">{record.deviceId.code}</Text>
        </div>
      ),
    },
    {
      title: 'Người mượn',
      dataIndex: ['userId', 'fullName'],
      key: 'userName',
      render: (text, record) => (
        <div>
          <div>{record.userId.fullName}</div>
          <Text type="secondary">{record.userId.email}</Text>
        </div>
      ),
    },
    {
      title: 'Ngày mượn',
      dataIndex: 'borrowDate',
      key: 'borrowDate',
      render: (date) => new Date(date).toLocaleDateString('vi-VN'),
    },
    {
      title: 'Hạn trả',
      dataIndex: 'expectedReturnDate',
      key: 'expectedReturnDate',
      render: (date) => new Date(date).toLocaleDateString('vi-VN'),
    },
    {
      title: 'Quá hạn',
      dataIndex: 'daysOverdue',
      key: 'daysOverdue',
      render: (days) => (
        <Tag color="red">
          {days} ngày
        </Tag>
      ),
    },
  ];

  const dueSoonColumns: ColumnsType<DueSoonDevice> = [
    {
      title: 'Thiết bị',
      dataIndex: ['deviceId', 'name'],
      key: 'deviceName',
      render: (text, record) => (
        <div>
          <div>{record.deviceId.name}</div>
          <Text type="secondary">{record.deviceId.code}</Text>
        </div>
      ),
    },
    {
      title: 'Người mượn',
      dataIndex: ['userId', 'fullName'],
      key: 'userName',
      render: (text, record) => (
        <div>
          <div>{record.userId.fullName}</div>
          <Text type="secondary">{record.userId.email}</Text>
        </div>
      ),
    },
    {
      title: 'Hạn trả',
      dataIndex: 'expectedReturnDate',
      key: 'expectedReturnDate',
      render: (date) => new Date(date).toLocaleDateString('vi-VN'),
    },
    {
      title: 'Còn lại',
      dataIndex: 'daysUntilDue',
      key: 'daysUntilDue',
      render: (days) => (
        <Tag color="orange">
          {days} ngày
        </Tag>
      ),
    },
  ];

  if (loading) {
    return (
      <div style={{ padding: 24, textAlign: 'center' }}>
        <Spin size="large" />
      </div>
    );
  }

  const deviceUtilizationRate = overviewStats 
    ? ((overviewStats.borrowedDevices / overviewStats.totalDevices) * 100).toFixed(1)
    : 0;

  const requestApprovalRate = overviewStats 
    ? ((overviewStats.approvedRequests / (overviewStats.approvedRequests + overviewStats.rejectedRequests)) * 100).toFixed(1)
    : 0;

  return (
    <div style={{ padding: 24 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <Title level={2}>Dashboard Admin</Title>
        <Button icon={<ReloadOutlined />} onClick={fetchData} loading={loading}>
          Làm mới
        </Button>
      </div>

      {/* Alert for urgent issues */}
      {(overdueDevices.length > 0 || dueSoonDevices.length > 0) && (
        <Alert
          message="Cảnh báo hệ thống"
          description={
            <div>
              {overdueDevices.length > 0 && (
                <div>• Có {overdueDevices.length} thiết bị quá hạn cần xử lý</div>
              )}
              {dueSoonDevices.length > 0 && (
                <div>• Có {dueSoonDevices.length} thiết bị sắp đến hạn trả</div>
              )}
            </div>
          }
          type="warning"
          showIcon
          style={{ marginBottom: 24 }}
          action={
            <Space>
              <Button size="small" type="primary" danger>
                Xem chi tiết
              </Button>
            </Space>
          }
        />
      )}

      {/* Overview Statistics */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col span={6}>
          <Card>
            <Statistic
              title="Tổng thiết bị"
              value={overviewStats?.totalDevices}
              valueStyle={{ color: '#1890ff' }}
              prefix={<SettingOutlined />}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="Đang mượn"
              value={overviewStats?.borrowedDevices}
              valueStyle={{ color: '#52c41a' }}
              prefix={<ClockCircleOutlined />}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="Tổng người dùng"
              value={overviewStats?.totalUsers}
              valueStyle={{ color: '#722ed1' }}
              prefix={<UserOutlined />}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="Yêu cầu chờ"
              value={overviewStats?.pendingRequests}
              valueStyle={{ color: '#faad14' }}
              prefix={<ExclamationCircleOutlined />}
            />
          </Card>
        </Col>
      </Row>

      {/* Device Status */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col span={6}>
          <Card>
            <Statistic
              title="Có sẵn"
              value={overviewStats?.availableDevices}
              valueStyle={{ color: '#52c41a' }}
              prefix={<CheckCircleOutlined />}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="Bảo trì"
              value={overviewStats?.maintenanceDevices}
              valueStyle={{ color: '#fa8c16' }}
              prefix={<WarningOutlined />}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="Hỏng"
              value={overviewStats?.brokenDevices}
              valueStyle={{ color: '#cf1322' }}
              prefix={<CloseCircleOutlined />}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="Quá hạn"
              value={overviewStats?.overdueRecords}
              valueStyle={{ color: '#cf1322' }}
              prefix={<ExclamationCircleOutlined />}
            />
          </Card>
        </Col>
      </Row>

      {/* Utilization Metrics */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col span={12}>
          <Card title="Tỷ lệ sử dụng thiết bị">
            <Progress
              percent={Number(deviceUtilizationRate)}
              status={Number(deviceUtilizationRate) > 80 ? 'exception' : 'active'}
              format={() => `${deviceUtilizationRate}%`}
            />
            <Text type="secondary">
              {overviewStats?.borrowedDevices} / {overviewStats?.totalDevices} thiết bị đang được sử dụng
            </Text>
          </Card>
        </Col>
        <Col span={12}>
          <Card title="Tỷ lệ duyệt yêu cầu">
            <Progress
              percent={Number(requestApprovalRate)}
              status="active"
              format={() => `${requestApprovalRate}%`}
            />
            <Text type="secondary">
              {overviewStats?.approvedRequests} / {(overviewStats?.approvedRequests || 0) + (overviewStats?.rejectedRequests || 0)} yêu cầu được duyệt
            </Text>
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]}>
        {/* Top Borrowed Devices */}
        <Col span={12}>
          <Card
            title={
              <Space>
                <TrophyOutlined />
                Thiết bị được mượn nhiều nhất
              </Space>
            }
          >
            <List
              itemLayout="horizontal"
              dataSource={topDevices}
              renderItem={(item, index) => (
                <List.Item>
                  <List.Item.Meta
                    avatar={
                      <Avatar 
                        style={{ 
                          backgroundColor: index < 3 ? '#faad14' : '#1890ff',
                          fontWeight: 'bold'
                        }}
                      >
                        {index + 1}
                      </Avatar>
                    }
                    title={item.name}
                    description={
                      <div>
                        <Text type="secondary">{item.code} • {item.category}</Text>
                        <br />
                        <Text strong>{item.borrowCount} lượt mượn</Text>
                      </div>
                    }
                  />
                </List.Item>
              )}
            />
          </Card>
        </Col>

        {/* Recent Activity Summary */}
        <Col span={12}>
          <Card title="Hoạt động gần đây">
            <Row gutter={[16, 16]}>
              <Col span={12}>
                <Statistic
                  title="Yêu cầu hôm nay"
                  value={overviewStats?.pendingRequests}
                  valueStyle={{ color: '#1890ff' }}
                />
              </Col>
              <Col span={12}>
                <Statistic
                  title="Trả hôm nay"
                  value={overviewStats?.returnedRecords}
                  valueStyle={{ color: '#52c41a' }}
                />
              </Col>
              <Col span={12}>
                <Statistic
                  title="Người dùng hoạt động"
                  value={overviewStats?.activeUsers}
                  valueStyle={{ color: '#722ed1' }}
                />
              </Col>
              <Col span={12}>
                <Statistic
                  title="Sắp đến hạn"
                  value={overviewStats?.dueSoonRecords}
                  valueStyle={{ color: '#fa8c16' }}
                />
              </Col>
            </Row>
          </Card>
        </Col>
      </Row>

      {/* Critical Issues Tables */}
      {overdueDevices.length > 0 && (
        <Card title={<Text style={{ color: '#cf1322' }}>Thiết bị quá hạn</Text>} style={{ marginTop: 16 }}>
          <Table
            columns={overdueColumns}
            dataSource={overdueDevices}
            rowKey="_id"
            pagination={{ pageSize: 5 }}
            size="small"
          />
        </Card>
      )}

      {dueSoonDevices.length > 0 && (
        <Card title={<Text style={{ color: '#fa8c16' }}>Thiết bị sắp đến hạn</Text>} style={{ marginTop: 16 }}>
          <Table
            columns={dueSoonColumns}
            dataSource={dueSoonDevices}
            rowKey="_id"
            pagination={{ pageSize: 5 }}
            size="small"
          />
        </Card>
      )}
    </div>
  );
};

export default Dashboard;
