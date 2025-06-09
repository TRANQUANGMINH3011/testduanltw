import React from 'react';
import { Form, Input, Button, Typography } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { history } from 'umi';

const { Title, Text } = Typography;

interface LoginFormProps {
  loading: boolean;
  onFinish: (values: any) => void;
}

const LoginForm: React.FC<LoginFormProps> = ({ loading, onFinish }) => {
  return (
    <div style={{
      background: '#fff',
      borderRadius: 20,
      maxWidth: 400,
      margin: '40px auto',
      padding: 32,
      boxShadow: '0 4px 24px rgba(0,0,0,0.08)',
    }}>
      <Title level={2} style={{ textAlign: 'center' }}>Đăng nhập</Title>
      <Form layout="vertical" onFinish={onFinish} autoComplete="off">
        <Form.Item
          label="Email"
          name="username"
          rules={[
            { required: true, message: 'Vui lòng nhập email!' },
            {
              validator: (_, value) => {
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!value || emailRegex.test(value)) {
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
          ]}
          extra={<Text type="secondary">Nhập mật khẩu của bạn</Text>}
        >
          <Input.Password prefix={<LockOutlined />} placeholder="Nhập mật khẩu" size="large" />
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
            Đăng nhập
          </Button>
        </Form.Item>
        <div style={{ textAlign: 'center' }}>
          <Text>Chưa có tài khoản? </Text>
          <a onClick={() => history.push('/user/register')}>Đăng ký</a>
        </div>
      </Form>
    </div>
  );
};

export default LoginForm;
