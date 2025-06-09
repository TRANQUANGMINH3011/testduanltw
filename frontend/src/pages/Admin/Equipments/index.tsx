import { PlusOutlined } from '@ant-design/icons';
import { PageContainer } from '@ant-design/pro-layout';
import ProTable, { ActionType, ProColumns } from '@ant-design/pro-table';
import { Button, Form, message, Modal, Popconfirm } from 'antd';
import React, { useRef, useState } from 'react';
import { useDispatch } from 'umi';
import FormThietBi from './components/Form';

const QuanLyThietBiPage: React.FC = () => {
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  const [currentRow, setCurrentRow] = useState<QuanLyThietBi.Record | undefined>();
  const actionRef = useRef<ActionType>();
  const dispatch = useDispatch();
  // Tạo một form instance để điều khiển form bên trong Modal
  const [form] = Form.useForm();

  const handleDelete = (id: string) => {
    dispatch({
      type: 'quanLyThietBi/del',
      payload: { id: [id] },
      callback: () => {
        actionRef.current?.reloadAndRest?.();
      },
    });
  };

  // Hàm này giờ sẽ được gọi bởi FormThietBi khi submit thành công
  const handleFormSubmit = (values: Partial<QuanLyThietBi.Record>) => {
    const actionType = currentRow ? 'quanLyThietBi/upd' : 'quanLyThietBi/add';
    const payload = currentRow ? { ...values, _id: currentRow._id } : values;

    dispatch({
      type: actionType,
      payload,
      callback: () => {
        setIsModalVisible(false);
        actionRef.current?.reload();
        message.success(currentRow ? 'Cập nhật thiết bị thành công!' : 'Thêm thiết bị thành công!');
      },
    });
  };

  const columns: ProColumns<QuanLyThietBi.Record>[] = [
    {
      title: 'STT',
      dataIndex: 'index',
      valueType: 'indexBorder',
      width: 48,
    },
    {
      title: 'Tên thiết bị',
      dataIndex: 'name',
      sorter: true,
      copyable: true,
    },
    {
      title: 'Model',
      dataIndex: 'model',
      sorter: true,
      copyable: true,
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      valueType: 'select',
      valueEnum: {
        available: { text: 'Sẵn có', status: 'Success' },
        in_use: { text: 'Đang sử dụng', status: 'Processing' },
        under_maintenance: { text: 'Đang bảo trì', status: 'Warning' },
      },
    },
    {
      title: 'Tình trạng',
      dataIndex: 'condition',
      valueType: 'select',
      valueEnum: {
        new: { text: 'Mới' },
        good: { text: 'Tốt' },
        fair: { text: 'Khá' },
        poor: { text: 'Kém' },
      },
    },
    {
      title: 'Hành động',
      valueType: 'option',
      width: 120,
      render: (_: any, record: QuanLyThietBi.Record) => [
        <a
          key="edit"
          onClick={() => {
            setCurrentRow(record);
            setIsModalVisible(true);
          }}
        >
          Sửa
        </a>,
        <Popconfirm
          key="delete"
          title="Bạn có chắc chắn muốn xóa thiết bị này?"
          onConfirm={() => handleDelete(record._id)}
          okText="Đồng ý"
          cancelText="Hủy"
        >
          <a style={{ color: 'red' }}>Xóa</a>
        </Popconfirm>,
      ],
    },
  ];

  return (
    <PageContainer>
      <ProTable<QuanLyThietBi.Record>
        headerTitle="Danh sách thiết bị"
        actionRef={actionRef}
        rowKey="_id"
        search={{
          labelWidth: 120,
        }}
        toolBarRender={() => [
          <Button
            type="primary"
            key="primary"
            onClick={() => {
              setCurrentRow(undefined);
              setIsModalVisible(true);
            }}
          >
            <PlusOutlined /> Thêm mới
          </Button>,
        ]}
        request={(params: Record<string, any>) => {
          return new Promise((resolve) => {
            const payload = {
              ...params,
              page: params.current,
              pageSize: params.pageSize,
              isAdmin: true,
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
              type: 'quanLyThietBi/get',
              payload,
            });
          });
        }}
        columns={columns}
      />

      <Modal
        title={currentRow ? 'Sửa thông tin thiết bị' : 'Thêm thiết bị mới'}
        visible={isModalVisible}
        // Khi nhấn OK trên Modal, nó sẽ trigger submit trên form đã được truyền vào
        onOk={() => form.submit()}
        onCancel={() => setIsModalVisible(false)}
        destroyOnClose
      >
        <FormThietBi
          form={form} // Truyền form instance vào component con
          onFinish={handleFormSubmit}
          initialValues={currentRow}
        />
      </Modal>
    </PageContainer>
  );
};

export default QuanLyThietBiPage;