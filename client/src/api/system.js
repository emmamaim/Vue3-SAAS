import request from '@/utils/request';

// 獲取系統初始化資料（部門、人才來源、職位類別）
export const systemInitService = () => {
  return request({
    url: '/system/init',
    method: 'get',
  });
};

// 獲取配置列表
export const getSystemSettingsService = (type) => {
  return request({
    url: `/system/settings/${type}`,
    method: 'get',
  });
};

// 新增或更新配置
export const saveSystemSettingService = (type, data) => {
  return request({
    url: `/system/settings/${type}`,
    method: 'post',
    data,
  });
};

// 刪除配置
export const deleteSystemSettingService = (type, id) => {
  return request({
    url: `/system/settings/${type}/${id}`,
    method: 'delete',
  });
};
