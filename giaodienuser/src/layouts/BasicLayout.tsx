import React, { useState } from 'react';
import { Layout, Menu, Dropdown, Avatar, Space, Typography, Button, message } from 'antd';
import {
  HomeOutlined,
  AppstoreOutlined,
  BarChartOutlined,
  UserOutlined,
  LogoutOutlined,
  SettingOutlined,
} from '@ant-design/icons';
import { Link, useLocation, history } from 'umi';
import styles from './BasicLayout.less';
import { logoutUser } from '@/services/user';

const { Header, Content, Footer } = Layout;
const { Text } = Typography;

const BasicLayout: React.FC = ({ children }) => {
  const location = useLocation();
  const [currentUser, setCurrentUser] = useState({
    name: localStorage.getItem('userName') || 'User',
    avatar: 'https://gw.alipayobjects.com/zos/antfincdn/XAosXuNZyF/BiazfanxmamNRoxxVxka.png',
  });

  const handleLogout = async () => {
    try {
      await logoutUser();
      localStorage.removeItem('token');
      localStorage.removeItem('userName');
      message.success('Đăng xuất thành công');
      history.push('/user/auth/login');
    } catch (error) {
      message.error('Đăng xuất thất bại');
    }
  };

  const userMenu = (
    <Menu>
      <Menu.Item key="profile" icon={<UserOutlined />}>
        <Link to="/profile">Thông tin cá nhân</Link>
      </Menu.Item>
      <Menu.Item key="settings" icon={<SettingOutlined />}>
        <Link to="/profile">Cài đặt</Link>
      </Menu.Item>
      <Menu.Divider />
      <Menu.Item key="logout" icon={<LogoutOutlined />} onClick={handleLogout}>
        Đăng xuất
      </Menu.Item>
    </Menu>
  );

  const navItems = [
    {
      key: '/dashboard',
      icon: <HomeOutlined />,
      label: <Link to="/dashboard">Trang chủ</Link>,
    },
    {
      key: '/devices',
      icon: <AppstoreOutlined />,
      label: <Link to="/devices">Quản lý thiết bị</Link>,
    },
    {
      key: '/statistics',
      icon: <BarChartOutlined />,
      label: <Link to="/statistics">Thống kê</Link>,
    },
  ];

  return (
    <Layout className={styles.layout}>
      <Header className={styles.header}>
        <div className={styles.logo}>
          <Link to="/dashboard">
            <img src="/logo.png" alt="Logo" />
            <span>Hệ thống mượn thiết bị</span>
          </Link>
        </div>
        <Menu
          theme="dark"
          mode="horizontal"
          selectedKeys={[location.pathname]}
          items={navItems}
          className={styles.menu}
        />
        <div className={styles.userInfo}>
          <Dropdown overlay={userMenu} placement="bottomRight">
            <Space className={styles.userDropdown}>
              <Avatar src={currentUser.avatar} />
              <Text style={{ color: 'white' }}>Xin chào, {currentUser.name}</Text>
            </Space>
          </Dropdown>
        </div>
      </Header>

      <Content className={styles.content}>
        {children}
      </Content>

      <Footer className={styles.footer}>
        <div className={styles.footerContent}>
          <div className={styles.footerSection}>
            <h3>Hệ thống mượn thiết bị</h3>
            <p>Giải pháp quản lý thiết bị thông minh</p>
          </div>
          <div className={styles.footerSection}>
            <h4>Liên hệ</h4>
            <p>Email: support@example.com</p>
            <p>Hotline: 0123 456 789</p>
          </div>
          <div className={styles.footerSection}>
            <h4>Liên kết</h4>
            <Link to="/about">Giới thiệu</Link>
            <Link to="/terms">Điều khoản sử dụng</Link>
            <Link to="/privacy">Chính sách bảo mật</Link>
          </div>
        </div>
        <div className={styles.footerBottom}>
          <p>© 2024 Hệ thống mượn thiết bị. All rights reserved.</p>
        </div>
      </Footer>
    </Layout>
  );
};

export default BasicLayout;
