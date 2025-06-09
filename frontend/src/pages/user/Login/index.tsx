// frontend/src/pages/user/Login/index.tsx

import Footer from '@/components/Footer';
// Bỏ các import cũ, thay bằng hàm mới của chúng ta
import { loginWithPassword } from '@/services/base/api';
import rules from '@/utils/rules';
import { LockOutlined, UserOutlined } from '@ant-design/icons';
import { Button, Form, Input, Tabs, message } from 'antd';
import React, { useState } from 'react';
import { history, useIntl, useModel } from 'umi';
import styles from './index.less';

const Login: React.FC = () => {
  const [submitting, setSubmitting] = useState(false);
  // State để xác định loại đăng nhập: 'user' hoặc 'admin'
  const [loginType, setLoginType] = useState<'user' | 'admin'>('user');
  const { setInitialState } = useModel('@@initialState');
  const intl = useIntl();
  const [form] = Form.useForm();

  const handleSubmit = async (values: API.LoginParams) => {
    setSubmitting(true);
    try {
      // Gọi hàm API mới, truyền cả `values` và `loginType`
      const response = await loginWithPassword({ ...values, type: loginType });

      // Backend trả về { accessToken, user, message }
      if (response && response.accessToken) {
        message.success('Đăng nhập thành công!');

        // Lưu token và loại người dùng vào localStorage để các hàm khác sử dụng
        localStorage.setItem('accessToken', response.accessToken);
        localStorage.setItem('userType', loginType);

        // Cập nhật trạng thái người dùng toàn cục
        await setInitialState((s) => ({ ...s, currentUser: response.user as any }));

        // Chuyển hướng đến trang dashboard hoặc trang trước đó
        const urlParams = new URL(window.location.href).searchParams;
        history.push(urlParams.get('redirect') || '/');
      }
      // Nếu có lỗi, interceptor trong axios.ts sẽ tự động hiển thị thông báo
    } catch (error) {
      console.error(error);
    }
    setSubmitting(false);
  };

  const LoginForm = () => (
    <Form form={form} name="login" onFinish={handleSubmit} layout="vertical">
      <Form.Item label="" name="username" rules={[...rules.required]}>
        <Input
          placeholder={intl.formatMessage({
            id: 'pages.login.username.placeholder',
            defaultMessage: 'Nhập tên đăng nhập',
          })}
          prefix={<UserOutlined className={styles.prefixIcon} />}
          size="large"
        />
      </Form.Item>
      <Form.Item label="" name="password" rules={[...rules.required]}>
        <Input.Password
          placeholder={intl.formatMessage({
            id: 'pages.login.password.placeholder',
            defaultMessage: 'Nhập mật khẩu',
          })}
          prefix={<LockOutlined className={styles.prefixIcon} />}
          size="large"
        />
      </Form.Item>
      <div style={{ marginBottom: 24 }}>
        {/* Có thể thêm checkbox "Tự động đăng nhập" ở đây nếu cần */}
      </div>
      <Button type="primary" htmlType="submit" block size="large" loading={submitting}>
        {intl.formatMessage({ id: 'pages.login.submit', defaultMessage: 'Đăng nhập' })}
      </Button>
    </Form>
  );

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <div className={styles.top}>
          <div className={styles.header}>
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
              <img alt="logo" className={styles.logo} src="/logo-full.svg" />
            </div>
          </div>
        </div>

        <div className={styles.main}>
          {/* Sử dụng Tabs để chuyển đổi giữa form User và Admin */}
          <Tabs activeKey={loginType} onChange={(activeKey) => setLoginType(activeKey as any)}>
            <Tabs.TabPane
              key="user"
              tab={intl.formatMessage({
                id: 'pages.login.userLogin.tab',
                defaultMessage: 'Người dùng',
              })}
            />
            <Tabs.TabPane
              key="admin"
              tab={intl.formatMessage({
                id: 'pages.login.adminLogin.tab',
                defaultMessage: 'Quản trị viên',
              })}
            />
          </Tabs>

          <LoginForm />
        </div>
      </div>

      <div className="login-footer">
        <Footer />
      </div>
    </div>
  );
};

export default Login;