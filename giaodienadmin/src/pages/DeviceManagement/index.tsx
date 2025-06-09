
import React, { useState, useEffect } from 'react';
import {
  Card,
  Table,
  Button,
  Space,
  Tag,
  Modal,
  Form,
  Input,
  Select,
  InputNumber,
  message,
  Popconfirm,
  Row,
  Col,
  Statistic,
  Typography,
} from 'antd';
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  EyeOutlined,
  ReloadOutlined,
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import {
  getDevices,
  createDevice,
  updateDevice,
  deleteDevice,
  getDeviceStatistics,
  Device,
  CreateDeviceRequest,
  UpdateDeviceRequest,
  DeviceStatistics,
} from '@/services/admin/device.service';

const { Title } = Typography;
const { Option } = Select;
const { Search } = Input;

const DeviceManagement: React.FC = () => {
  const [devices, setDevices] = useState<Device[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [detailModalVisible, setDetailModalVisible] = useState(false);
  const [editingDevice, setEditingDevice] = useState<Device | null>(null);
  const [selectedDevice, setSelectedDevice] = useState<Device | null>(null);
  const [statistics, setStatistics] = useState<DeviceStatistics | null>(null);
  const [form] = Form.useForm();
  const [searchKeyword, setSearchKeyword] = useState('');
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });

  // Fetch devices
  const fetchDevices = async () => {
    setLoading(true);
    try {
      const response = await getDevices({
        current: pagination.current,
        pageSize: pagination.pageSize,
        keyword: searchKeyword,
      });
      setDevices(response.data);
      setPagination({
        ...pagination,
        total: response.total,
      });
    } catch (error) {
      message.error('Không thể tải danh sách thiết bị');
    } finally {
      setLoading(false);
    }
  };

  // Fetch statistics
  const fetchStatistics = async () => {
    try {
      const stats = await getDeviceStatistics();
      setStatistics(stats);
    } catch (error) {
      console.error('Error fetching statistics:', error);
    }
  };

  useEffect(() => {
    fetchDevices();
    fetchStatistics();
  }, [pagination.current, pagination.pageSize, searchKeyword]);

  // Get status tag color
  const getStatusTag = (status: Device['status']) => {
    const statusConfig = {
      available: { color: 'green', text: 'Có sẵn' },
      borrowed: { color: 'blue', text: 'Đang mượn' },
      maintenance: { color: 'orange', text: 'Bảo trì' },
      broken: { color: 'red', text: 'Hỏng' },
      lost: { color: 'red', text: 'Mất' },
    };
    const config = statusConfig[status] || { color: 'default', text: status };
    return <Tag color={config.color}>{config.text}</Tag>;
  };

  // Table columns
  const columns: ColumnsType<Device> = [
    {
      title: 'Tên thiết bị',
      dataIndex: 'name',
      key: 'name',
      render: (text, record) => (
        <Space>
          {record.imageUrl && (
            <img 
              src={record.imageUrl} 
              alt={text} 
              style={{ width: 40, height: 40, objectFit: 'cover', borderRadius: 4 }}
            />
          )}
          <span>{text}</span>
        </Space>
      ),
    },
    {
      title: 'Mã số',
      dataIndex: 'serialNumber',
      key: 'serialNumber',
    },
    {
      title: 'Danh mục',
      dataIndex: 'category',
      key: 'category',
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      render: (status) => getStatusTag(status),
    },
    {
      title: 'Số lượng',
      dataIndex: 'quantity',
      key: 'quantity',
    },
    {
      title: 'Vị trí',
      dataIndex: 'location',
      key: 'location',
    },
    {
      title: 'Hành động',
      key: 'actions',
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
            type="primary"
            size="small"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
          >
            Sửa
          </Button>
          <Popconfirm
            title="Bạn có chắc chắn muốn xóa thiết bị này?"
            onConfirm={() => handleDelete(record.id)}
            okText="Xóa"
            cancelText="Hủy"
          >
            <Button
              danger
              size="small"
              icon={<DeleteOutlined />}
            >
              Xóa
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  // Handle functions
  const handleViewDetail = (device: Device) => {
    setSelectedDevice(device);
    setDetailModalVisible(true);
  };

  const handleEdit = (device: Device) => {
    setEditingDevice(device);
    form.setFieldsValue(device);
    setModalVisible(true);
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteDevice(id);
      message.success('Xóa thiết bị thành công');
      fetchDevices();
      fetchStatistics();
    } catch (error) {
      message.error('Không thể xóa thiết bị');
    }
  };

  const handleSubmit = async (values: CreateDeviceRequest | UpdateDeviceRequest) => {
    try {
      if (editingDevice) {
        await updateDevice(editingDevice.id, values);
        message.success('Cập nhật thiết bị thành công');
      } else {
        await createDevice(values as CreateDeviceRequest);
        message.success('Thêm thiết bị thành công');
      }
      setModalVisible(false);
      setEditingDevice(null);
      form.resetFields();
      fetchDevices();
      fetchStatistics();
    } catch (error) {
      message.error(editingDevice ? 'Không thể cập nhật thiết bị' : 'Không thể thêm thiết bị');
    }
  };

  const handleAddNew = () => {
    setEditingDevice(null);
    form.resetFields();
    setModalVisible(true);
  };

  const handleTableChange = (newPagination: any) => {
    setPagination({
      ...pagination,
      current: newPagination.current,
      pageSize: newPagination.pageSize,
    });
  };

  return (
    <div style={{ padding: 24 }}>
      <Title level={2}>Quản lý thiết bị</Title>
      
      {/* Statistics Cards */}
      {statistics && (
        <Row gutter={16} style={{ marginBottom: 24 }}>
          <Col span={4}>
            <Card>
              <Statistic title="Tổng số thiết bị" value={statistics.total} />
            </Card>
          </Col>
          <Col span={4}>
            <Card>
              <Statistic title="Có sẵn" value={statistics.available} valueStyle={{ color: '#3f8600' }} />
            </Card>
          </Col>
          <Col span={4}>
            <Card>
              <Statistic title="Đang mượn" value={statistics.borrowed} valueStyle={{ color: '#1890ff' }} />
            </Card>
          </Col>
          <Col span={4}>
            <Card>
              <Statistic title="Bảo trì" value={statistics.maintenance} valueStyle={{ color: '#fa8c16' }} />
            </Card>
          </Col>
          <Col span={4}>
            <Card>
              <Statistic title="Hỏng" value={statistics.broken} valueStyle={{ color: '#cf1322' }} />
            </Card>
          </Col>
          <Col span={4}>
            <Card>
              <Statistic title="Mất" value={statistics.lost} valueStyle={{ color: '#cf1322' }} />
            </Card>
          </Col>
        </Row>
      )}

      <Card>
        {/* Header with search and add button */}
        <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between' }}>
          <Space>
            <Search
              placeholder="Tìm kiếm thiết bị..."
              allowClear
              style={{ width: 300 }}
              onSearch={setSearchKeyword}
            />
            <Button
              icon={<ReloadOutlined />}
              onClick={() => {
                fetchDevices();
                fetchStatistics();
              }}
            >
              Làm mới
            </Button>
          </Space>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={handleAddNew}
          >
            Thêm thiết bị
          </Button>
        </div>

        {/* Table */}
        <Table
          columns={columns}
          dataSource={devices}
          rowKey="id"
          loading={loading}
          pagination={{
            current: pagination.current,
            pageSize: pagination.pageSize,
            total: pagination.total,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) => `${range[0]}-${range[1]} của ${total} thiết bị`,
          }}
          onChange={handleTableChange}
        />
      </Card>

      {/* Add/Edit Modal */}
      <Modal
        title={editingDevice ? 'Sửa thiết bị' : 'Thêm thiết bị mới'}
        open={modalVisible}
        onCancel={() => {
          setModalVisible(false);
          setEditingDevice(null);
          form.resetFields();
        }}
        footer={null}
        width={600}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
        >
          <Form.Item
            name="name"
            label="Tên thiết bị"
            rules={[{ required: true, message: 'Vui lòng nhập tên thiết bị' }]}
          >
            <Input placeholder="Nhập tên thiết bị" />
          </Form.Item>
          
          <Form.Item
            name="serialNumber"
            label="Mã số"
            rules={[{ required: true, message: 'Vui lòng nhập mã số' }]}
          >
            <Input placeholder="Nhập mã số thiết bị" />
          </Form.Item>
          
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="category"
                label="Danh mục"
                rules={[{ required: true, message: 'Vui lòng chọn danh mục' }]}
              >
                <Select placeholder="Chọn danh mục">
                  <Option value="Laptop">Laptop</Option>
                  <Option value="Camera">Camera</Option>
                  <Option value="Projector">Máy chiếu</Option>
                  <Option value="Microphone">Microphone</Option>
                  <Option value="Monitor">Màn hình</Option>
                  <Option value="Other">Khác</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="quantity"
                label="Số lượng"
                rules={[{ required: true, message: 'Vui lòng nhập số lượng' }]}
              >
                <InputNumber min={0} style={{ width: '100%' }} placeholder="Nhập số lượng" />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            name="location"
            label="Vị trí"
            rules={[{ required: true, message: 'Vui lòng nhập vị trí' }]}
          >
            <Input placeholder="Nhập vị trí thiết bị" />
          </Form.Item>

          {editingDevice && (
            <Form.Item
              name="status"
              label="Trạng thái"
              rules={[{ required: true, message: 'Vui lòng chọn trạng thái' }]}
            >
              <Select placeholder="Chọn trạng thái">
                <Option value="available">Có sẵn</Option>
                <Option value="borrowed">Đang mượn</Option>
                <Option value="maintenance">Bảo trì</Option>
                <Option value="broken">Hỏng</Option>
                <Option value="lost">Mất</Option>
              </Select>
            </Form.Item>
          )}

          <Form.Item
            name="imageUrl"
            label="URL hình ảnh"
          >
            <Input placeholder="Nhập URL hình ảnh (không bắt buộc)" />
          </Form.Item>

          <Form.Item
            name="description"
            label="Mô tả"
          >
            <Input.TextArea rows={3} placeholder="Nhập mô tả thiết bị (không bắt buộc)" />
          </Form.Item>

          <Form.Item style={{ textAlign: 'right', marginBottom: 0 }}>
            <Space>
              <Button onClick={() => {
                setModalVisible(false);
                setEditingDevice(null);
                form.resetFields();
              }}>
                Hủy
              </Button>
              <Button type="primary" htmlType="submit">
                {editingDevice ? 'Cập nhật' : 'Thêm mới'}
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>

      {/* Detail Modal */}
      <Modal
        title="Chi tiết thiết bị"
        open={detailModalVisible}
        onCancel={() => setDetailModalVisible(false)}
        footer={[
          <Button key="close" onClick={() => setDetailModalVisible(false)}>
            Đóng
          </Button>
        ]}
        width={600}
      >
        {selectedDevice && (
          <div>
            {selectedDevice.imageUrl && (
              <div style={{ textAlign: 'center', marginBottom: 16 }}>
                <img 
                  src={selectedDevice.imageUrl} 
                  alt={selectedDevice.name}
                  style={{ maxWidth: '100%', maxHeight: 200, objectFit: 'cover' }}
                />
              </div>
            )}
            <Row gutter={16}>
              <Col span={12}>
                <p><strong>Tên thiết bị:</strong> {selectedDevice.name}</p>
                <p><strong>Mã số:</strong> {selectedDevice.serialNumber}</p>
                <p><strong>Danh mục:</strong> {selectedDevice.category}</p>
                <p><strong>Trạng thái:</strong> {getStatusTag(selectedDevice.status)}</p>
              </Col>
              <Col span={12}>
                <p><strong>Số lượng:</strong> {selectedDevice.quantity}</p>
                <p><strong>Vị trí:</strong> {selectedDevice.location}</p>
                <p><strong>Ngày tạo:</strong> {new Date(selectedDevice.createdAt).toLocaleDateString('vi-VN')}</p>
                <p><strong>Cập nhật:</strong> {new Date(selectedDevice.updatedAt).toLocaleDateString('vi-VN')}</p>
              </Col>
            </Row>
            {selectedDevice.description && (
              <div>
                <p><strong>Mô tả:</strong></p>
                <p>{selectedDevice.description}</p>
              </div>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
};

export default DeviceManagement;
