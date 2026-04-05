import request from '@/utils/request';
import type {
  ApiResponse,
  AdminDashboardData,
  HrDashboardData,
  InterviewerDashboardData,
} from '@/types';

// 管理員
export const getAdminDashboard = () => {
  return request<ApiResponse<AdminDashboardData>>({
    url: '/dashboard/admin',
    method: 'get',
  });
};

// HR
export const getHrDashboard = () => {
  return request<ApiResponse<HrDashboardData>>({
    url: '/dashboard/hr',
    method: 'get',
  });
};

// 面試官
export const getInterviewerDashboard = () => {
  return request<ApiResponse<InterviewerDashboardData>>({
    url: '/dashboard/interviewer',
    method: 'get',
  });
};
