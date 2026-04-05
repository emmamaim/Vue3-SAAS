import request from '@/utils/request';
import type { Task, TaskFeedbackPayload, ApiResponse, UpdateTaskStatusPayload } from '@/types';

// 獲取任務列表
export const getTasksService = () => {
  return request<ApiResponse<Task[]>>({
    url: '/tasks',
    method: 'get',
  });
};

// 完成任務（提交面試評價）
export const completeInterviewService = (taskId: string, data: TaskFeedbackPayload) => {
  return request<ApiResponse<Task>>({
    url: `/tasks/${taskId}/completed`,
    method: 'patch',
    data,
  });
};

// 更新任務狀態
export const updateTaskStatusService = (id: string, status: UpdateTaskStatusPayload) => {
  return request<ApiResponse<Task>>({
    url: `/tasks/${id}/status`,
    method: 'patch',
    data: { status },
  });
};
