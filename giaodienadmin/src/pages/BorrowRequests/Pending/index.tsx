
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
  Select,
  Descriptions,
  Image,
} from 'antd';
import {
  CheckOutlined,
  CloseOutlined,
  EyeOutlined,
  ReloadOutlined,
  SearchOutlined,
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import {
  getAllBorrowRequests,
  getBorrowRequestById,
  approveRequest,
  rejectRequest,
  BorrowRequest,
  BorrowRequestParams,
} from '@/services/admin/borrow-request.service';

const { Title } = Typography;
const { Search } = Input;
const { RangePicker } = DatePicker;
const { Option } = Select;

const PendingBorrowRequests: React.FC = () => {
  const [requests, setRequests] = useState<BorrowRequest[]>([]);
  const [loading, setLoading] = useState(false);
  const [detailModalVisible, setDetailModalVisible] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<BorrowRequest | null>(null);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [dateRange, setDateRange] = useState<any[]>([]);
  const [deviceFilter, setDeviceFilter] = useState<string>('');
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });

  // Fetch pending requests
  const fetchRequests = async () => {
    setLoading(true);
    try {
      const params: BorrowRequestParams = {
        current: pagination.current,
        pageSize: pagination.pageSize,
        status: 'pending',
        keyword: searchKeyword,
      };

      if (dateRange && dateRange.length === 2) {
        params.startDate = dateRange[0].format('YYYY-MM-DD');
        params.endDate = dateRange[1].format('YYYY-MM-DD');
      }

      if (deviceFilter) {
        params.deviceId = deviceFilter;
      }

      const response = await getAllBorrowRequests(params);
      setRequests(response.data);
      setPagination({
        ...pagination,
        total: response.total,
      });
    } catch (error) {
      message.error('Không thể tải danh sách yêu cầu mượn');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, [pagination.current, pagination.pageSize, searchKeyword, dateRange, deviceFilter]);

  // Get status tag
  const getStatusTag = (status: BorrowRequest['status']) => {
    const statusConfig = {
      pending: { color: 'orange', text: 'Chờ duyệt' },
      approved: { color: 'green', text: 'Đã duyệt' },
      rejected: { color: 'red', text: 'Từ chối' },
      cancelled: { color: 'gray', text: 'Đã hủy' },
    };
    const config = statusConfig[status] || { color: 'default', text: status };
    return <Tag color={config.color}>{config.text}</Tag>;
  };

  // Get priority tag based on borrow date
  const getPriorityTag = (borrowDate: string) => {
    const today = new Date();
    const borrow = new Date(borrowDate);
    const diffDays = Math.ceil((borrow.getTime() - today.getTime()) / (1000 * 3600 * 24));
    
    if (diffDays <= 1) {
      return <Tag color="red">Khẩn cấp</Tag>;
    } else if (diffDays <= 3) {
      return <Tag color="orange">Ưu tiên</Tag>;
    }
    return <Tag color="blue">Bình thường</Tag>;
  };

  // Table columns
  const columns: ColumnsType<BorrowRequest> = [
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
      title: 'Ngày trả',
      dataIndex: 'returnDate',
      key: 'returnDate',
      render: (date) => new Date(date).toLocaleDateString('vi-VN'),
    },
    {
      title: 'Ưu tiên',
      dataIndex: 'borrowDate',
      key: 'priority',
      render: (borrowDate) => getPriorityTag(borrowDate),
    },
    {
      title: 'Mục đích',
      dataIndex: 'purpose',
      key: 'purpose',
      ellipsis: true,
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      render: (status) => getStatusTag(status),
    },
    {
      title: 'Ngày tạo',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (date) => new Date(date).toLocaleDateString('vi-VN'),
      sorter: true,
    },
    {
      title: 'Hành động',
      key: 'actions',
      fixed: 'right',
      width: 200,
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
          <Popconfirm
            title="Duyệt yêu cầu mượn này?"
            description="Bạn có chắc chắn muốn duyệt yêu cầu này?"
            onConfirm={() => handleApprove(record._id)}
            okText="Duyệt"
            cancelText="Hủy"
          >
            <Button
              type="primary"
              size="small"
              icon={<CheckOutlined />}
              style={{ backgroundColor: '#52c41a', borderColor: '#52c41a' }}
            >
              Duyệt
            </Button>
          </Popconfirm>
          <Popconfirm
            title="Từ chối yêu cầu mượn này?"
            description="Bạn có chắc chắn muốn từ chối yêu cầu này?"
            onConfirm={() => handleReject(record._id)}
            okText="Từ chối"
            cancelText="Hủy"
          >
            <Button
              danger
              size="small"
              icon={<CloseOutlined />}
            >
              Từ chối
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  // Handle functions
  const handleViewDetail = async (request: BorrowRequest) => {
    try {
      const detailRequest = await getBorrowRequestById(request._id);
      setSelectedRequest(detailRequest);
      setDetailModalVisible(true);
    } catch (error) {
      message.error('Không thể tải chi tiết yêu cầu');
    }
  };

  const handleApprove = async (id: string) => {
    try {
      await approveRequest(id);
      message.success('Đã duyệt yêu cầu mượn thành công');
      fetchRequests();
    } catch (error) {
      message.error('Không thể duyệt yêu cầu');
    }
  };

  const handleReject = async (id: string) => {
    try {
      await rejectRequest(id);
      message.success('Đã từ chối yêu cầu mượn');
      fetchRequests();
    } catch (error) {
      message.error('Không thể từ chối yêu cầu');
    }
  };

  const handleTableChange = (newPagination: any, filters: any, sorter: any) => {
    setPagination({
      ...pagination,
      current: newPagination.current,
      pageSize: newPagination.pageSize,
    });
  };

  return (
    <div style={{ padding: 24 }}>
      <Title level={2}>Yêu cầu mượn chờ duyệt</Title>
      
      {/* Statistics */}
      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col span={6}>
          <Card>
            <Statistic 
              title="Tổng yêu cầu chờ" 
              value={pagination.total} 
              valueStyle={{ color: '#fa8c16' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic 
              title="Khẩn cấp" 
              value={requests.filter(r => {
                const diffDays = Math.ceil((new Date(r.borrowDate).getTime() - new Date().getTime()) / (1000 * 3600 * 24));
                return diffDays <= 1;
              }).length}
              valueStyle={{ color: '#cf1322' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic 
              title="Ưu tiên" 
              value={requests.filter(r => {
                const diffDays = Math.ceil((new Date(r.borrowDate).getTime() - new Date().getTime()) / (1000 * 3600 * 24));
                return diffDays > 1 && diffDays <= 3;
              }).length}
              valueStyle={{ color: '#fa8c16' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic 
              title="Bình thường" 
              value={requests.filter(r => {
                const diffDays = Math.ceil((new Date(r.borrowDate).getTime() - new Date().getTime()) / (1000 * 3600 * 24));
                return diffDays > 3;
              }).length}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
      </Row>

      <Card>
        {/* Filters */}
        <div style={{ marginBottom: 16 }}>
          <Row gutter={16}>
            <Col span={8}>
              <Search
                placeholder="Tìm kiếm theo tên người dùng, thiết bị..."
                allowClear
                onSearch={setSearchKeyword}
                style={{ width: '100%' }}
              />
            </Col>
            <Col span={8}>
              <RangePicker
                style={{ width: '100%' }}
                placeholder={['Từ ngày', 'Đến ngày']}
                onChange={setDateRange}
              />
            </Col>
            <Col span={4}>
              <Select
                placeholder="Lọc theo thiết bị"
                allowClear
                style={{ width: '100%' }}
                onChange={setDeviceFilter}
              >
                {/* Có thể thêm danh sách thiết bị từ API */}
              </Select>
            </Col>
            <Col span={4}>
              <Button
                icon={<ReloadOutlined />}
                onClick={fetchRequests}
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
          dataSource={requests}
          rowKey="_id"
          loading={loading}
          pagination={{
            current: pagination.current,
            pageSize: pagination.pageSize,
            total: pagination.total,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) => `${range[0]}-${range[1]} của ${total} yêu cầu`,
          }}
          onChange={handleTableChange}
          scroll={{ x: 1200 }}
        />
      </Card>

      {/* Detail Modal */}
      <Modal
        title="Chi tiết yêu cầu mượn"
        open={detailModalVisible}
        onCancel={() => setDetailModalVisible(false)}
        footer={[
          <Button key="close" onClick={() => setDetailModalVisible(false)}>
            Đóng
          </Button>,
          selectedRequest && (
            <Space key="actions">
              <Popconfirm
                title="Duyệt yêu cầu này?"
                onConfirm={() => {
                  handleApprove(selectedRequest._id);
                  setDetailModalVisible(false);
                }}
                okText="Duyệt"
                cancelText="Hủy"
              >
                <Button type="primary" icon={<CheckOutlined />}>
                  Duyệt
                </Button>
              </Popconfirm>
              <Popconfirm
                title="Từ chối yêu cầu này?"
                onConfirm={() => {
                  handleReject(selectedRequest._id);
                  setDetailModalVisible(false);
                }}
                okText="Từ chối"
                cancelText="Hủy"
              >
                <Button danger icon={<CloseOutlined />}>
                  Từ chối
                </Button>
              </Popconfirm>
            </Space>
          ),
        ]}
        width={800}
      >
        {selectedRequest && (
          <div>
            <Descriptions title="Thông tin yêu cầu" bordered column={2}>
              <Descriptions.Item label="Trạng thái" span={2}>
                {getStatusTag(selectedRequest.status)}
                {getPriorityTag(selectedRequest.borrowDate)}
              </Descriptions.Item>
              
              <Descriptions.Item label="Người mượn">
                {selectedRequest.user.name}
              </Descriptions.Item>
              <Descriptions.Item label="Email">
                {selectedRequest.user.email}
              </Descriptions.Item>
              
              <Descriptions.Item label="Số điện thoại">
                {selectedRequest.user.phone || 'Chưa có'}
              </Descriptions.Item>
              <Descriptions.Item label="Mã sinh viên">
                {selectedRequest.user.studentId || 'Chưa có'}
              </Descriptions.Item>

              <Descriptions.Item label="Thiết bị" span={2}>
                <Space>
                  {selectedRequest.device.imageUrl && (
                    <Image
                      src={selectedRequest.device.imageUrl}
                      alt={selectedRequest.device.name}
                      width={60}
                      height={60}
                      style={{ objectFit: 'cover', borderRadius: 4 }}
                    />
                  )}
                  <div>
                    <div style={{ fontWeight: 500 }}>{selectedRequest.device.name}</div>
                    <div style={{ color: '#666' }}>Mã: {selectedRequest.device.serialNumber}</div>
                    <div style={{ color: '#666' }}>Loại: {selectedRequest.device.category}</div>
                  </div>
                </Space>
              </Descriptions.Item>

              <Descriptions.Item label="Ngày mượn">
                {new Date(selectedRequest.borrowDate).toLocaleDateString('vi-VN')}
              </Descriptions.Item>
              <Descriptions.Item label="Ngày trả">
                {new Date(selectedRequest.returnDate).toLocaleDateString('vi-VN')}
              </Descriptions.Item>

              <Descriptions.Item label="Mục đích" span={2}>
                {selectedRequest.purpose}
              </Descriptions.Item>

              {selectedRequest.note && (
                <Descriptions.Item label="Ghi chú" span={2}>
                  {selectedRequest.note}
                </Descriptions.Item>
              )}

              <Descriptions.Item label="Ngày tạo">
                {new Date(selectedRequest.createdAt).toLocaleString('vi-VN')}
              </Descriptions.Item>
              <Descriptions.Item label="Cập nhật lần cuối">
                {new Date(selectedRequest.updatedAt).toLocaleString('vi-VN')}
              </Descriptions.Item>
            </Descriptions>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default PendingBorrowRequests;
