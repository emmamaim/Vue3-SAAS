import request from '@/utils/request';

// 用戶登入
export const userLoginService = (data) => {
  return request({
    url: '/users/login',
    method: 'post',
    data,
  });
};

// 獲取HR列表
export const getHrListService = () => {
  return request({
    url: '/users/hr-list',
    method: 'get',
  });
};

// 管理員
// 獲取用戶列表
export const userListService = (params) => {
  return request({
    url: '/users',
    method: 'get',
    params,
  });
};

// 注冊用戶
export const userCreateService = (data) => {
  return request({
    url: '/users',
    method: 'post',
    data,
  });
};

// 更新用戶信息
export const userUpdateService = (id, data) => {
  return request({
    url: `/users/${id}`,
    method: 'put',
    data,
  });
};

// 停用/啓用用戶
export const userUpdateStatusService = (id, status) => {
  return request({
    url: `/users/${id}/status`,
    method: 'patch',
    data: { status },
  });
};
