import { message, notification } from 'antd';
import axios from 'axios';
import { history } from 'umi';
import data from './data';

// Tạo instance axios với baseURL
const instance = axios.create({
	baseURL: 'http://localhost:3456',
	timeout: 10000,
});

// Add a request interceptor
instance.interceptors.request.use(
	(config) => {
		// Lấy token từ localStorage
		const token = localStorage.getItem('token');
		if (token) {
			// Thêm token vào header
			config.headers.Authorization = `Bearer ${token}`;
		}
		return config;
	},
	(error) => {
		return Promise.reject(error);
	}
);

// Add a response interceptor
instance.interceptors.response.use(
	(response) => response,
	(error) => {
		const er = error?.response?.data;
		const descriptionError = Array.isArray(er?.detail?.exception?.response?.message)
			? er?.detail?.exception?.response?.message?.join(', ')
			: Array.isArray(er?.detail?.exception?.errors)
			? er?.detail?.exception?.errors?.map((e: any) => e?.message)?.join(', ')
			: data.error[er?.detail?.errorCode || er?.errorCode] ||
			  er?.detail?.message ||
			  er?.message ||
			  er?.errorDescription;

		const originalRequest = error.config;
		let originData = originalRequest?.data;
		if (typeof originData === 'string') originData = JSON.parse(originData);

		// Chỉ hiển thị thông báo lỗi nếu không phải là request silent
		if (typeof originData !== 'object' || !Object.keys(originData ?? {}).includes('silent') || !originData?.silent) {
			switch (error?.response?.status) {
				case 400:
					notification.error({
						message: 'Dữ liệu chưa đúng',
						description: descriptionError,
					});
					break;

				case 401:
					// Xóa token và chuyển về trang đăng nhập nếu token hết hạn
					localStorage.removeItem('token');
					localStorage.removeItem('user');
					notification.error({
						message: 'Phiên đăng nhập đã hết hạn',
						description: 'Vui lòng đăng nhập lại',
					});
					history.push('/user/login');
					break;

				case 403:
					notification.error({
						message: 'Không có quyền truy cập',
						description: descriptionError,
					});
					break;

				case 404:
					notification.error({
						message: 'Không tìm thấy dữ liệu',
						description: descriptionError,
					});
					break;

				case 409:
					notification.error({
						message: 'Dữ liệu đã tồn tại',
						description: descriptionError,
					});
					break;

				case 500:
				case 502:
					notification.error({
						message: 'Lỗi hệ thống',
						description: descriptionError,
					});
					break;

				default:
					message.error('Hệ thống đang cập nhật. Vui lòng thử lại sau');
					break;
			}
		}

		return Promise.reject(error);
	}
);

export default instance;