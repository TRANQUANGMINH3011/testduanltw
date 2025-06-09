
import axios from '@/utils/axios';

export interface Device {
  id: string;
  name: string;
  serialNumber: string;
  category: string;
  status: 'available' | 'borrowed' | 'maintenance' | 'broken' | 'lost';
  location: string;
  description?: string;
  quantity: number;
  imageUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export interface DeviceListParams {
  current?: number;
  pageSize?: number;
  keyword?: string;
}

export interface DeviceListResponse {
  data: Device[];
  current: number;
  pageSize: number;
  total: number;
}

export interface CreateDeviceRequest {
  name: string;
  serialNumber: string;
  category: string;
  location: string;
  description?: string;
  quantity: number;
  imageUrl?: string;
}

export interface UpdateDeviceRequest extends Partial<CreateDeviceRequest> {
  status?: Device['status'];
}

// Lấy danh sách thiết bị (admin có thể xem tất cả)
export const getDevices = async (params: DeviceListParams = {}): Promise<DeviceListResponse> => {
  const response = await axios.get('/admin/devices', { params });
  return {
    data: Array.isArray(response.data) ? response.data : [],
    current: params.current || 1,
    pageSize: params.pageSize || 10,
    total: Array.isArray(response.data) ? response.data.length : 0,
  };
};

// Lấy chi tiết thiết bị theo ID
export const getDeviceById = async (id: string): Promise<Device> => {
  const response = await axios.get(`/admin/devices/${id}`);
  return response.data;
};

// Tạo thiết bị mới
export const createDevice = async (device: CreateDeviceRequest): Promise<Device> => {
  const response = await axios.post('/admin/devices', device);
  return response.data;
};

// Cập nhật thiết bị
export const updateDevice = async (id: string, device: UpdateDeviceRequest): Promise<Device> => {
  const response = await axios.put(`/admin/devices/${id}`, device);
  return response.data;
};

// Xóa thiết bị
export const deleteDevice = async (id: string): Promise<void> => {
  await axios.delete(`/admin/devices/${id}`);
};

// Thống kê thiết bị
export interface DeviceStatistics {
  total: number;
  available: number;
  borrowed: number;
  maintenance: number;
  broken: number;
  lost: number;
}

export const getDeviceStatistics = async (): Promise<DeviceStatistics> => {
  const response = await axios.get('/admin/devices/statistics');
  return response.data;
};
