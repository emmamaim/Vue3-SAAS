import axios, { type AxiosInstance, type AxiosResponse, type InternalAxiosRequestConfig, type AxiosRequestConfig } from 'axios';
import router from '@/router';
import { ElMessage } from 'element-plus';
import { useUserStore } from '@/stores';

// 開發環境
const isDev = import.meta.env.MODE === 'development';
const baseURL = '/api';
// 檔案專用
const fileHost = isDev ? 'http://168.138.210.30:3000' : '';

// 建立 axios實例
const service : AxiosInstance = axios.create({
  baseURL,
  timeout: 5000,
  // 允許跨域攜帶cookie
  withCredentials: true,
});

// Request 攔截器
service.interceptors.request.use(
  function (config: InternalAxiosRequestConfig) {
    return config;
  },
  function (error) {
    return Promise.reject(error);
  },
);

// 添加响应拦截器
service.interceptors.response.use(
  function (response: AxiosResponse) {
    // 直接回傳 response.data，少寫一層.data
    return response.data;
  },
  function (error) {
    // 攔截器只需要執行邏輯
    const userStore = useUserStore();

    // 統一處理401錯誤
    if (error.response?.status === 401) {
      // 清除過期資訊
      userStore.clearLocalData();
      if (router.currentRoute.value.path !== '/login') {
        router.push('/login');
        ElMessage.error('登入已過期，請重新登入');
      }
      return Promise.reject(error);
    }
    ElMessage.error(error.response?.data?.message || '服務異常');
    return Promise.reject(error);
  },
);

// 支援泛型的 request
const request = <T = unknown>(config: AxiosRequestConfig): Promise<T> => {
  // service.request 的第二個泛型參數決定了回傳的 Promise 型別
  return service.request<unknown, T>(config);
};


export default request;
export { baseURL, fileHost };
