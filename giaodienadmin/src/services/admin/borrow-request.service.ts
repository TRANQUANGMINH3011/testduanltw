
import { request } from '@/utils/request';

export interface BorrowRequest {
  id: string;
  _id: string;
  userId: string;
  deviceId: string;
  borrowDate: string;
  returnDate: string;
  status: 'pending' | 'approved' | 'rejected' | 'cancelled';
  purpose: string;
  note: string;
  createdAt: string;
  updatedAt: string;
  user: {
    _id: string;
    name: string;
    email: string;
    phone?: string;
    studentId?: string;
  };
  device: {
    _id: string;
    name: string;
    serialNumber: string;
    category: string;
    imageUrl?: string;
  };
}

export interface BorrowRequestParams {
  current?: number;
  pageSize?: number;
  status?: string;
  keyword?: string;
  userId?: string;
  deviceId?: string;
  sortField?: string;
  sortOrder?: 'ascend' | 'descend';
}

export interface BorrowRequestResponse {
  data: BorrowRequest[];
  total: number;
  current: number;
  pageSize: number;
}

export interface UpdateStatusRequest {
  status: 'approved' | 'rejected';
}

// Lấy tất cả yêu cầu mượn
export const getAllBorrowRequests = async (params?: BorrowRequestParams): Promise<BorrowRequestResponse> => {
  const response = await request('/admin/borrow-requests', {
    method: 'GET',
    params,
  });
  return response.data;
};

// Lấy chi tiết yêu cầu mượn
export const getBorrowRequestById = async (id: string): Promise<BorrowRequest> => {
  const response = await request(`/admin/borrow-requests/${id}`, {
    method: 'GET',
  });
  return response.data;
};

// Duyệt yêu cầu mượn
export const approveRequest = async (id: string): Promise<void> => {
  await request(`/admin/borrow-requests/${id}/approve`, {
    method: 'PATCH',
  });
};

// Từ chối yêu cầu mượn
export const rejectRequest = async (id: string): Promise<void> => {
  await request(`/admin/borrow-requests/${id}/reject`, {
    method: 'PATCH',
  });
};

// Trả thiết bị (Admin only)
export const returnDevice = async (id: string): Promise<void> => {
  await request(`/admin/borrow-requests/${id}/return`, {
    method: 'PATCH',
  });
};

// Lấy thống kê yêu cầu mượn
export const getBorrowRequestStatistics = async () => {
  const response = await request('/admin/borrow-requests/statistics', {
    method: 'GET',
  });
  return response.data;
};
