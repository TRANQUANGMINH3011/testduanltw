
import React from 'react';
import { Card, Row, Col, Statistic, Table, Tag } from 'antd';
import { ToolOutlined, HistoryOutlined, CheckCircleOutlined, ClockCircleOutlined } from '@ant-design/icons';

const Dashboard: React.FC = () => {
	const stats = [
		{
			title: 'Tổng thiết bị',
			value: 156,
			icon: <ToolOutlined style={{ color: '#1890ff' }} />,
		},
		{
			title: 'Đang mượn',
			value: 23,
			icon: <ClockCircleOutlined style={{ color: '#faad14' }} />,
		},
		{
			title: 'Đã trả',
			value: 89,
			icon: <CheckCircleOutlined style={{ color: '#52c41a' }} />,
		},
		{
			title: 'Yêu cầu chờ',
			value: 12,
			icon: <HistoryOutlined style={{ color: '#f5222d' }} />,
		},
	];

	const recentRequests = [
		{
			key: '1',
			user: 'Nguyễn Văn A',
			device: 'Laptop Dell',
			status: 'pending',
			date: '2024-01-15',
		},
		{
			key: '2',
			user: 'Trần Thị B',
			device: 'Máy chiếu',
			status: 'approved',
			date: '2024-01-14',
		},
		{
			key: '3',
			user: 'Lê Văn C',
			device: 'Camera',
			status: 'returned',
			date: '2024-01-13',
		},
	];

	const columns = [
		{
			title: 'Người dùng',
			dataIndex: 'user',
			key: 'user',
		},
		{
			title: 'Thiết bị',
			dataIndex: 'device',
			key: 'device',
		},
		{
			title: 'Trạng thái',
			dataIndex: 'status',
			key: 'status',
			render: (status: string) => {
				const colorMap = {
					pending: 'orange',
					approved: 'blue',
					returned: 'green',
				};
				const textMap = {
					pending: 'Chờ duyệt',
					approved: 'Đã duyệt',
					returned: 'Đã trả',
				};
				return <Tag color={colorMap[status as keyof typeof colorMap]}>{textMap[status as keyof typeof textMap]}</Tag>;
			},
		},
		{
			title: 'Ngày',
			dataIndex: 'date',
			key: 'date',
		},
	];

	return (
		<div>
			<h1>Dashboard</h1>
			
			<Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
				{stats.map((stat, index) => (
					<Col xs={24} sm={12} lg={6} key={index}>
						<Card>
							<Statistic
								title={stat.title}
								value={stat.value}
								prefix={stat.icon}
								valueStyle={{ color: '#3f8600' }}
							/>
						</Card>
					</Col>
				))}
			</Row>

			<Card title="Yêu cầu gần đây">
				<Table
					columns={columns}
					dataSource={recentRequests}
					pagination={false}
					size="small"
				/>
			</Card>
		</div>
	);
};

export default Dashboard;
