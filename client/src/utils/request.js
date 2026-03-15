import axios from 'axios';
import router from '@/router';
import { ElMessage } from 'element-plus';

const baseURL = 'http://168.138.210.30:3000/api';

// 建立 axios實例
const service = axios.create({
  baseURL,
  // 超過五秒沒回應就中斷
  timeout: 5000,
});

// Request 攔截器(請求前token驗證)
service.interceptors.request.use(
  function (config) {
    // 1. 從localStorage取得token
    const token = localStorage.getItem('token');
    // 2. token存在 => 放入Authorization Header
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
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
    // 統一處理401錯誤
    if (error.response?.status === 401) {
      // 清除過期資訊
      localStorage.clear();
      // 强制跳轉登入頁
      router.push('/login');
    }
    ElMessage.error(error.response?.data?.message || '服務異常');
    return Promise.reject(error);
  },
);

export default service;
export { baseURL };
