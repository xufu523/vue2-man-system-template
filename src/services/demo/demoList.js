import { post } from '@/utils/http';

export function getList(data = {}) {
  return post('/api/list', data);
}

export function getInfo(data = {}) {
  return post('/api/info', data);
}

export function add(data = {}) {
  return post('/api/add', data);
}

export function edit(data = {}) {
  return post('/api/edit', data);
}

export function remove(data = {}) {
  return post('/api/remove', data);
}
