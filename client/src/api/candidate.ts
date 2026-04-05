import request from '@/utils/request';
import type { ApiResponse, Candidate, CandidateDetail, CandidateQuery } from '@/types';

// 獲取應徵者列表
export const getCandidatesListService = (params: CandidateQuery) => {
  return request<ApiResponse<{ list: Candidate[] }>>({
    url: '/candidates',
    method: 'get',
    params,
  });
};

// 獲取單筆應徵者信息
export const getCandidateInfoService = (id: string) => {
  return request<ApiResponse<CandidateDetail>>({
    url: `/candidates/${id}`,
    method: 'get',
  });
};

// 新增應徵者
export const createCandidateService = (formData: FormData) => {
  return request<ApiResponse<{ id: string }>>({
    url: '/candidates',
    method: 'post',
    data: formData,
  });
};

// 更新應徵者
export const updateCandidateService = (id: string, formData: FormData) => {
  return request<ApiResponse<null>>({
    url: `/candidates/${id}`,
    method: 'put',
    data: formData,
  });
};

// 封存應徵者
export const archiveCandidateService = (id: string) => {
  return request<ApiResponse<null>>({
    url: `/candidates/${id}`,
    method: 'delete',
  });
};
