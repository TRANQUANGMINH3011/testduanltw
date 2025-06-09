import axios from '@/utils/axios';

export async function registerUser(data: {
  name: string;
  username: string;
  password: string
}) {
  return axios('http://localhost:3456/user/auth/register', {
    method: 'POST',
    data,
  });
}

export async function loginUser(data: { username: string; password: string }) {
  return axios('http://localhost:3456/user/auth/login', {
    method: 'POST',
    data: {
      username: data.username,
      password: data.password,
    },
  });
}

export async function loginAdmin(data: { username: string; password: string }) {
  return axios('http://localhost:3456/admin/auth/login', {
    method: 'POST',
    data: {
      email: data.username, // Changed from phone to email
      password: data.password,
    },
  });
}

export async function logoutUser() {
  return axios('http://localhost:3456/user/auth/logout', {
    method: 'POST',
  });
}
