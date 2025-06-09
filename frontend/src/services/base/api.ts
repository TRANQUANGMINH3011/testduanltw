import axios from '@/utils/axios';
import type { ESettingKey } from './constant';
import type { ISetting } from './typing';

// Đăng nhập cho admin
export async function adminlogin(payload: { username?: string; password?: string }) {
	return axios.post('/api/v1/admin/auth/login', { ...payload, platform: 'Web' });
}

// Lấy thông tin user hiện tại
export async function getUserInfo() {
	return axios.get('/api/v1/admin/auth/me');
}

// Đăng xuất
export async function logout() {
	return axios.post('/api/v1/admin/auth/logout');
}

// Cài đặt
export async function getSettingByKey(key: ESettingKey) {
	return axios.get(`/api/v1/admin/setting/${key}/value`);
}

export async function putSetting(data: ISetting) {
	return axios.put(`/api/v1/admin/setting/value`, data);
}

export async function getByKey(key: ESettingKey) {
	return axios.get(`/api/v1/admin/setting/one`, { params: { condition: { key: key } } });
}

export async function updateSetting(id: string, payload: { key: ESettingKey; value: any }) {
	return axios.put(`/api/v1/admin/setting/${id}`, payload);
}

export async function createSetting(payload: { key: ESettingKey; value: any }) {
	return axios.post(`/api/v1/admin/setting`, payload);
}

/**
 * Dùng để đăng nhập cho admin qua form username/password.
 */
export async function loginWithPassword(body: API.LoginParams) {
  return axios.post('/api/v1/admin/auth/login', body).then(res => res.data);
}

/**
 * Dùng để lấy thông tin admin từ backend.
 */
export async function getCurrentUserFromApi() {
  return axios.get('/api/v1/admin/auth/me').then(res => ({ data: res.data.data }));
}

/**
 * Dùng để đăng xuất khỏi backend.
 */
export async function logoutFromApi() {
    return axios.post('/api/v1/admin/auth/logout');
}