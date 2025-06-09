
import { request } from '@/utils/request';

export interface BorrowRecord {
  _id: string;
  borrowRequestId: string;
  userId: string;
  deviceId: string;
  borrowDate: string;
  returnDate: string;
  actualReturnDate?: string;
  status: 'borrowed' | 'returned' | 'overdue';
  note: string;
  createdAt: string;
  updatedAt: string;
  borrowRequest: {
    _id: string;
    purpose: string;
    note: string;
  };
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

export interface BorrowRecordParams {
  current?: number;
  pageSize?: number;
  status?: string;
  keyword?: string;
  userId?: string;
  deviceId?: string;
  startDate?: string;
  endDate?: string;
  overdue?: boolean;
  sortField?: string;
  sortOrder?: 'ascend' | 'descend';
}

export interface BorrowRecordResponse {
  data: BorrowRecord[];
  total: number;
  current: number;
  pageSize: number;
}

export interface BorrowRecordStatistics {
  totalBorrowed: number;
  totalReturned: number;
  totalOverdue: number;
  dueSoon: number;
}

// Lấy tất cả bản ghi mượn trả
export const getAllBorrowRecords = async (params?: BorrowRecordParams): Promise<BorrowRecordResponse> => {
  const response = await request('/admin/borrow-records', {
    method: 'GET',
    params,
  });
  return response.data;
};

// Lấy chi tiết bản ghi mượn trả
export const getBorrowRecordById = async (id: string): Promise<BorrowRecord> => {
  const response = await request(`/admin/borrow-records/${id}`, {
    method: 'GET',
  });
  return response.data;
};

// Xác nhận trả thiết bị
export const confirmReturnDevice = async (id: string): Promise<void> => {
  await request(`/admin/borrow-records/${id}/return`, {
    method: 'PATCH',
  });
};

// Lấy thống kê bản ghi mượn trả
export const getBorrowRecordStatistics = async (): Promise<BorrowRecordStatistics> => {
  const response = await request('/admin/borrow-records/statistics', {
    method: 'GET',
  });
  return response.data;
};

// Lấy danh sách thiết bị quá hạn
export const getOverdueBorrowRecords = async (params?: BorrowRecordParams): Promise<BorrowRecordResponse> => {
  const response = await request('/admin/borrow-records/overdue', {
    method: 'GET',
    params,
  });
  return response.data;
};

// Lấy danh sách thiết bị sắp đến hạn
export const getDueSoonBorrowRecords = async (days: number = 3): Promise<BorrowRecordResponse> => {
  const response = await request(`/admin/borrow-records/due-soon?days=${days}`, {
    method: 'GET',
  });
  return response.data;
};

// Gửi email nhắc nhở
export const sendReminderEmail = async (id: string): Promise<void> => {
  await request(`/admin/borrow-records/${id}/send-reminder`, {
    method: 'POST',
  });
};
