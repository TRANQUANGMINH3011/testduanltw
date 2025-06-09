import rules from '@/utils/rules';
import { Form, Input, Select } from 'antd';
// Bỏ import useForm vì chúng ta sẽ nhận form từ bên ngoài
import { useEffect } from 'react';

// Định nghĩa kiểu cho props để code rõ ràng hơn
interface FormThietBiProps {
  onFinish: (values: any) => void;
  initialValues?: Partial<QuanLyThietBi.Record>;
  form: any;
}

const FormThietBi = (props: FormThietBiProps) => {
  const { onFinish, initialValues, form } = props;

  useEffect(() => {
    // Set giá trị cho form khi có dữ liệu ban đầu (chế độ sửa)
    if (initialValues) {
      form.setFieldsValue(initialValues);
    } else {
      // Reset form khi ở chế độ thêm mới
      form.resetFields();
    }
  }, [initialValues, form]);

  return (
    // Bỏ prop onFinish ở đây vì Modal sẽ xử lý việc submit
    <Form form={form} layout="vertical" onFinish={onFinish}>
      <Form.Item name="name" label="Tên thiết bị" rules={[...rules.required]}>
        <Input placeholder="Nhập tên thiết bị" />
      </Form.Item>
      <Form.Item name="model" label="Model">
        <Input placeholder="Nhập model thiết bị" />
      </Form.Item>
      <Form.Item name="description" label="Mô tả">
        <Input.TextArea placeholder="Nhập mô tả" />
      </Form.Item>
      <Form.Item name="condition" label="Tình trạng" initialValue="new">
        <Select>
          <Select.Option value="new">Mới</Select.Option>
          <Select.Option value="good">Tốt</Select.Option>
          <Select.Option value="fair">Khá</Select.Option>
          <Select.Option value="poor">Kém</Select.Option>
        </Select>
      </Form.Item>
      <Form.Item name="status" label="Trạng thái" initialValue="available">
        <Select>
          <Select.Option value="available">Sẵn có</Select.Option>
          <Select.Option value="in_use">Đang sử dụng</Select.Option>
          <Select.Option value="under_maintenance">Đang bảo trì</Select.Option>
        </Select>
      </Form.Item>
    </Form>
  );
};

export default FormThietBi;