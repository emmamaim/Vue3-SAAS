import request from '@/utils/request';
import type { ApiResponse, LoginParams, User } from '@/types';

// 登入
export const userLoginService = (data: LoginParams) => {
  return request<ApiResponse<User>>({
    url: '/auth/login',
    method: 'post',
    data,
  });
};

// 登出
export const userLogoutService = () => {
  return request<ApiResponse<null>>({
    url: '/auth/logout',
    method: 'post',
  });
};

// 獲取當前登入者資訊
export const getMeService = () => {
  return request<ApiResponse<User>>({
    url: '/auth/me',
    method: 'get',
  });
};
