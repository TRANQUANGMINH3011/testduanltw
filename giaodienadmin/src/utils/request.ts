
import { extend } from 'umi-request';
import { notification } from 'antd';
import { history } from 'umi';

const codeMessage = {
  200: 'Máy chủ đã trả về dữ liệu được yêu cầu thành công.',
  201: 'Dữ liệu mới hoặc đã sửa đổi thành công.',
  202: 'Một yêu cầu đã vào hàng đợi nền (tác vụ không đồng bộ).',
  204: 'Dữ liệu đã được xóa thành công.',
  400: 'Có lỗi trong yêu cầu được gửi đi, máy chủ không thực hiện các thao tác tạo hoặc sửa đổi dữ liệu.',
  401: 'Người dùng không có quyền (mã thông báo, tên người dùng, mật khẩu sai).',
  403: 'Người dùng được ủy quyền, nhưng quyền truy cập bị cấm.',
  404: 'Yêu cầu được gửi cho bản ghi không tồn tại, máy chủ không hoạt động.',
  406: 'Định dạng được yêu cầu không khả dụng.',
  410: 'Tài nguyên được yêu cầu đã bị xóa vĩnh viễn và sẽ không khả dụng nữa.',
  422: 'Khi tạo một đối tượng, đã xảy ra lỗi xác thực.',
  500: 'Đã xảy ra lỗi trong máy chủ, vui lòng kiểm tra máy chủ.',
  502: 'Lỗi cổng.',
  503: 'Dịch vụ không khả dụng, máy chủ tạm thời quá tải hoặc đang được bảo trì.',
  504: 'Cổng hết thời gian.',
};

/**
 * 异常处理程序
 */
const errorHandler = (error: { response: Response }): Response => {
  const { response } = error;

  if (response && response.status) {
    const errorText = codeMessage[response.status] || response.statusText;
    const { status, url } = response;

    notification.error({
      message: `Lỗi yêu cầu ${status}: ${url}`,
      description: errorText,
    });

    if (status === 401) {
      // 401 redirect to login
      localStorage.removeItem('token');
      history.push('/user/login');
    }
  } else if (!response) {
    notification.error({
      description: 'Mạng của bạn có vấn đề, không thể kết nối với máy chủ',
      message: 'Lỗi mạng',
    });
  }

  return response;
};

/**
 * 配置request请求时的默认参数
 */
const request = extend({
  errorHandler, // 默认错误处理
  credentials: 'include', // 默认请求是否带上cookie
});

// request interceptor, change headers
request.interceptors.request.use((url, options) => {
  const token = localStorage.getItem('token');
  
  if (token) {
    return {
      url,
      options: {
        ...options,
        headers: {
          ...options.headers,
          Authorization: `Bearer ${token}`,
        },
      },
    };
  }
  
  return { url, options };
});

export default request;
