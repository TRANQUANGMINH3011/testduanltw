import { Button, Card, Col, DatePicker, Form, List, message, Modal, Row } from 'antd';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
// Thay thế useModel bằng useDispatch và useSelector để làm việc với DVA
import { useDispatch, useSelector } from 'umi';

const { RangePicker } = DatePicker;

const TrangChuPage: React.FC = () => {
  // State để điều khiển modal mượn thiết bị
  const [isModalVisible, setIsModalVisible] = useState(false);
  // State để lưu thông tin thiết bị đang được chọn để mượn
  const [selectedDevice, setSelectedDevice] = useState<API.Device | undefined>(undefined);

  const [form] = Form.useForm();
  const dispatch = useDispatch();

  // Dùng useSelector để lấy state từ DVA model `quanLyThietBi`
  const { data: thietBiData, loading: thietBiLoading } = useSelector(
    (state: any) => state.quanLyThietBi,
  );

  // Dùng useEffect để gọi API lấy danh sách thiết bị khi trang được tải lần đầu
  useEffect(() => {
    dispatch({
      type: 'quanLyThietBi/get',
      payload: {
        // Không có cờ `isAdmin`, service sẽ tự động gọi API dành cho user
      },
    });
  }, [dispatch]);

  // Hàm để mở modal khi người dùng nhấn nút "Mượn"
  const showBorrowModal = (device: API.Device) => {
    setSelectedDevice(device);
    setIsModalVisible(true);
  };

  // Hàm để đóng modal
  const handleCancel = () => {
    setIsModalVisible(false);
    form.resetFields(); // Reset các trường trong form
  };

  // Hàm xử lý khi người dùng submit form mượn thiết bị
  const handleBorrowSubmit = (values: { dates: [moment.Moment, moment.Moment] }) => {
    if (!selectedDevice) return;

    const [borrowDate, returnDate] = values.dates;

    // Dispatch action 'add' đến model `quanLyYeuCau`
    dispatch({
      type: 'quanLyYeuCau/add',
      payload: {
        device: selectedDevice._id,
        borrowDate: borrowDate.toISOString(),
        returnDate: returnDate.toISOString(),
      },
      callback: () => {
        // Sau khi gửi yêu cầu thành công, đóng modal
        handleCancel();
      },
    });
  };

  return (
    <div>
      <Card>
        <div style={{ textAlign: 'center', marginBottom: 24 }}>
          <h1 style={{ fontSize: '2rem' }}>Hệ thống Quản lý Mượn Trả Thiết bị</h1>
          <p>Vui lòng chọn một thiết bị dưới đây để bắt đầu gửi yêu cầu mượn.</p>
        </div>
        <List
          grid={{ gutter: 16, xs: 1, sm: 2, md: 3, lg: 4, xl: 4, xxl: 4 }}
          dataSource={thietBiData}
          loading={thietBiLoading}
          renderItem={(item: API.Device) => (
            <List.Item>
              <Card
                title={item.name}
                cover={
                  <img
                    alt={item.name}
                    src={item.imageUrl || 'https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png'}
                    style={{ height: 200, objectFit: 'cover' }}
                  />
                }
                actions={[
                  <Button
                    type="primary"
                    onClick={() => showBorrowModal(item)}
                    disabled={item.status !== 'available'} // Vô hiệu hóa nút nếu thiết bị không sẵn có
                  >
                    {item.status === 'available' ? 'Mượn thiết bị' : 'Đang được mượn'}
                  </Button>,
                ]}
              >
                <Card.Meta
                  title={`Model: ${item.model}`}
                  description={`Tình trạng: ${item.condition}`}
                />
              </Card>
            </List.Item>
          )}
        />
      </Card>

      {/* Modal để người dùng nhập thông tin mượn */}
      {selectedDevice && (
        <Modal
          title={`Mượn thiết bị: ${selectedDevice.name}`}
          visible={isModalVisible}
          onCancel={handleCancel}
          onOk={() => form.submit()} // Khi nhấn OK, trigger submit của form
          okText="Gửi yêu cầu"
          cancelText="Hủy"
          destroyOnClose
        >
          <p>
            <b>Mô tả:</b> {selectedDevice.description}
          </p>
          <Form form={form} layout="vertical" onFinish={handleBorrowSubmit}>
            <Form.Item
              name="dates"
              label="Chọn ngày mượn và ngày trả"
              rules={[{ required: true, message: 'Vui lòng chọn ngày!' }]}
            >
              <RangePicker
                style={{ width: '100%' }}
                // Không cho phép chọn ngày trong quá khứ
                disabledDate={(current) => current && current < moment().endOf('day')}
              />
            </Form.Item>
          </Form>
        </Modal>
      )}
    </div>
  );
};

export default TrangChuPage;
