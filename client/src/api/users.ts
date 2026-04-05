import request from '@/utils/request';
import type { UserList, RegisterParams, ApiResponse, UserQuery, UserOption } from '@/types';

// 獲取HR列表
export const getHrListService = () => {
  return request<ApiResponse<UserOption[]>>({
    url: '/users/hr-list',
    method: 'get',
  });
};

// 獲取面試官列表
export const getInterviewerListService = () => {
  return request<ApiResponse<UserOption[]>>({
    url: '/users/interviewer-list',
    method: 'get',
  });
};

// 管理員
// 獲取用戶列表
export const userListService = (params: UserQuery) => {
  return request<ApiResponse<UserList[]>>({
    url: '/users',
    method: 'get',
    params,
  });
};

// 注冊用戶
export const userCreateService = (data: RegisterParams) => {
  return request<ApiResponse<UserList>>({
    url: '/users',
    method: 'post',
    data,
  });
};

// 更新用戶信息
export const userUpdateService = (id: string, data: Partial<RegisterParams>) => {
  return request<ApiResponse<UserList>>({
    url: `/users/${id}`,
    method: 'put',
    data,
  });
};

// 停用/啓用用戶
export const userUpdateStatusService = (id: string, status: 'active' | 'disabled') => {
  return request<ApiResponse<null>>({
    url: `/users/${id}/status`,
    method: 'patch',
    data: { status },
  });
};
