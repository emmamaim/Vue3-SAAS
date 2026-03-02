import request from '@/utils/request'

// 任务列表
export async function listTasks() {
  return request({
    url: '/tasks', // 我們目前的測試路徑
    method: 'get',
  })
}

// 新增任務
export async function createTask(payload) {
  return request({
    url: '/tasks',
    method: 'post',
    data: payload,
  })
}

// 更新任務(含移動狀態)
export async function updateTask(id, patch) {
  return request({
    url: `/tasks/${id}`,
    method: 'patch',
    data: patch,
  })
}

// 刪除任務
export async function removeTask(id) {
  return request({
    url: `/tasks/${id}`,
    method: 'delete',
  })
}
