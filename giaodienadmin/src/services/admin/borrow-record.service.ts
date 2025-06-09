import { request } from '@/utils/request';

export interface BorrowRecord {
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
  borrowDate: string;
  expectedReturnDate: string;
  actualReturnDate?: string;
  status: 'borrowed' | 'returned' | 'overdue';
  borrowNote?: string;
  returnNote?: string;
  createdAt: string;
  updatedAt: string;
}

export interface BorrowRecordParams {
  current?: number;
  pageSize?: number;
  status?: string;
}

export interface BorrowRecordResponse {
  data: BorrowRecord[];
  total: number;
  success: boolean;
}

export const getBorrowRecords = async (params?: BorrowRecordParams): Promise<BorrowRecordResponse> => {
  return request('/admin/borrow-records', {
    method: 'GET',
    params,
  });
};

export const confirmReturn = async (id: string, returnNote?: string): Promise<BorrowRecord> => {
  return request(`/admin/borrow-records/${id}/return`, {
    method: 'PATCH',
    data: { returnNote },
  });
};

export const getOverdueRecords = async (): Promise<BorrowRecordResponse> => {
  return request('/admin/borrow-records/overdue', {
    method: 'GET',
  });
};
`