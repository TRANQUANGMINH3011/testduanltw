import axios, { AxiosRequestConfig } from 'axios';
import { notification } from 'antd';

const instance = axios.create({
  baseURL: 'http://localhost:3456',
  timeout: 10000,
});

// Request interceptor
instance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('admin-token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
instance.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('admin-token');
      window.location.href = '/user/login';
    }

    notification.error({
      message: 'Lỗi API',
      description: error.response?.data?.message || 'Có lỗi xảy ra khi kết nối với server',
    });

    return Promise.reject(error);
  }
);

export default instance;