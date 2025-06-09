
import React, { useState, useEffect } from 'react';
import {
  Card,
  Row,
  Col,
  DatePicker,
  Button,
  Table,
  Select,
  Space,
  Typography,
  Statistic,
  Tabs,
  List,
  Avatar,
  Tag,
  message,
  Export,
} from 'antd';
import {
  DownloadOutlined,
  FileExcelOutlined,
  FilePdfOutlined,
  BarChartOutlined,
  TrophyOutlined,
  ClockCircleOutlined,
  ExclamationCircleOutlined,
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import type { RangePickerProps } from 'antd/es/date-picker';
import { 
  getTopBorrowedDevices,
  getMonthlyStatistics,
  TopBorrowedDevice,
  MonthlyStatistics,
} from '@/services/admin/statistics.service';

const { Title, Text } = Typography;
const { RangePicker } = DatePicker;
const { Option } = Select;
const { TabPane } = Tabs;

interface ReportFilter {
  dateRange: [string, string] | null;
  reportType: string;
  deviceCategory?: string;
  status?: string;
}

const Reports: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState<ReportFilter>({
    dateRange: null,
    reportType: 'overview',
  });
  const [topDevices, setTopDevices] = useState<TopBorrowedDevice[]>([]);
  const [monthlyStats, setMonthlyStats] = useState<MonthlyStatistics[]>([]);

  const fetchReportData = async () => {
    setLoading(true);
    try {
      const [devices, monthly] = await Promise.all([
        getTopBorrowedDevices(20),
        getMonthlyStatistics(12),
      ]);
      
      setTopDevices(devices);
      setMonthlyStats(monthly);
    } catch (error) {
      message.error('Không thể tải dữ liệu báo cáo');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReportData();
  }, []);

  const handleDateRangeChange: RangePickerProps['onChange'] = (dates, dateStrings) => {
    setFilters(prev => ({
      ...prev,
      dateRange: dates ? [dateStrings[0], dateStrings[1]] : null,
    }));
  };

  const handleExport = (format: 'excel' | 'pdf') => {
    message.info(`Đang xuất báo cáo định dạng ${format.toUpperCase()}...`);
    // Implement export logic here
  };

  const topDevicesColumns: ColumnsType<TopBorrowedDevice> = [
    {
      title: 'Xếp hạng',
      key: 'rank',
      width: 80,
      render: (_, __, index) => (
        <Avatar 
          size="small" 
          style={{ 
            backgroundColor: index < 3 ? '#faad14' : '#1890ff',
            fontWeight: 'bold'
          }}
        >
          {index + 1}
        </Avatar>
      ),
    },
    {
      title: 'Tên thiết bị',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Mã thiết bị',
      dataIndex: 'code',
      key: 'code',
    },
    {
      title: 'Danh mục',
      dataIndex: 'category',
      key: 'category',
      render: (category) => <Tag color="blue">{category}</Tag>,
    },
    {
      title: 'Số lượt mượn',
      dataIndex: 'borrowCount',
      key: 'borrowCount',
      sorter: (a, b) => a.borrowCount - b.borrowCount,
      render: (count) => (
        <Statistic 
          value={count} 
          valueStyle={{ fontSize: '16px', fontWeight: 'bold' }}
        />
      ),
    },
  ];

  const monthlyStatsColumns: ColumnsType<MonthlyStatistics> = [
    {
      title: 'Tháng',
      dataIndex: 'month',
      key: 'month',
    },
    {
      title: 'Lượt mượn',
      dataIndex: 'borrowCount',
      key: 'borrowCount',
      render: (count) => <Text strong style={{ color: '#1890ff' }}>{count}</Text>,
    },
    {
      title: 'Lượt trả',
      dataIndex: 'returnCount',
      key: 'returnCount',
      render: (count) => <Text strong style={{ color: '#52c41a' }}>{count}</Text>,
    },
    {
      title: 'Thiết bị mới',
      dataIndex: 'newDevices',
      key: 'newDevices',
      render: (count) => <Text strong style={{ color: '#722ed1' }}>{count}</Text>,
    },
    {
      title: 'Người dùng mới',
      dataIndex: 'newUsers',
      key: 'newUsers',
      render: (count) => <Text strong style={{ color: '#fa8c16' }}>{count}</Text>,
    },
  ];

  return (
    <div style={{ padding: 24 }}>
      <Row justify="space-between" align="middle" style={{ marginBottom: 24 }}>
        <Col>
          <Title level={2}>Báo cáo & Thống kê</Title>
        </Col>
        <Col>
          <Space>
            <Button 
              icon={<FileExcelOutlined />} 
              onClick={() => handleExport('excel')}
              style={{ color: '#52c41a', borderColor: '#52c41a' }}
            >
              Xuất Excel
            </Button>
            <Button 
              icon={<FilePdfOutlined />} 
              onClick={() => handleExport('pdf')}
              type="primary"
              danger
            >
              Xuất PDF
            </Button>
          </Space>
        </Col>
      </Row>

      {/* Filters */}
      <Card style={{ marginBottom: 24 }}>
        <Row gutter={16} align="middle">
          <Col span={6}>
            <Text strong>Khoảng thời gian:</Text>
            <RangePicker
              style={{ width: '100%', marginTop: 8 }}
              onChange={handleDateRangeChange}
              placeholder={['Từ ngày', 'Đến ngày']}
            />
          </Col>
          <Col span={6}>
            <Text strong>Loại báo cáo:</Text>
            <Select
              style={{ width: '100%', marginTop: 8 }}
              value={filters.reportType}
              onChange={(value) => setFilters(prev => ({ ...prev, reportType: value }))}
            >
              <Option value="overview">Tổng quan</Option>
              <Option value="devices">Thiết bị</Option>
              <Option value="users">Người dùng</Option>
              <Option value="borrows">Mượn trả</Option>
            </Select>
          </Col>
          <Col span={6}>
            <Text strong>Danh mục thiết bị:</Text>
            <Select
              style={{ width: '100%', marginTop: 8 }}
              placeholder="Tất cả danh mục"
              allowClear
              onChange={(value) => setFilters(prev => ({ ...prev, deviceCategory: value }))}
            >
              <Option value="laptop">Laptop</Option>
              <Option value="projector">Máy chiếu</Option>
              <Option value="camera">Camera</Option>
              <Option value="audio">Thiết bị âm thanh</Option>
            </Select>
          </Col>
          <Col span={6}>
            <Button 
              type="primary" 
              icon={<BarChartOutlined />}
              onClick={fetchReportData}
              loading={loading}
              style={{ marginTop: 24 }}
            >
              Tạo báo cáo
            </Button>
          </Col>
        </Row>
      </Card>

      {/* Report Content */}
      <Tabs defaultActiveKey="overview">
        <TabPane 
          tab={
            <span>
              <BarChartOutlined />
              Tổng quan
            </span>
          } 
          key="overview"
        >
          <Row gutter={[16, 16]}>
            <Col span={24}>
              <Card title="Thống kê theo tháng" loading={loading}>
                <Table
                  columns={monthlyStatsColumns}
                  dataSource={monthlyStats}
                  rowKey="month"
                  pagination={false}
                  size="small"
                />
              </Card>
            </Col>
          </Row>
        </TabPane>

        <TabPane 
          tab={
            <span>
              <TrophyOutlined />
              Thiết bị phổ biến
            </span>
          } 
          key="popular-devices"
        >
          <Card title="Top thiết bị được mượn nhiều nhất" loading={loading}>
            <Table
              columns={topDevicesColumns}
              dataSource={topDevices}
              rowKey="_id"
              pagination={{ pageSize: 10 }}
            />
          </Card>
        </TabPane>

        <TabPane 
          tab={
            <span>
              <ClockCircleOutlined />
              Phân tích xu hướng
            </span>
          } 
          key="trends"
        >
          <Row gutter={[16, 16]}>
            <Col span={12}>
              <Card title="Xu hướng mượn thiết bị">
                <div style={{ height: 300, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Text type="secondary">Biểu đồ xu hướng sẽ được hiển thị ở đây</Text>
                </div>
              </Card>
            </Col>
            <Col span={12}>
              <Card title="Phân tích theo danh mục">
                <div style={{ height: 300, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Text type="secondary">Biểu đồ phân tích danh mục sẽ được hiển thị ở đây</Text>
                </div>
              </Card>
            </Col>
          </Row>
        </TabPane>

        <TabPane 
          tab={
            <span>
              <ExclamationCircleOutlined />
              Cảnh báo
            </span>
          } 
          key="alerts"
        >
          <Row gutter={[16, 16]}>
            <Col span={24}>
              <Card title="Cảnh báo hệ thống">
                <List
                  dataSource={[
                    {
                      type: 'warning',
                      title: 'Thiết bị sắp hết hạn bảo hành',
                      description: '5 thiết bị sẽ hết hạn bảo hành trong 30 ngày tới',
                      time: '2 giờ trước',
                    },
                    {
                      type: 'error',
                      title: 'Thiết bị quá hạn',
                      description: '3 thiết bị đang quá hạn trả và cần xử lý ngay',
                      time: '1 ngày trước',
                    },
                    {
                      type: 'info',
                      title: 'Tỷ lệ sử dụng cao',
                      description: 'Tỷ lệ sử dụng thiết bị đạt 85%, cần xem xét mua thêm',
                      time: '3 ngày trước',
                    },
                  ]}
                  renderItem={(item) => (
                    <List.Item>
                      <List.Item.Meta
                        avatar={
                          <Avatar 
                            style={{ 
                              backgroundColor: 
                                item.type === 'error' ? '#cf1322' :
                                item.type === 'warning' ? '#fa8c16' : '#1890ff'
                            }}
                            icon={<ExclamationCircleOutlined />}
                          />
                        }
                        title={item.title}
                        description={
                          <div>
                            <div>{item.description}</div>
                            <Text type="secondary">{item.time}</Text>
                          </div>
                        }
                      />
                    </List.Item>
                  )}
                />
              </Card>
            </Col>
          </Row>
        </TabPane>
      </Tabs>
    </div>
  );
};

export default Reports;
