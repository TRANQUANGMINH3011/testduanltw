
import axios from '@/utils/axios';

/**
 * Lấy danh sách thiết bị cho admin
 */
export async function getThietBi(params: {
  current?: number;
  pageSize?: number;
}) {
  return axios.get('/api/v1/admin/devices', { params }).then((res) => res.data);
}

/**
 * [Admin] Thêm mới một thiết bị
 */
export async function addThietBi(data: any) {
  return axios.post('/api/v1/admin/devices', data);
}

/**
 * [Admin] Cập nhật thông tin một thiết bị
 */
export async function updThietBi(id: string, data: any) {
  return axios.put(`/api/v1/admin/devices/${id}`, data);
}

/**
 * [Admin] Xóa một thiết bị
 */
export async function delThietBi(id: string) {
  return axios.delete(`/api/v1/admin/devices/${id}`);
}

/**
 * [Admin] Lấy chi tiết một thiết bị
 */
export async function getThietBiDetail(id: string) {
  return axios.get(`/api/v1/admin/devices/${id}`).then((res) => res.data);
}
