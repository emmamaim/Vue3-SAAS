import request from '@/utils/request';
// 獲取應徵者列表
export const getCandidatesListService = (params) => {
  return request({
    url: '/candidates',
    method: 'get',
    params,
  });
};

// 獲取單筆應徵者信息
export const getCandidateInfoService = (id) => {
  return request({
    url: `/candidates/${id}`,
    method: 'get',
  });
};

// 新增應徵者
export const createCandidateService = (formData) => {
  return request({
    url: '/candidates',
    method: 'post',
    data: formData,
    // Axios 會自動處理 headers
    // headers: {
    //   'Content-Type': 'multipart/form-data',
    // },
  });
};
