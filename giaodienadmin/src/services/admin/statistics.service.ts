
import { request } from '@/utils/request';

export interface AdminOverviewStatistics {
  totalDevices: number;
  availableDevices: number;
  borrowedDevices: number;
  maintenanceDevices: number;
  brokenDevices: number;
  totalUsers: number;
  activeUsers: number;
  pendingRequests: number;
  approvedRequests: number;
  rejectedRequests: number;
  overdueRecords: number;
  dueSoonRecords: number;
  totalBorrowRecords: number;
  returnedRecords: number;
}

export interface TopBorrowedDevice {
  _id: string;
  name: string;
  code: string;
  borrowCount: number;
  category: string;
}

export interface OverdueDevice {
  _id: string;
  deviceId: {
    _id: string;
    name: string;
    code: string;
  };
  userId: {
    _id: string;
    fullName: string;
    email: string;
  };
  borrowDate: string;
  expectedReturnDate: string;
  daysOverdue: number;
  status: string;
}

export interface DueSoonDevice {
  _id: string;
  deviceId: {
    _id: string;
    name: string;
    code: string;
  };
  userId: {
    _id: string;
    fullName: string;
    email: string;
  };
  borrowDate: string;
  expectedReturnDate: string;
  daysUntilDue: number;
  status: string;
}

export interface MonthlyStatistics {
  month: string;
  borrowCount: number;
  returnCount: number;
  newDevices: number;
  newUsers: number;
}

// Sử dụng đúng endpoints từ backend
export const getAdminOverviewStatistics = async (): Promise<AdminOverviewStatistics> => {
  return request('/admin/statistics/overview', { method: 'GET' });
};

export const getTopBorrowedDevices = async (limit: number = 10): Promise<TopBorrowedDevice[]> => {
  return request(`/admin/stats/top-borrowed?limit=${limit}`, { method: 'GET' });
};

export const getOverdueDevices = async (): Promise<OverdueDevice[]> => {
  return request('/admin/stats/overdue', { method: 'GET' });
};

export const getDueSoonDevices = async (): Promise<DueSoonDevice[]> => {
  return request('/admin/stats/due-soon', { method: 'GET' });
};

export const getMonthlyStatistics = async (months: number = 12): Promise<MonthlyStatistics[]> => {
  return request(`/admin/statistics/monthly?months=${months}`, { method: 'GET' });
};
