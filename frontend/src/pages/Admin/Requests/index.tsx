import { PageContainer } from '@ant-design/pro-layout';
// Sửa lại import: ProTable và các kiểu liên quan đều từ @ant-design/pro-table
import ProTable, { ActionType, ProColumns } from '@ant-design/pro-table';
// Không cần import 'Tag' nữa vì không dùng đến
import React, { useRef } from 'react';
import { useDispatch } from 'umi';

const QuanLyYeuCauPage: React.FC = () => {
  const actionRef = useRef<ActionType>();
  const dispatch = useDispatch();

  const handleApprove = (id: string) => {
    dispatch({
      type: 'quanLyYeuCau/approve',
      payload: { id },
      callback: () => {
        actionRef.current?.reload(); // Tải lại bảng sau khi duyệt
      },
    });
  };

  const handleReject = (id: string) => {
    dispatch({
      type: 'quanLyYeuCau/reject',
      payload: { id },
      callback: () => {
        actionRef.current?.reload(); // Tải lại bảng sau khi từ chối
      },
    });
  };

  const columns: ProColumns<QuanLyYeuCau.Record>[] = [
    {
      title: 'STT',
      dataIndex: 'index',
      valueType: 'indexBorder',
      width: 48,
    },
    {
      title: 'Tên người mượn',
      // ProTable có thể tự truy cập thuộc tính lồng nhau
      dataIndex: ['user', 'name'],
      copyable: true,
    },
    {
      title: 'Tên thiết bị',
      dataIndex: ['device', 'name'],
      copyable: true,
    },
    {
      title: 'Ngày mượn',
      dataIndex: 'borrowDate',
      valueType: 'date',
      sorter: true,
    },
    {
      title: 'Ngày trả',
      dataIndex: 'returnDate',
      valueType: 'date',
      sorter: true,
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      valueType: 'select',
      valueEnum: {
        pending: { text: 'Chờ duyệt', status: 'Warning' },
        approved: { text: 'Đã duyệt', status: 'Success' },
        rejected: { text: 'Đã từ chối', status: 'Error' },
        completed: { text: 'Đã hoàn thành', status: 'Default' },
        overdue: { text: 'Quá hạn', status: 'Error' },
      },
    },
    {
      title: 'Hành động',
      valueType: 'option',
      width: 120,
      // Thêm kiểu dữ liệu cho tham số record
      render: (_, record: QuanLyYeuCau.Record) =>
        record.status === 'pending'
          ? [
              <a key="approve" onClick={() => handleApprove(record._id)}>
                Duyệt
              </a>,
              <a key="reject" style={{ color: 'red' }} onClick={() => handleReject(record._id)}>
                Từ chối
              </a>,
            ]
          : null,
    },
  ];

  return (
    <PageContainer>
      <ProTable<QuanLyYeuCau.Record>
        headerTitle="Danh sách yêu cầu mượn thiết bị"
        actionRef={actionRef}
        rowKey="_id"
        search={{
          labelWidth: 120,
        }}
        // Cập nhật lại prop request để dùng callback
        request={(params: Record<string, any>) => {
          return new Promise((resolve) => {
            const payload = {
              ...params,
              page: params.current,
              pageSize: params.pageSize,
              callback: (response: any) => {
                if (response) {
                  resolve({
                    data: response.docs,
                    success: true,
                    total: response.totalDocs,
                  });
                } else {
                  resolve({ data: [], success: false, total: 0 });
                }
              },
            };
            dispatch({
              type: 'quanLyYeuCau/get',
              payload,
            });
          });
        }}
        columns={columns}
      />
    </PageContainer>
  );
};

export default QuanLyYeuCauPage;