export default [
	// Auth routes - Không cần đăng nhập
	{
		path: '/user',
		layout: false,
		routes: [
			{
				path: '/user/login',
				name: 'Đăng nhập',
				component: '@/pages/user/Login',
				exact: true,
			},
			{
				path: '/user/register',
				name: 'Đăng ký',
				component: '@/pages/user/Register',
				exact: true,
			},
			{
				path: '/user',
				redirect: '/user/auth/login',
				exact: true,
			},
		],
	},

	// Main menu routes - Cần đăng nhập
	{
		path: '/',
		component: '@/layouts/BasicLayout',
		routes: [
			// Trang chủ - Point to existing TrangChu component
			{
				path: '/dashboard',
				name: 'Trang chủ',
				icon: 'HomeOutlined',
				component: '@/pages/Home',
				layout: false,
				exact: true,
				hideInMenu: true,
			},

			// Quản lý thiết bị
			{
				name: 'Lich sử mượn thiết bị',
				icon: 'AppstoreOutlined',
				path: '/devices',
				routes: [
					{
						path: '/devices',
						name: 'Danh sách thiết bị',
						component: '@/pages/Devices',
						layout: false,
						exact: true,
						hideInMenu: true,
					},
					{
						path: '/devices/borrow',
						name: 'Mượn thiết bị',
						component: '@/pages/MuonDo/home',
						layout: false,
				hideInMenu: true,
					},
					{
						path: '/devices/history',
						name: 'Lịch sử mượn trả',
						component: '@/pages/History',
						layout: false,
				hideInMenu: true,
					},
				],
				layout: false,
				hideInMenu: true,
			},

			// Thống kê
			{
				path: '/statistics',
				name: 'Lịch sử mượn',
				icon: 'BarChartOutlined',
				component: '@/pages/History',
				layout: false,
				hideInMenu: true,
			},

			// Thông tin cá nhân
			{
				path: '/profile',
				name: 'Thông tin cá nhân',
				icon: 'UserOutlined',
				component: '@/pages/Profile',
				layout: false,
				hideInMenu: true,
			},

			// Giới thiệu - Point to existing GioiThieu component
			{
				path: '/about',
				name: 'Giới thiệu',
				icon: 'InfoCircleOutlined',
				component: '@/pages/TienIch/GioiThieu',
				hideInMenu: true,
				exact: true,
			},

			// Notification routes
			{
				path: '/notification',
				routes: [
					{
						path: '/notification/subscribe',
						component: '@/pages/ThongBao/Subscribe',
						exact: true,
					},
					{
						path: '/notification/check',
						component: '@/pages/ThongBao/Check',
						exact: true,
					},
					{
						path: '/notification',
						component: '@/pages/ThongBao/NotifOneSignal',
						exact: true,
					},
				],
				layout: false,
				hideInMenu: true,
			},

			// Error pages - Point to existing exception components
			{
				path: '/403',
				component: '@/pages/exception/403',
				layout: false,
				exact: true,
			},
			{
				path: '/404',
				component: '@/pages/exception/404',
				layout: false,
				exact: true,
			},
			{
				path: '/500',
				component: '@/pages/exception/500',
				layout: false,
				exact: true,
			},
			{
				path: '/hold-on',
				component: '@/pages/exception/DangCapNhat',
				layout: false,
				exact: true,
			},

			// Root path
			{
				path: '/',
				redirect: '/dashboard',
				exact: true,
			},

			// 404 fallback
			{
				component: '@/pages/exception/404',
			},
		],
	},
];
