
import React from 'react';
import { Layout } from 'antd';
import './footer.less';

const { Footer: AntFooter } = Layout;

const Footer: React.FC = () => {
	return (
		<AntFooter className="custom-footer">
			<div className="footer-content">
				<div className="footer-text">
					© {new Date().getFullYear()} Admin Panel. All rights reserved.
				</div>
			</div>
		</AntFooter>
	);
};

export default Footer;
