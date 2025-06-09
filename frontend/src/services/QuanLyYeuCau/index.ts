
import axios from '@/utils/axios';

/**
 * [Admin] Lấy danh sách yêu cầu mượn thiết bị
 */
export async function getYeuCau(params: {
  current?: number;
  pageSize?: number;
  status?: string;
}) {
  return axios.get('/api/v1/admin/borrow-requests', { params }).then((res) => res.data);
}

/**
 * [Admin] Phê duyệt yêu cầu mượn thiết bị
 */
export async function approveYeuCau(id: string, data?: any) {
  return axios.put(`/api/v1/admin/borrow-requests/${id}/approve`, data);
}

/**
 * [Admin] Từ chối yêu cầu mượn thiết bị
 */
export async function rejectYeuCau(id: string, data?: any) {
  return axios.put(`/api/v1/admin/borrow-requests/${id}/reject`, data);
}

/**
 * [Admin] Xác nhận đã lấy thiết bị
 */
export async function confirmPickup(id: string) {
  return axios.put(`/api/v1/admin/borrow-requests/${id}/pickup`);
}

/**
 * [Admin] Xác nhận đã trả thiết bị
 */
export async function confirmReturn(id: string) {
  return axios.put(`/api/v1/admin/borrow-requests/${id}/return`);
}

/**
 * [Admin] Lấy chi tiết yêu cầu
 */
export async function getYeuCauDetail(id: string) {
  return axios.get(`/api/v1/admin/borrow-requests/${id}`).then((res) => res.data);
}
