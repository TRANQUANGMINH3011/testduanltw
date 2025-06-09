import { request } from '@/utils/request';

export interface Device {
  _id: string;
  name: string;
  code: string;
  category: string;
  description?: string;
  status: 'available' | 'borrowed' | 'maintenance' | 'broken';
  location?: string;
  specifications?: any;
  purchaseDate?: string;
  warrantyExpiry?: string;
  createdAt: string;
  updatedAt: string;
}

export interface DeviceParams {
  current?: number;
  pageSize?: number;
  name?: string;
  category?: string;
  status?: string;
}

export interface DeviceResponse {
  data: Device[];
  total: number;
  success: boolean;
}

export const getDevices = async (params?: DeviceParams): Promise<DeviceResponse> => {
  return request('/admin/devices', {
    method: 'GET',
    params,
  });
};

export const getDeviceById = async (id: string): Promise<Device> => {
  return request(`/admin/devices/${id}`, {
    method: 'GET',
  });
};

export const createDevice = async (device: Partial<Device>): Promise<Device> => {
  return request('/admin/devices', {
    method: 'POST',
    data: device,
  });
};

export const updateDevice = async (id: string, device: Partial<Device>): Promise<Device> => {
  return request(`/admin/devices/${id}`, {
    method: 'PUT',
    data: device,
  });
};

export const deleteDevice = async (id: string): Promise<void> => {
  return request(`/admin/devices/${id}`, {
    method: 'DELETE',
  });
};