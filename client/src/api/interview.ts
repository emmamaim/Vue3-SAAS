import request from '@/utils/request';
import type { CreateInterviewPayload, UpdateInterviewPayload, ApiResponse } from '@/types';

// 建立面試
export const createInterviewService = (
  data: CreateInterviewPayload,
): Promise<ApiResponse<void>> => {
  return request<ApiResponse<void>>({
    url: '/interviews',
    method: 'post',
    data,
  });
};

// 更新面試
export const updateInterviewService = (
  id: string,
  data: UpdateInterviewPayload,
): Promise<ApiResponse<void>> => {
  return request<ApiResponse<void>>({
    url: `/interviews/${id}`,
    method: 'patch',
    data,
  });
};

// 取消面試
export const cancelInterviewService = (id: string): Promise<ApiResponse<void>> => {
  return request<ApiResponse<void>>({
    url: `/interviews/${id}`,
    method: 'delete',
  });
};
