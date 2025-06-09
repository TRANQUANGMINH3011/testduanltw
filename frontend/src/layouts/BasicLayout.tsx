
import React from 'react';
import { Layout } from 'antd';
import Navbar from '@/components/common/Navbar_tem';
import Footer from '@/components/common/Footer_tem';
import './BasicLayout.less';

const { Content } = Layout;

interface BasicLayoutProps {
	children: React.ReactNode;
}

const BasicLayout: React.FC<BasicLayoutProps> = ({ children }) => {
	return (
		<Layout className="basic-layout">
			<Navbar />
			<Content className="main-content">
				{children}
			</Content>
			<Footer />
		</Layout>
	);
};

export default BasicLayout;
