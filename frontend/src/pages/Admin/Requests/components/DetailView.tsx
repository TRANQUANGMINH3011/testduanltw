import { Descriptions, Tag } from 'antd';
import React from 'react';
import moment from 'moment';

// Định nghĩa kiểu cho props để component tường minh hơn
interface DetailViewProps {
  record?: QuanLyYeuCau.Record;
}

const DetailView: React.FC<DetailViewProps> = ({ record }) => {
  if (!record) {
    return null; // Không hiển thị gì nếu không có dữ liệu
  }

  // Hàm để render Tag trạng thái cho đẹp hơn
  const renderStatus = (status: QuanLyYeuCau.Record['status']) => {
    const statusMap = {
      pending: { color: 'gold', text: 'Chờ duyệt' },
      approved: { color: 'green', text: 'Đã duyệt' },
      rejected: { color: 'red', text: 'Đã từ chối' },
      completed: { color: 'blue', text: 'Đã hoàn thành' },
      overdue: { color: 'volcano', text: 'Quá hạn' },
    };
    const { color, text } = statusMap[status] || { color: 'default', text: status };
    return <Tag color={color}>{text.toUpperCase()}</Tag>;
  };

  return (
    <Descriptions title="Chi tiết Yêu cầu" bordered layout="vertical">
      {/* Thông tin người mượn - Truy cập vào object lồng nhau */}
      <Descriptions.Item label="Người mượn">{record.user?.name}</Descriptions.Item>
      <Descriptions.Item label="Email người mượn">{record.user?.email}</Descriptions.Item>
      <Descriptions.Item label="Trạng thái">{renderStatus(record.status)}</Descriptions.Item>

      {/* Thông tin thiết bị */}
      <Descriptions.Item label="Tên thiết bị">{record.device?.name}</Descriptions.Item>
      <Descriptions.Item label="Model">{record.device?.model}</Descriptions.Item>
      <Descriptions.Item label="Tình trạng thiết bị">{record.device?.condition}</Descriptions.Item>
      
      {/* Thông tin mượn trả */}
      <Descriptions.Item label="Ngày mượn">
        {moment(record.borrowDate).format('DD/MM/YYYY HH:mm')}
      </Descriptions.Item>
      <Descriptions.Item label="Ngày dự kiến trả">
        {moment(record.returnDate).format('DD/MM/YYYY HH:mm')}
      </Descriptions.Item>
      <Descriptions.Item label="Yêu cầu lúc">
        {moment(record.createdAt).format('DD/MM/YYYY HH:mm')}
      </Descriptions.Item>
    </Descriptions>
  );
};

export default DetailView;