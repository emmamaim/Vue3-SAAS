// 面試記錄
export interface Interview {
  id: string;
  candidate_id: string | number;
  interviewer_id: string;
  hr_id: string;
  dept_id: number;
  interview_round: number;
  date: string;
  startTime: string;
  endTime: string;
  location: string;
  status: 'scheduled' | 'completed' | 'cancelled';
  result: 'pass' | 'fail' | 'pending';
  comments: string | null;
  
  // 以下為多表關聯（JOIN）產生的額外欄位
  interviewer_name?: string;
  creator_hr_name?: string;
  position_name?: string;
  booking_id: string;
  task_id: string;
  createdAt?: string;
  updatedAt: string;
}

// 建立面試
export interface CreateInterviewPayload {
  candidate_id: string;
  interviewer_id: string;
  dept_id: number;
  interview_round: number;
  date: string;
  startTime: string;
  endTime: string;
  location?: string;
  title?: string;
}

// 更新面試
export interface UpdateInterviewPayload {
  interviewer_id?: string;
  interview_round?: number;
  date?: string;
  startTime?: string;
  endTime?: string;
  location?: string;
  title?: string;
  status?: 'scheduled' | 'completed' | 'cancelled';
  result?: 'pass' | 'fail' | 'pending';
  comments?: string | null;
}
