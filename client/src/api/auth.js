import request from '@/utils/request';

// 登入
export const userLoginService = (data) => {
  return request({
    url: '/auth/login',
    method: 'post',
    data,
  });
};

// 登出
export const userLogoutService = () => {
  return request({
    url: '/auth/logout',
    method: 'post',
  });
};

// 獲取當前登入者資訊
export const getMeService = () => {
  return request({
    url: '/auth/me',
    method: 'get',
  });
};
