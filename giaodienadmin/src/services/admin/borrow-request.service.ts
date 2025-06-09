import { request } from '@/utils/request';

export interface BorrowRequest {
  _id: string;
  userId: {
    _id: string;
    fullName: string;
    email: string;
  };
  deviceId: {
    _id: string;
    name: string;
    code: string;
  };
  reason: string;
  expectedReturnDate: string;
  status: 'pending' | 'approved' | 'rejected';
  adminNote?: string;
  createdAt: string;
  updatedAt: string;
}

export interface BorrowRequestParams {
  current?: number;
  pageSize?: number;
  status?: string;
}

export interface BorrowRequestResponse {
  data: BorrowRequest[];
  total: number;
  success: boolean;
}

export const getBorrowRequests = async (params?: BorrowRequestParams): Promise<BorrowRequestResponse> => {
  return request('/admin/borrow-requests', {
    method: 'GET',
    params,
  });
};

export const approveBorrowRequest = async (id: string, adminNote?: string): Promise<BorrowRequest> => {
  return request(`/admin/borrow-requests/${id}/approve`, {
    method: 'PATCH',
    data: { adminNote },
  });
};

export const rejectBorrowRequest = async (id: string, adminNote?: string): Promise<BorrowRequest> => {
  return request(`/admin/borrow-requests/${id}/reject`, {
    method: 'PATCH',
    data: { adminNote },
  });
};