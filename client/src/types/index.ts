export * from './landing';
export * from './dashboard';
export * from './user';
export * from './system';
export * from './candidate';
export * from './interview';
export * from './booking';
export * from './task';

export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  // 登入或獲取個人資訊時用
  user?: T; 
  // 資料主體
  data?: T;
  // 分頁用
  total?: number;
  page?: number;
  pageSize?: number;
  // 看板顯示
  updatedAt?: string;
}