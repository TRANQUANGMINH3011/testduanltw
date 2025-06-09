import axios from '@/utils/axios';

/**
 * [Admin] Lấy danh sách bản ghi mượn trả
 */
export async function getMuonTra(params: {
  current?: number;
  pageSize?: number;
  status?: string;
}) {
  return axios.get('/api/v1/admin/borrow-records', { params }).then((res) => res.data);
}

/**
 * [Admin] Lấy chi tiết bản ghi mượn trả
 */
export async function getMuonTraDetail(id: string) {
  return axios.get(`/api/v1/admin/borrow-records/${id}`).then((res) => res.data);
}

/**
 * [Admin] Cập nhật trạng thái mượn trả
 */
export async function updateMuonTra(id: string, data: any) {
  return axios.put(`/api/v1/admin/borrow-records/${id}`, data);
}