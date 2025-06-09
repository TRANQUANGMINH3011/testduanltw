import axios from '@/utils/axios';

const API_URL = '/api/v1';

/**
 * Lấy danh sách thiết bị (dùng cho cả User và Admin)
 * @param params Chứa các tham số phân trang và cờ `isAdmin`
 */
export async function getThietBi(params: {
  current?: number;
  pageSize?: number;
  isAdmin?: boolean;
}) {
  const url = params.isAdmin ? `${API_URL}/admin/devices` : `${API_URL}/devices`;
  delete params.isAdmin;
  return axios.get(url, { params }).then((res) => res.data);
}

/**
 * [Admin] Thêm mới một thiết bị
 * @param data Dữ liệu của thiết bị mới
 */
export async function addThietBi(data: Partial<API.Device>) {
  return axios.post(`${API_URL}/admin/devices`, data);
}

/**
 * [Admin] Cập nhật thông tin một thiết bị
 * @param id ID của thiết bị cần cập nhật
 * @param data Dữ liệu mới
 */
export async function updThietBi(id: string, data: Partial<API.Device>) {
  return axios.put(`${API_URL}/admin/devices/${id}`, data);
}

/**
 * [Admin] Xóa một thiết bị
 * @param id ID của thiết bị cần xóa
 */
export async function delThietBi(id: string) {
  return axios.delete(`${API_URL}/admin/devices/${id}`);
}