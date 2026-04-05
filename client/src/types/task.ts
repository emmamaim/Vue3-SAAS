// 任務
export interface Task {
  id: string;
  user_id: string;
  title: string;
  status: 'todo' | 'done';
  priority: 'low' | 'medium' | 'high';
  description: string | null;
  dueDate: string;
  interview_id?: string;
  candidate_id?: string;
  interview_round?: number;
  location?: string;
  result?: 'pass' | 'fail' | 'pending';
  comments?: string | null;
  createdAt?: string;
  updatedAt?: string;
}

// 提交面試評價
export interface TaskFeedbackPayload {
  result: 'pass' | 'fail' | 'pending';
  comments: string;
}

// 更新任務狀態
export interface UpdateTaskStatusPayload {
  status: 'todo' | 'done';
}