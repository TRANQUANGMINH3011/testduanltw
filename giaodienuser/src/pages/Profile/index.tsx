import React from 'react';
import { Layout } from 'antd';
import { Card, Avatar, Typography, List, Button, Space, Divider, Descriptions, Row, Col } from 'antd';
import {
  UserOutlined,
  MailOutlined,
  PhoneOutlined,
  LogoutOutlined,
  SettingOutlined,
  EditOutlined
} from '@ant-design/icons';
import { history, useModel } from 'umi';
// import styles from './index.less';

const { Title, Text } = Typography;
const { Content } = Layout;

// Mock user data
const userData = {
  name: 'Nguyễn Văn A',
  email: 'nguyenvana@example.com',
  phone: '0123 456 789',
  role: 'Sinh viên',
  department: 'Khoa Công nghệ thông tin',
  avatar: 'https://gw.alipayobjects.com/zos/antfincdn/XAosXuNZyF/BiazfanxmamNRoxxVxka.png',
};

const ProfilePage: React.FC = () => {
  const { initialState } = useModel('@@initialState');
  const currentUser = initialState?.currentUser;

  const handleLogout = () => {
    // Call logout API
    history.push('/user/auth/login');
  };

  const menuItems = [
    {
      title: 'Thông tin cá nhân',
      icon: <UserOutlined />,
      description: 'Xem và cập nhật thông tin cá nhân',
    },
    {
      title: 'Đổi mật khẩu',
      icon: <SettingOutlined />,
      description: 'Thay đổi mật khẩu tài khoản',
    },
    {
      title: 'Cài đặt thông báo',
      icon: <SettingOutlined />,
      description: 'Quản lý cài đặt thông báo',
    },
  ];

  return (
    <Content style={{ padding: '24px', background: '#f0f2f5', minHeight: '100vh' }}>
      <Row gutter={[24, 24]}>
        <Col span={24}>
          <Card>
            <div style={{ textAlign: 'center', marginBottom: 24 }}>
              <Avatar size={100} src={userData.avatar} />
              <Title level={3} style={{ marginTop: 16 }}>{userData.name}</Title>
              <Text type="secondary">{userData.role}</Text>
            </div>

            <Space style={{ width: '100%', justifyContent: 'center' }}>
              <Button type="primary" icon={<EditOutlined />}>
                Chỉnh sửa thông tin
              </Button>
            </Space>
          </Card>
        </Col>

        <Col span={24}>
          <Card title="Thông tin cá nhân">
            <Descriptions column={2} bordered>
              <Descriptions.Item label="Họ và tên">
                {currentUser?.name || 'Chưa cập nhật'}
              </Descriptions.Item>
              <Descriptions.Item label="Email">
                {currentUser?.email || 'Chưa cập nhật'}
              </Descriptions.Item>
              <Descriptions.Item label="Số điện thoại">
                {currentUser?.phone || 'Chưa cập nhật'}
              </Descriptions.Item>
              <Descriptions.Item label="Địa chỉ">
                {currentUser?.address || 'Chưa cập nhật'}
              </Descriptions.Item>
              <Descriptions.Item label="Ngày sinh">
                {currentUser?.birthday || 'Chưa cập nhật'}
              </Descriptions.Item>
              <Descriptions.Item label="Giới tính">
                {currentUser?.gender || 'Chưa cập nhật'}
              </Descriptions.Item>
            </Descriptions>
          </Card>
        </Col>

        <Col span={24}>
          <Card title="Thống kê hoạt động">
            <Row gutter={16}>
              <Col span={8}>
                <div style={{ textAlign: 'center', padding: '16px' }}>
                  <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#1890ff' }}>0</div>
                  <div>Thiết bị đang mượn</div>
                </div>
              </Col>
              <Col span={8}>
                <div style={{ textAlign: 'center', padding: '16px' }}>
                  <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#52c41a' }}>0</div>
                  <div>Lần mượn thành công</div>
                </div>
              </Col>
              <Col span={8}>
                <div style={{ textAlign: 'center', padding: '16px' }}>
                  <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#faad14' }}>0</div>
                  <div>Lần trả muộn</div>
                </div>
              </Col>
            </Row>
          </Card>
        </Col>

        <Col span={24}>
          <Card>
            <Divider />
            <List
              itemLayout="horizontal"
              dataSource={menuItems}
              renderItem={(item) => (
                <List.Item>
                  <List.Item.Meta
                    avatar={item.icon}
                    title={item.title}
                    description={item.description}
                  />
                </List.Item>
              )}
            />
            <Divider />

            <Space direction="vertical" style={{ width: '100%' }}>
              <Card size="small">
                <Space>
                  <MailOutlined />
                  <Text>{userData.email}</Text>
                </Space>
              </Card>
              <Card size="small">
                <Space>
                  <PhoneOutlined />
                  <Text>{userData.phone}</Text>
                </Space>
              </Card>
              <Card size="small">
                <Space>
                  <UserOutlined />
                  <Text>{userData.department}</Text>
                </Space>
              </Card>
            </Space>

            <Divider />

            <Button
              type="primary"
              danger
              icon={<LogoutOutlined />}
              onClick={handleLogout}
              block
            >
              Đăng xuất
            </Button>
          </Card>
        </Col>
      </Row>
    </Content>
  );
};

export default ProfilePage;
