
import React from 'react';
import { Card, Descriptions, Avatar, Button } from 'antd';
import { UserOutlined, EditOutlined } from '@ant-design/icons';
import { useModel } from 'umi';

const Profile: React.FC = () => {
	const { initialState } = useModel('@@initialState');
	const user = initialState?.currentUser;

	return (
		<div style={{ padding: '24px' }}>
			<Card
				title={
					<div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
						<Avatar size={64} icon={<UserOutlined />} />
						<div>
							<h2 style={{ margin: 0 }}>Thông tin cá nhân</h2>
							<p style={{ margin: 0, color: '#666' }}>Quản lý thông tin tài khoản</p>
						</div>
					</div>
				}
				extra={
					<Button type="primary" icon={<EditOutlined />}>
						Chỉnh sửa
					</Button>
				}
			>
				<Descriptions column={2} bordered>
					<Descriptions.Item label="Họ và tên">
						{user?.name || 'Admin'}
					</Descriptions.Item>
					<Descriptions.Item label="Email">
						{user?.email || 'admin@example.com'}
					</Descriptions.Item>
					<Descriptions.Item label="Vai trò">
						Administrator
					</Descriptions.Item>
					<Descriptions.Item label="Trạng thái">
						<span style={{ color: '#52c41a' }}>Hoạt động</span>
					</Descriptions.Item>
					<Descriptions.Item label="Ngày tạo">
						{new Date().toLocaleDateString('vi-VN')}
					</Descriptions.Item>
					<Descriptions.Item label="Lần đăng nhập cuối">
						{new Date().toLocaleDateString('vi-VN')}
					</Descriptions.Item>
				</Descriptions>
			</Card>
		</div>
	);
};

export default Profile;
