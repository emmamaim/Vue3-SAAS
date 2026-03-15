import request from '@/utils/request';

// 建立面試
export const createInterviewService = (data) => {
  return request({
    url: '/interviews',
    method: 'post',
    data,
  });
};

// 更新面試
export const updateInterviewService = (id, data) => {
  return request({
    url: `/interviews/${id}`,
    method: 'put',
    data,
  });
};

// 取消面試
export const cancelInterviewService = (id) => {
  return request({
    url: `/interviews/${id}`,
    method: 'delete',
  });
};
