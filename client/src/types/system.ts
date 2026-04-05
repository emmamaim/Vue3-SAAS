export interface BaseOptions {
  id: number;
  name: string;
}

// 職位類別
export interface JobOption extends BaseOptions {
  category_id: number;
}

// 系統初始化
export interface SystemInitData {
  departments: BaseOptions[];
  sources: BaseOptions[];
  job_categories: BaseOptions[];
  jobs: JobOption[];
}

// 部門
export interface DepartmentItem {
  id: number;
  name: string;
  manager_id: number | null;
  manager_name?: string | null;
  description?: string;
}

// 職位
export interface JobItem {
  id: number;
  category_id: number;
  category_name?: string;
  job_name: string;
  description?: string;
}

// 人才來源
export interface SourceItem {
  id: number;
  name: string;
  type: 'External' | 'Internal' | 'Campus';
  createAt?: string;
  updateAt?: string;
}
