
import React, { useState } from 'react';
import { Layout, Menu, Button, Drawer, Avatar, Dropdown } from 'antd';
import { MenuOutlined, UserOutlined, LogoutOutlined, DashboardOutlined, ToolOutlined, HistoryOutlined, BarChartOutlined } from '@ant-design/icons';
import { history, useModel } from 'umi';
import { useNavbar } from './useNavbar';
import './Navbar.less';

const { Header } = Layout;

const Navbar: React.FC = () => {
	const [mobileMenuVisible, setMobileMenuVisible] = useState(false);
	const { initialState } = useModel('@@initialState');
	const { handleLogout } = useNavbar();

	const menuItems = [
		{
			key: '/dashboard',
			icon: <DashboardOutlined />,
			label: 'Dashboard',
		},
		{
			key: '/admin/equipments',
			icon: <ToolOutlined />,
			label: 'Quản lý thiết bị',
		},
		{
			key: '/admin/requests',
			icon: <HistoryOutlined />,
			label: 'Quản lý yêu cầu',
		},
		{
			key: '/admin/borrows',
			icon: <BarChartOutlined />,
			label: 'Quản lý mượn trả',
		},
	];

	const userMenuItems = [
		{
			key: 'profile',
			icon: <UserOutlined />,
			label: 'Thông tin cá nhân',
			onClick: () => history.push('/profile'),
		},
		{
			key: 'logout',
			icon: <LogoutOutlined />,
			label: 'Đăng xuất',
			onClick: handleLogout,
		},
	];

	const handleMenuClick = ({ key }: { key: string }) => {
		history.push(key);
		setMobileMenuVisible(false);
	};

	return (
		<Header className="navbar-header">
			<div className="navbar-container">
				<div className="navbar-brand">
					<img src="/logo-full.svg" alt="Logo" height={32} />
					<span className="brand-text">Admin Panel</span>
				</div>

				{/* Desktop Menu */}
				<Menu
					theme="dark"
					mode="horizontal"
					selectedKeys={[history.location.pathname]}
					items={menuItems}
					onClick={handleMenuClick}
					className="desktop-menu"
				/>

				{/* User Menu */}
				<div className="navbar-actions">
					<Dropdown
						menu={{ items: userMenuItems }}
						placement="bottomRight"
						trigger={['click']}
					>
						<Button type="text" className="user-button">
							<Avatar size="small" icon={<UserOutlined />} />
							<span className="user-name">
								{initialState?.currentUser?.name || 'Admin'}
							</span>
						</Button>
					</Dropdown>

					{/* Mobile Menu Button */}
					<Button
						type="text"
						icon={<MenuOutlined />}
						onClick={() => setMobileMenuVisible(true)}
						className="mobile-menu-button"
					/>
				</div>
			</div>

			{/* Mobile Drawer */}
			<Drawer
				title="Menu"
				placement="right"
				onClose={() => setMobileMenuVisible(false)}
				open={mobileMenuVisible}
				bodyStyle={{ padding: 0 }}
			>
				<Menu
					mode="vertical"
					selectedKeys={[history.location.pathname]}
					items={[...menuItems, ...userMenuItems]}
					onClick={handleMenuClick}
				/>
			</Drawer>
		</Header>
	);
};

export default Navbar;
