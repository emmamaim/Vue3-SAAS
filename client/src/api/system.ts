import request from '@/utils/request';
import type { SystemInitData, DepartmentItem, JobItem, SourceItem, ApiResponse } from '@/types';

// 獲取系統初始化資料（部門、人才來源、職位類別）
export const systemInitService = () => {
  return request<ApiResponse<SystemInitData>>({
    url: '/system/init',
    method: 'get',
  });
};

// 獲取配置列表
export const getSystemSettingsService = <T>(type: string) => {
  return request<ApiResponse<T[]>>({
    url: `/system/settings/${type}`,
    method: 'get',
  });
};

// 新增或更新配置
type SavePayload = Partial<DepartmentItem & JobItem & SourceItem>
export const saveSystemSettingService = (type: string, data: SavePayload) => {
  return request<ApiResponse<null>>({
    url: `/system/settings/${type}`,
    method: 'post',
    data,
  });
};

// 刪除配置
export const deleteSystemSettingService = (type: string, id: number) => {
  return request<ApiResponse<null>>({
    url: `/system/settings/${type}/${id}`,
    method: 'delete',
  });
};
