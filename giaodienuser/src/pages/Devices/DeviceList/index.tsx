import { PageContainer } from '@ant-design/pro-components';
import { Button, Card, DatePicker, Descriptions, Form, Input, Modal, Table, Tag, message } from 'antd';
import React, { useEffect, useState } from 'react';
import { getDevices, Device, DeviceListResponse, getDeviceById } from '@/services/device.service';
import { createBorrowRequest } from '@/services/borrow-request.service';
import dayjs from 'dayjs';

const { RangePicker } = DatePicker;

const DeviceList: React.FC = () => {
  const [devices, setDevices] = useState<Device[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDevice, setSelectedDevice] = useState<Device | null>(null);
  const [borrowModalVisible, setBorrowModalVisible] = useState(false);
  const [detailModalVisible, setDetailModalVisible] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });
  const [form] = Form.useForm();

  const fetchDevices = async (params: any = {}) => {
    try {
      setLoading(true);
      const response: DeviceListResponse = await getDevices({
        current: params.current || pagination.current,
        pageSize: params.pageSize || pagination.pageSize,
        keyword: params.keyword,
      });

      setDevices(response.data);
      setPagination({
        current: response.current,
        pageSize: response.pageSize,
        total: response.total,
      });
    } catch (error) {
      console.error('Error fetching devices:', error);
      message.error('Không thể tải danh sách thiết bị');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDevices();
  }, []);

  const handleTableChange = (pagination: any) => {
    fetchDevices({
      current: pagination.current,
      pageSize: pagination.pageSize,
    });
  };

  const handleViewDetail = async (device: Device) => {
    try {
      const deviceDetail = await getDeviceById(device.id);
      setSelectedDevice(deviceDetail);
      setDetailModalVisible(true);
    } catch (error) {
      console.error('Error fetching device detail:', error);
      message.error('Không thể tải thông tin chi tiết thiết bị');
    }
  };

  const handleBorrow = (device: Device) => {
    setSelectedDevice(device);
    setBorrowModalVisible(true);
    form.setFieldsValue({
      device: device.name,
      serialNumber: device.serialNumber,
      category: device.category,
    });
  };

  const handleBorrowSubmit = async (values: any) => {
    if (!selectedDevice) return;

    try {
      setSubmitting(true);
      const [borrowDate, returnDate] = values.dateRange;

      // Validate dates
      if (borrowDate.isAfter(returnDate)) {
        message.error('Ngày trả phải sau ngày mượn');
        return;
      }

      // Validate borrow duration (max 7 days)
      const duration = returnDate.diff(borrowDate, 'day');
      if (duration > 7) {
        message.error('Thời gian mượn không được quá 7 ngày');
        return;
      }

      await createBorrowRequest({
        deviceId: selectedDevice.id,
        borrowDate: borrowDate.format('YYYY-MM-DD'),
        returnDate: returnDate.format('YYYY-MM-DD'),
        purpose: values.purpose,
      });

      message.success('Gửi yêu cầu mượn thành công');
      setBorrowModalVisible(false);
      form.resetFields();
      fetchDevices(); // Refresh device list
    } catch (error: any) {
      message.error(error.message || 'Không thể gửi yêu cầu mượn');
    } finally {
      setSubmitting(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available':
        return 'success';
      case 'borrowed':
        return 'error';
      case 'maintenance':
        return 'warning';
      case 'broken':
        return 'default';
      default:
        return 'default';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'available':
        return 'Có sẵn';
      case 'borrowed':
        return 'Đang mượn';
      case 'maintenance':
        return 'Bảo trì';
      case 'broken':
        return 'Hỏng';
      default:
        return status;
    }
  };

  const columns = [
    {
      title: 'Tên thiết bị',
      dataIndex: 'name',
      key: 'name',
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
      title: 'Tình trạng',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => (
        <Tag color={getStatusColor(status)}>{getStatusText(status)}</Tag>
      ),
    },
    {
      title: 'Vị trí',
      dataIndex: 'location',
      key: 'location',
    },
    {
      title: 'Thao tác',
      key: 'action',
      render: (_: any, record: Device) => (
        <>
          <Button
            type="link"
            onClick={() => handleViewDetail(record)}
            style={{ marginRight: 8 }}
          >
            Chi tiết
          </Button>
          <Button
            type="primary"
            onClick={() => handleBorrow(record)}
            disabled={record.status !== 'available'}
          >
            Mượn
          </Button>
        </>
      ),
    },
  ];

  return (
    <PageContainer>
      <Card>
        <Table
          columns={columns}
          dataSource={devices}
          loading={loading}
          rowKey="id"
          pagination={pagination}
          onChange={handleTableChange}
        />
      </Card>

      {/* Detail Modal */}
      <Modal
        title="Chi tiết thiết bị"
        open={detailModalVisible}
        onCancel={() => setDetailModalVisible(false)}
        footer={null}
        width={700}
      >
        {selectedDevice && (
          <Descriptions bordered column={2}>
            <Descriptions.Item label="Tên thiết bị" span={2}>
              {selectedDevice.name}
            </Descriptions.Item>
            <Descriptions.Item label="Mã số">
              {selectedDevice.serialNumber}
            </Descriptions.Item>
            <Descriptions.Item label="Danh mục">
              {selectedDevice.category}
            </Descriptions.Item>
            <Descriptions.Item label="Tình trạng">
              <Tag color={getStatusColor(selectedDevice.status)}>
                {getStatusText(selectedDevice.status)}
              </Tag>
            </Descriptions.Item>
            <Descriptions.Item label="Vị trí">
              {selectedDevice.location}
            </Descriptions.Item>
            <Descriptions.Item label="Mô tả" span={2}>
              {selectedDevice.description || 'Không có mô tả'}
            </Descriptions.Item>
            <Descriptions.Item label="Ngày tạo">
              {dayjs(selectedDevice.createdAt).format('DD/MM/YYYY HH:mm')}
            </Descriptions.Item>
            <Descriptions.Item label="Cập nhật lần cuối">
              {dayjs(selectedDevice.updatedAt).format('DD/MM/YYYY HH:mm')}
            </Descriptions.Item>
          </Descriptions>
        )}
      </Modal>

      {/* Borrow Modal */}
      <Modal
        title="Gửi yêu cầu mượn thiết bị"
        open={borrowModalVisible}
        onCancel={() => {
          setBorrowModalVisible(false);
          form.resetFields();
        }}
        footer={null}
        destroyOnClose
      >
        <Form form={form} onFinish={handleBorrowSubmit} layout="vertical">
          <Form.Item
            label="Thiết bị"
            name="device"
          >
            <Input disabled />
          </Form.Item>

          <Form.Item
            label="Mã số"
            name="serialNumber"
          >
            <Input disabled />
          </Form.Item>

          <Form.Item
            label="Danh mục"
            name="category"
          >
            <Input disabled />
          </Form.Item>

          <Form.Item
            label="Thời gian mượn"
            name="dateRange"
            rules={[
              {
                required: true,
                message: 'Vui lòng chọn thời gian mượn',
              },
            ]}
          >
            <RangePicker
              style={{ width: '100%' }}
              disabledDate={(current) => {
                return current && current < dayjs().startOf('day');
              }}
            />
          </Form.Item>

          <Form.Item
            label="Mục đích sử dụng"
            name="purpose"
            rules={[
              {
                required: true,
                message: 'Vui lòng nhập mục đích sử dụng',
              },
              {
                min: 10,
                message: 'Mục đích sử dụng phải có ít nhất 10 ký tự',
              },
            ]}
          >
            <Input.TextArea rows={4} placeholder="Mô tả chi tiết mục đích sử dụng thiết bị" />
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              block
              loading={submitting}
            >
              Gửi yêu cầu
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </PageContainer>
  );
};

export default DeviceList;
