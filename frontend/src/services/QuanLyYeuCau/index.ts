import axios from '@/utils/axios';

const API_URL = '/api/v1';

// ================= API CHO ADMIN =================

/**
 * [Admin] Lấy danh sách tất cả yêu cầu mượn
 */
export async function getYeuCau(params: any) {
  return axios.get(`${API_URL}/admin/borrow-requests`, { params }).then((res) => res.data);
}

/**
 * [Admin] Phê duyệt một yêu cầu mượn
 */
export async function duyetYeuCau(id: string) {
  return axios.patch(`${API_URL}/admin/borrow-requests/${id}/approve`);
}

/**
 * [Admin] Từ chối một yêu cầu mượn
 */
export async function tuChoiYeuCau(id: string) {
  return axios.patch(`${API_URL}/admin/borrow-requests/${id}/reject`);
}

// ================= API CHO USER =================

/**
 * [User] Tạo một yêu cầu mượn mới
 */
export async function addYeuCau(data: { device: string; borrowDate: Date; returnDate: Date }) {
  return axios.post(`${API_URL}/borrow-requests`, data);
}