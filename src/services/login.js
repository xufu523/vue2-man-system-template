import { post } from '@/utils/http';

export function login(data = {}) {
  return post('/api/login', data);
}

export function logout(data = {}) {
  return post('/api/logout', data);
}
