
import React, { useState, useEffect } from 'react';
import {
  Card,
  Table,
  Button,
  Space,
  Tag,
  Modal,
  message,
  Popconfirm,
  Row,
  Col,
  Statistic,
  Typography,
  Input,
  DatePicker,
  Descriptions,
  Image,
  Alert,
  List,
} from 'antd';
import {
  EyeOutlined,
  ReloadOutlined,
  UndoOutlined,
  MailOutlined,
  ExclamationCircleOutlined,
  WarningOutlined,
  UserOutlined,
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import {
  getOverdueBorrowRecords,
  getBorrowRecordById,
  confirmReturnDevice,
  sendReminderEmail,
  BorrowRecord,
  BorrowRecordParams,
} from '@/services/admin/borrow-record.service';

const { Title, Text } = Typography;
const { Search } = Input;
const { RangePicker } = DatePicker;

const OverdueBorrowRecords: React.FC = () => {
  const [records, setRecords] = useState<BorrowRecord[]>([]);
  const [loading, setLoading] = useState(false);
  const [detailModalVisible, setDetailModalVisible] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<BorrowRecord | null>(null);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [dateRange, setDateRange] = useState<any[]>([]);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });

  // Fetch overdue records
  const fetchRecords = async () => {
    setLoading(true);
    try {
      const params: BorrowRecordParams = {
        current: pagination.current,
        pageSize: pagination.pageSize,
        keyword: searchKeyword,
        overdue: true,
      };

      if (dateRange && dateRange.length === 2) {
        params.startDate = dateRange[0].format('YYYY-MM-DD');
        params.endDate = dateRange[1].format('YYYY-MM-DD');
      }

      const response = await getOverdueBorrowRecords(params);
      setRecords(response.data);
      setPagination({
        ...pagination,
        total: response.total,
      });
    } catch (error) {
      message.error('Không thể tải danh sách thiết bị quá hạn');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecords();
  }, [pagination.current, pagination.pageSize, searchKeyword, dateRange]);

  // Calculate overdue days
  const getOverdueDays = (returnDate: string) => {
    const today = new Date();
    const dueDate = new Date(returnDate);
    return Math.ceil((today.getTime() - dueDate.getTime()) / (1000 * 3600 * 24));
  };

  // Get severity level
  const getSeverityLevel = (overdueDays: number) => {
    if (overdueDays > 30) return { level: 'critical', color: '#cf1322', text: 'Nghiêm trọng' };
    if (overdueDays > 14) return { level: 'high', color: '#fa541c', text: 'Cao' };
    if (overdueDays > 7) return { level: 'medium', color: '#fa8c16', text: 'Trung bình' };
    return { level: 'low', color: '#faad14', text: 'Thấp' };
  };

  // Table columns
  const columns: ColumnsType<BorrowRecord> = [
    {
      title: 'Người mượn',
      dataIndex: ['user', 'name'],
      key: 'userName',
      render: (text, record) => (
        <div>
          <div style={{ fontWeight: 500 }}>{text}</div>
          <div style={{ fontSize: 12, color: '#666' }}>
            {record.user.studentId || record.user.email}
          </div>
          <div style={{ fontSize: 12, color: '#666' }}>
            {record.user.phone || 'Chưa có SĐT'}
          </div>
        </div>
      ),
    },
    {
      title: 'Thiết bị',
      dataIndex: ['device', 'name'],
      key: 'deviceName',
      render: (text, record) => (
        <Space>
          {record.device.imageUrl && (
            <Image
              src={record.device.imageUrl}
              alt={text}
              width={40}
              height={40}
              style={{ objectFit: 'cover', borderRadius: 4 }}
            />
          )}
          <div>
            <div style={{ fontWeight: 500 }}>{text}</div>
            <div style={{ fontSize: 12, color: '#666' }}>
              {record.device.serialNumber}
            </div>
          </div>
        </Space>
      ),
    },
    {
      title: 'Ngày mượn',
      dataIndex: 'borrowDate',
      key: 'borrowDate',
      render: (date) => new Date(date).toLocaleDateString('vi-VN'),
      sorter: true,
    },
    {
      title: 'Ngày trả dự kiến',
      dataIndex: 'returnDate',
      key: 'returnDate',
      render: (date) => new Date(date).toLocaleDateString('vi-VN'),
      sorter: true,
    },
    {
      title: 'Số ngày quá hạn',
      dataIndex: 'returnDate',
      key: 'overdueDays',
      render: (returnDate) => {
        const overdueDays = getOverdueDays(returnDate);
        const severity = getSeverityLevel(overdueDays);
        return (
          <Tag color={severity.color} icon={<ExclamationCircleOutlined />}>
            {overdueDays} ngày ({severity.text})
          </Tag>
        );
      },
      sorter: (a, b) => getOverdueDays(a.returnDate) - getOverdueDays(b.returnDate),
    },
    {
      title: 'Mục đích',
      dataIndex: ['borrowRequest', 'purpose'],
      key: 'purpose',
      ellipsis: true,
    },
    {
      title: 'Hành động',
      key: 'actions',
      fixed: 'right',
      width: 280,
      render: (_, record) => (
        <Space>
          <Button
            type="primary"
            ghost
            size="small"
            icon={<EyeOutlined />}
            onClick={() => handleViewDetail(record)}
          >
            Xem
          </Button>
          
          <Button
            size="small"
            icon={<MailOutlined />}
            onClick={() => handleSendReminder(record._id)}
          >
            Nhắc nhở
          </Button>
          
          <Popconfirm
            title="Xác nhận trả thiết bị?"
            description="Bạn có chắc chắn thiết bị đã được trả?"
            onConfirm={() => handleConfirmReturn(record._id)}
            okText="Xác nhận"
            cancelText="Hủy"
          >
            <Button
              type="primary"
              size="small"
              icon={<UndoOutlined />}
              style={{ backgroundColor: '#52c41a', borderColor: '#52c41a' }}
            >
              Xác nhận trả
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  // Handle functions
  const handleViewDetail = async (record: BorrowRecord) => {
    try {
      const detailRecord = await getBorrowRecordById(record._id);
      setSelectedRecord(detailRecord);
      setDetailModalVisible(true);
    } catch (error) {
      message.error('Không thể tải chi tiết bản ghi');
    }
  };

  const handleConfirmReturn = async (id: string) => {
    try {
      await confirmReturnDevice(id);
      message.success('Đã xác nhận trả thiết bị thành công');
      fetchRecords();
    } catch (error) {
      message.error('Không thể xác nhận trả thiết bị');
    }
  };

  const handleSendReminder = async (id: string) => {
    try {
      await sendReminderEmail(id);
      message.success('Đã gửi email nhắc nhở thành công');
    } catch (error) {
      message.error('Không thể gửi email nhắc nhở');
    }
  };

  const handleBulkReminder = async () => {
    try {
      const reminderPromises = records.map(record => sendReminderEmail(record._id));
      await Promise.all(reminderPromises);
      message.success(`Đã gửi ${records.length} email nhắc nhở`);
    } catch (error) {
      message.error('Có lỗi khi gửi email nhắc nhở');
    }
  };

  const handleTableChange = (newPagination: any, filters: any, sorter: any) => {
    setPagination({
      ...pagination,
      current: newPagination.current,
      pageSize: newPagination.pageSize,
    });
  };

  // Calculate statistics
  const criticalCount = records.filter(r => getOverdueDays(r.returnDate) > 30).length;
  const highCount = records.filter(r => {
    const days = getOverdueDays(r.returnDate);
    return days > 14 && days <= 30;
  }).length;
  const mediumCount = records.filter(r => {
    const days = getOverdueDays(r.returnDate);
    return days > 7 && days <= 14;
  }).length;
  const lowCount = records.filter(r => {
    const days = getOverdueDays(r.returnDate);
    return days > 0 && days <= 7;
  }).length;

  return (
    <div style={{ padding: 24 }}>
      <Title level={2}>Thiết bị quá hạn</Title>
      
      {/* Alert */}
      <Alert
        message="Cảnh báo"
        description="Danh sách các thiết bị đang quá hạn trả. Vui lòng liên hệ người mượn để thu hồi thiết bị."
        type="error"
        showIcon
        style={{ marginBottom: 16 }}
        action={
          <Button size="small" danger onClick={handleBulkReminder}>
            Gửi nhắc nhở tất cả
          </Button>
        }
      />

      {/* Statistics */}
      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col span={6}>
          <Card>
            <Statistic 
              title="Nghiêm trọng (>30 ngày)" 
              value={criticalCount} 
              valueStyle={{ color: '#cf1322' }}
              prefix={<ExclamationCircleOutlined />}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic 
              title="Cao (15-30 ngày)" 
              value={highCount}
              valueStyle={{ color: '#fa541c' }}
              prefix={<WarningOutlined />}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic 
              title="Trung bình (8-14 ngày)" 
              value={mediumCount}
              valueStyle={{ color: '#fa8c16' }}
              prefix={<WarningOutlined />}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic 
              title="Thấp (1-7 ngày)" 
              value={lowCount}
              valueStyle={{ color: '#faad14' }}
              prefix={<WarningOutlined />}
            />
          </Card>
        </Col>
      </Row>

      <Card>
        {/* Filters */}
        <div style={{ marginBottom: 16 }}>
          <Row gutter={16}>
            <Col span={10}>
              <Search
                placeholder="Tìm kiếm theo tên người dùng, thiết bị..."
                allowClear
                onSearch={setSearchKeyword}
                style={{ width: '100%' }}
              />
            </Col>
            <Col span={10}>
              <RangePicker
                style={{ width: '100%' }}
                placeholder={['Từ ngày', 'Đến ngày']}
                onChange={setDateRange}
              />
            </Col>
            <Col span={4}>
              <Button
                icon={<ReloadOutlined />}
                onClick={fetchRecords}
                style={{ width: '100%' }}
              >
                Làm mới
              </Button>
            </Col>
          </Row>
        </div>

        {/* Table */}
        <Table
          columns={columns}
          dataSource={records}
          rowKey="_id"
          loading={loading}
          pagination={{
            current: pagination.current,
            pageSize: pagination.pageSize,
            total: pagination.total,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) => `${range[0]}-${range[1]} của ${total} thiết bị quá hạn`,
          }}
          onChange={handleTableChange}
          scroll={{ x: 1400 }}
          rowClassName={(record) => {
            const overdueDays = getOverdueDays(record.returnDate);
            if (overdueDays > 30) return 'critical-overdue';
            if (overdueDays > 14) return 'high-overdue';
            if (overdueDays > 7) return 'medium-overdue';
            return 'low-overdue';
          }}
        />
      </Card>

      {/* Detail Modal */}
      <Modal
        title="Chi tiết thiết bị quá hạn"
        open={detailModalVisible}
        onCancel={() => setDetailModalVisible(false)}
        footer={[
          <Button key="close" onClick={() => setDetailModalVisible(false)}>
            Đóng
          </Button>,
          selectedRecord && (
            <Space key="actions">
              <Button
                icon={<MailOutlined />}
                onClick={() => {
                  handleSendReminder(selectedRecord._id);
                  setDetailModalVisible(false);
                }}
              >
                Gửi nhắc nhở
              </Button>
              <Popconfirm
                title="Xác nhận trả thiết bị?"
                onConfirm={() => {
                  handleConfirmReturn(selectedRecord._id);
                  setDetailModalVisible(false);
                }}
                okText="Xác nhận"
                cancelText="Hủy"
              >
                <Button type="primary" icon={<UndoOutlined />}>
                  Xác nhận trả
                </Button>
              </Popconfirm>
            </Space>
          ),
        ]}
        width={800}
      >
        {selectedRecord && (
          <div>
            <Alert
              message={`Quá hạn ${getOverdueDays(selectedRecord.returnDate)} ngày`}
              type="error"
              showIcon
              style={{ marginBottom: 16 }}
            />
            
            <Descriptions title="Thông tin bản ghi" bordered column={2}>
              <Descriptions.Item label="Người mượn">
                {selectedRecord.user.name}
              </Descriptions.Item>
              <Descriptions.Item label="Email">
                {selectedRecord.user.email}
              </Descriptions.Item>
              
              <Descriptions.Item label="Số điện thoại">
                {selectedRecord.user.phone || 'Chưa có'}
              </Descriptions.Item>
              <Descriptions.Item label="Mã sinh viên">
                {selectedRecord.user.studentId || 'Chưa có'}
              </Descriptions.Item>

              <Descriptions.Item label="Thiết bị" span={2}>
                <Space>
                  {selectedRecord.device.imageUrl && (
                    <Image
                      src={selectedRecord.device.imageUrl}
                      alt={selectedRecord.device.name}
                      width={60}
                      height={60}
                      style={{ objectFit: 'cover', borderRadius: 4 }}
                    />
                  )}
                  <div>
                    <div style={{ fontWeight: 500 }}>{selectedRecord.device.name}</div>
                    <div style={{ color: '#666' }}>Mã: {selectedRecord.device.serialNumber}</div>
                    <div style={{ color: '#666' }}>Loại: {selectedRecord.device.category}</div>
                  </div>
                </Space>
              </Descriptions.Item>

              <Descriptions.Item label="Ngày mượn">
                {new Date(selectedRecord.borrowDate).toLocaleDateString('vi-VN')}
              </Descriptions.Item>
              <Descriptions.Item label="Ngày trả dự kiến">
                {new Date(selectedRecord.returnDate).toLocaleDateString('vi-VN')}
              </Descriptions.Item>

              <Descriptions.Item label="Mục đích" span={2}>
                {selectedRecord.borrowRequest.purpose}
              </Descriptions.Item>

              {selectedRecord.note && (
                <Descriptions.Item label="Ghi chú" span={2}>
                  {selectedRecord.note}
                </Descriptions.Item>
              )}
            </Descriptions>
          </div>
        )}
      </Modal>

      <style jsx>{`
        .critical-overdue {
          background-color: #fff1f0 !important;
        }
        .critical-overdue:hover {
          background-color: #ffe7e6 !important;
        }
        .high-overdue {
          background-color: #fff7e6 !important;
        }
        .high-overdue:hover {
          background-color: #ffeee6 !important;
        }
        .medium-overdue {
          background-color: #fffbe6 !important;
        }
        .medium-overdue:hover {
          background-color: #fff8e6 !important;
        }
        .low-overdue {
          background-color: #feffe6 !important;
        }
        .low-overdue:hover {
          background-color: #fefce6 !important;
        }
      `}</style>
    </div>
  );
};

export default OverdueBorrowRecords;
