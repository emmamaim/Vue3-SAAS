import request from '@/utils/request';

// 獲取系統初始化資料（部門、人才來源、職位類別）
export const systemInitService = () => {
  return request({
    url: '/system/init',
    method: 'get',
  });
};