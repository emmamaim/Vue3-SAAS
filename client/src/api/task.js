import request from '@/utils/request';

// 獲取任務列表
export const getTasksService = () => {
  return request({
    url: '/tasks',
    method: 'get',
  });
};

// 完成任務（提交面試評價）
export const completeInterviewService = (taskId, data) => {
  return request({
    url: `/tasks/${taskId}/completed`,
    method: 'patch',
    data,
  });
};

// 更新任務狀態
export const updateTaskStatusService = (id, status) => {
  return request({
    url: `/tasks/${id}/status`,
    method: 'patch',
    data: { status },
  });
};
