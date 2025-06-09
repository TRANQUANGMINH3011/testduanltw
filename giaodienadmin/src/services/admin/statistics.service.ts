
import axios from '@/utils/axios';

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

export const getAdminOverviewStatistics = async (): Promise<AdminOverviewStatistics> => {
  const response = await axios.get('/admin/statistics/overview');
  return response.data;
};

export const getTopBorrowedDevices = async (limit: number = 10): Promise<TopBorrowedDevice[]> => {
  const response = await axios.get(`/admin/stats/top-borrowed?limit=${limit}`);
  return response.data;
};

export const getOverdueDevices = async (): Promise<OverdueDevice[]> => {
  const response = await axios.get('/admin/stats/overdue');
  return response.data;
};

export const getDueSoonDevices = async (): Promise<DueSoonDevice[]> => {
  const response = await axios.get('/admin/stats/due-soon');
  return response.data;
};

export const getMonthlyStatistics = async (months: number = 12): Promise<MonthlyStatistics[]> => {
  const response = await axios.get(`/admin/statistics/monthly?months=${months}`);
  return response.data;
};
