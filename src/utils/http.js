import axios from 'axios';
import qs from 'qs';
import { message } from 'ant-design-vue';
import service from '../configs/service';

// 把对象转换为FormData
const toFormData = originData => {
  if (!originData) return null;

  const newFormData = new FormData();
  function transformToFormData(formData, data, parentKey) {
    if (data && typeof data === 'object' && !(data instanceof Date) && !(data instanceof window.File)) {
      Object.keys(data).forEach(key => {
        let tempKey;
        if (Array.isArray(data)) {
          tempKey = parentKey ? `${parentKey}[${key}]` : key;
        } else {
          tempKey = parentKey ? `${parentKey}.${key}` : key;
        }
        transformToFormData(formData, data[key], tempKey);
      });
    } else {
      const value = data === null ? '' : data;
      formData.append(parentKey, value);
    }
  }
  transformToFormData(newFormData, originData);
  return newFormData;
};

// 创建axios实例
const instance = axios.create({ baseURL: service.domain, timeout: 300 * 1000 });

// 添加请求拦截器
instance.interceptors.request.use(
  config => {
    // 在发送请求之前做些什么
    const { contentType = 'json', data, ...axiosConfig } = config;
    const token = localStorage.getItem('token');

    if (contentType === 'form') {
      axiosConfig.data = qs.stringify(data, { encode: false });
    } else if (contentType === 'json') {
      axiosConfig.data = data;
    } else if (contentType === 'formData') {
      axiosConfig.data = toFormData(data);
    }

    if (token) {
      axiosConfig.headers.token = token;
    }

    return axiosConfig;
  },
  error => Promise.reject(error),
);

// 添加响应拦截器
instance.interceptors.response.use(
  ({ status, data = {} }) => {
    const code = Number(data.code);

    if (status !== 200 || code !== 0) {
      let msg = data.msg || '服务异常';

      if (code === 401 || code === 403) {
        msg = '登录超时，请重新登录';
        window.location.hash = '/login';
      }

      message.error(msg);

      return Promise.reject(data);
    }

    if (Object.prototype.hasOwnProperty.call(data, 'data')) {
      return data.data;
    }

    return data;
  },
  error => {
    // 对响应错误做点什么
    if (error.toString().includes('timeout')) {
      message.error('请求超时，请稍后重试');
    } else if (error.message === 'Network Error') {
      message.error('网络错误或服务异常');
    } else if (error.response) {
      const { message: httpMessage } = error;
      const { status, data } = error.response;
      let msg = data && data.msg ? data.msg : httpMessage;

      if (status === 401 || status === 403) {
        msg = '登录超时，请重新登录';
        window.location.hash = '/login';
      }

      message.error(msg);
    } else {
      message.error('系统异常，请联系管理员');
    }

    return Promise.reject(error);
  },
);

/**
 * 封装post方法
 * 参数参照axios, config参数拓展了一个 contentType String类型参数  'form'|json'|'formData'
 */
export function post(url, data = {}, config) {
  return instance.post(url, data, config);
}

/**
 * 封装put方法
 * 参数参照axios, config参数拓展了一个 contentType String类型参数  'form'|json'|'formData'
 */
export function put(url, data = {}, config) {
  return instance.put(url, data, config);
}

/**
 * 封装get方法
 * 参数参照axios
 */
export function get(url, config) {
  return instance.get(url, config);
}

/**
 * 封装delete方法
 * 参数参照axios
 */
export function deleteReq(url, config) {
  return instance.delete(url, config);
}
