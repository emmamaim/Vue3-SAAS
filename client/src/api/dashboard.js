import request from '@/utils/request';

// 管理員
export const getAdminDashboard = () => {
  return request({
    url: '/dashboard/admin',
    method: 'get',
  });
};

// HR
export const getHrDashboard = () => {
  return request({
    url: '/dashboard/hr',
    method: 'get',
  });
};

// 面試官
export const getInterviewerDashboard = () => {
  return request({
    url: '/dashboard/interviewer',
    method: 'get',
  });
};
