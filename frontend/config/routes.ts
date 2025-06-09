export default [
	{
		path: '/user',
		layout: false,
		routes: [
			{
				path: '/user/login',
				layout: false,
				name: 'login',
				component: './user/Login',
			},
			{
				path: '/user',
				redirect: '/user/login',
			},
		],
	},

	// Main dashboard with custom layout
	{
		path: '/',
		component: '@/layouts/BasicLayout',
		routes: [
			{
				path: '/dashboard',
				name: 'Dashboard',
				component: './Admin/Dashboard',
				icon: 'DashboardOutlined',
			},
			{
				path: '/admin/equipments',
				name: 'Quản lý thiết bị',
				component: './Admin/Equipments',
				icon: 'ToolOutlined',
			},
			{
				path: '/admin/requests',
				name: 'Quản lý yêu cầu',
				component: './Admin/Requests',
				icon: 'HistoryOutlined',
			},
			{
				path: '/admin/borrows',
				name: 'Quản lý mượn trả',
				component: './Admin/Borrows',
				icon: 'BarChartOutlined',
			},
			{
				path: '/profile',
				name: 'Thông tin cá nhân',
				component: './user/Profile',
				hideInMenu: true,
			},
			{
				path: '/',
				redirect: '/dashboard',
			},
		],
	},

	// Error pages
	{
		path: '/403',
		component: './exception/403',
		layout: false,
	},
	{
		path: '/404',
		component: './exception/404',
		layout: false,
	},
	{
		path: '/500',
		component: './exception/500',
		layout: false,
	},
	{
		component: './exception/404',
		layout: false,
	},
];