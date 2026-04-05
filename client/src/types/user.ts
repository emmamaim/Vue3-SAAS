export type UserRole = 'super_admin' | 'dept_hr' | 'interviewer';
export type UserStatus = 'active' | 'disabled';

export interface User {
  id: string;
  username: string;
  real_name: string;
  role: UserRole;
  dept_name?: string | null;
}

// 登入
export interface LoginParams {
  username: string;
  password: string;
}

// 註冊
export interface RegisterParams {
  username: string;
  password: string;
  real_name: string;
  role?: UserRole;
  dept_id?: number;
}

// 定義下拉選單的通用型別
export interface UserOption {
  value: string;
  label: string;
  dept_id?: number; // 面試官
}

// 用戶列表查詢參數
export interface UserQuery {
  page: number;
  pageSize: number;
  dept_id?: number | null;
  role?: UserRole; 
  status?: UserStatus;
}

// 用戶列表
export interface UserList extends User {
  dept_id: number | null;
  status: UserStatus;
  last_login: string | null;
  createAt: string;
  updateAt?: string;
}


