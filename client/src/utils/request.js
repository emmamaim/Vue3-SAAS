import axios from 'axios';
import router from '@/router';
import { ElMessage } from 'element-plus';
import { useUserStore } from '@/stores';

// 開發環境
const isDev = import.meta.env.MODE === 'development';
const baseURL = '/api';
// 檔案專用
const fileHost = isDev ? 'http://168.138.210.30:3000' : '';

// 建立 axios實例
const service = axios.create({
  baseURL,
  // 超過五秒沒回應就中斷
  timeout: 5000,
  // 允許跨域攜帶cookie
  withCredentials: true,
});

// Request 攔截器(請求前token驗證)
service.interceptors.request.use(
  function (config) {
    return config;
  },
  function (error) {
    return Promise.reject(error);
  },
);

// 添加响应拦截器
service.interceptors.response.use(
  function (response) {
    // 直接回傳 response.data，少寫一層.data
    return response.data;
  },
  function (error) {
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

export default service;
export { baseURL, fileHost };
