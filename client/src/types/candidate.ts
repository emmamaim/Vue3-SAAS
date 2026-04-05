import type { Interview } from './interview';

// 應徵者狀態枚舉
export type CandidateStatus =
  | 'pending'
  | 'screening'
  | 'interviewing'
  | 'offer'
  | 'hired'
  | 'rejected';

// 查詢參數
export interface CandidateQuery {
  page: number;
  pageSize: number;
  keyword?: string;
  dept_id?: number;
  source_id?: number;
  category_id?: number;
  status?: CandidateStatus;
  hr_id?: string;
}

// 應征者列表
export interface Candidate {
  id: string;
  name: string;
  job_id: number;
  email: string | null;
  phone: string | null;
  resume_url: string | null;
  dept_id: number;
  source_id: number | null;
  category_id: number | null;
  status: CandidateStatus;
  hr_id: string | null;
  is_active: number;
  createAt: string;
  dept_name?: string;
  source_name?: string;
  category_name?: string;
  position_name?: string;
  hr_name?: string;
  interviews?: Interview[]
}

// 應征者詳情
export interface CandidateDetail extends Candidate {
  responsible_hr_name?: string;
  interviews: Interview[];
}
