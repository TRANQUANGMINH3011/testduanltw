import React from 'react';
import TableBase from '@/components/Table';
import { Tag, Button, Space, Popconfirm, Tooltip } from 'antd';
import { useDispatch } from 'umi';
import type { PhieuMuon } from '@/services/QuanLyMuonTra/typing';
import moment from 'moment';
import { CheckCircleOutlined, DeliveredProcedureOutlined } from '@ant-design/icons';

const BorrowsPage: React.FC = () => {
  const dispatch = useDispatch();

  const handleAction = (id: string, trangThai: PhieuMuon['trangThai'], successMessage: string) => {
    dispatch({
      type: 'quanLyMuonTra/updateTrangThai',
      payload: { id, trangThai, successMessage },
    });
  };

 const columns: any = [
    { title: 'STT', dataIndex: 'index', valueType: 'indexBorder', width: 80 },
    { title: 'Người mượn', dataIndex: ['nguoiMuon', 'ten'], search: true, width: 200 },
    { title: 'Thiết bị', dataIndex: ['thietBi', 'ten'], search: true, width: 200 },
    {
      title: 'Ngày hẹn trả',
      dataIndex: 'ngayHenTra',
      width: 200,
      render: (date: string) => {
        const isOverdue = moment(date).isBefore(moment(), 'day');
        return (
          <span style={{ color: isOverdue ? 'red' : 'inherit' }}>
            {moment(date).format('DD/MM/YYYY')}
            {isOverdue && <Tooltip title="Đã quá hạn trả!"><Tag color="red" style={{marginLeft: 8}}>QUÁ HẠN</Tag></Tooltip>}
          </span>
        );
      },
    },
    {
      title: 'Trạng thái',
      dataIndex: 'trangThai',
      width: 150,
      render: (trangThai: string) => (
        <Tag color={trangThai === 'Đã duyệt' ? 'gold' : 'blue'}>
          {trangThai === 'Đã duyệt' ? 'CHƯA LẤY' : 'ĐÃ LẤY'}
        </Tag>
      ),
    },
    {
      title: 'Hành động',
      valueType: 'option',
      width: 180,
      render: (_: any, record: PhieuMuon) => (
        <Space>
          {record.trangThai === 'Đã duyệt' && (
            <Popconfirm
              title="Xác nhận người mượn đã lấy thiết bị?"
              onConfirm={() => handleAction(record._id, 'Đã lấy', 'Xác nhận ĐÃ LẤY thành công!')}
            >
              <Button size="small" icon={<DeliveredProcedureOutlined />}>Xác nhận lấy</Button>
            </Popconfirm>
          )}
          {record.trangThai === 'Đã lấy' && (
            <Popconfirm
              title="Xác nhận người mượn đã trả thiết bị?"
              onConfirm={() => handleAction(record._id, 'Đã trả', 'Xác nhận ĐÃ TRẢ thành công!')}
            >
              <Button size="small" type="primary" icon={<CheckCircleOutlined />}>Xác nhận trả</Button>
            </Popconfirm>
          )}
        </Space>
      ),
    },
  ];

  return <TableBase title="Ghi nhận mượn-trả" modelName="quanLyMuonTra" columns={columns} />;
};

export default BorrowsPage;