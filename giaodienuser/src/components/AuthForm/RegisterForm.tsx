import React from 'react';
import { Form, Input, Button, Typography } from 'antd';
import { UserOutlined, LockOutlined, IdcardOutlined } from '@ant-design/icons';
import { history } from 'umi';
import { validatePassword } from './utils';

const { Title, Text } = Typography;

interface RegisterFormProps {
  loading: boolean;
  onFinish: (values: any) => void;
}

const RegisterForm: React.FC<RegisterFormProps> = ({ loading, onFinish }) => {
  return (
    <div style={{
      background: '#fff',
      borderRadius: 20,
      maxWidth: 450,
      margin: '40px auto',
      padding: 32,
      boxShadow: '0 4px 24px rgba(0,0,0,0.08)',
    }}>
      <Title level={2} style={{ textAlign: 'center' }}>Đăng ký</Title>
      <Text type="secondary" style={{ display: 'block', textAlign: 'center', marginBottom: 24 }}>
        Đăng ký tài khoản của bạn tại đây
      </Text>
      <Form layout="vertical" onFinish={onFinish} autoComplete="off">
        <Form.Item label="Họ và tên" name="name" rules={[{ required: true, message: 'Vui lòng nhập họ và tên!' }]}>
          <Input prefix={<IdcardOutlined />} placeholder="ex: Nguyễn Văn A" size="large" />
        </Form.Item>
        <Form.Item
          label="Email"
          name="username"
          rules={[
            { required: true, message: 'Vui lòng nhập email!' },
            {
              validator: (_, value) => {
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (emailRegex.test(value)) {
                  return Promise.resolve();
                }
                return Promise.reject(new Error('Vui lòng nhập email hợp lệ!'));
              }
            }
          ]}
        >
          <Input
            prefix={<UserOutlined />}
            placeholder="ex: example@gmail.com"
            size="large"
          />
        </Form.Item>
        <Form.Item
          label="Mật khẩu"
          name="password"
          rules={[
            { required: true, message: 'Vui lòng nhập mật khẩu!' },
            { validator: validatePassword }
          ]}
        >
          <Input.Password prefix={<LockOutlined />} placeholder="Nhập mật khẩu" size="large" />
        </Form.Item>
        <Form.Item label="Xác nhận mật khẩu" name="confirmPassword" rules={[
          { required: true, message: 'Vui lòng xác nhận mật khẩu!' },
          ({ getFieldValue }) => ({
            validator(_, value) {
              if (!value || getFieldValue('password') === value) {
                return Promise.resolve();
              }
              return Promise.reject(new Error('Mật khẩu xác nhận không khớp!'));
            },
          }),
        ]}>
          <Input.Password prefix={<LockOutlined />} placeholder="Nhập lại mật khẩu" size="large" />
        </Form.Item>
        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            block
            size="large"
            loading={loading}
            style={{ background: '#FF3B00', border: 'none', borderRadius: 24, marginTop: 8 }}
          >
            Đăng ký
          </Button>
        </Form.Item>
        <div style={{ textAlign: 'center' }}>
          <Text>Đã có tài khoản? </Text>
          <a onClick={() => history.push('/user/login')}>Đăng nhập</a>
        </div>
      </Form>
    </div>
  );
};

export default RegisterForm;
