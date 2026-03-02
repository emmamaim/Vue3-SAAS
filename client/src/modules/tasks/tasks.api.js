import { mockDB } from '@/services/mock/db'
import { delay, genId } from '@/services/mock/helpers'

// 任务列表
export async function listTasks() {
  await delay()
  return mockDB.get().tasks
}

// 新增任務
export async function createTask(payload) {
  await delay()
  const db = mockDB.get()
  const now = new Date().toISOString()
  const task = {
    id: genId('t'),
    title: payload.title?.trim() || 'Untitled',
    status: payload.status || 'todo',
    priority: payload.priority || 'medium',
    dueDate: payload.dueDate || null,
    createAt: now,
    updateAt: now,
    description: payload.description || '',
  }
  // 新任務放在最前面
  db.tasks.unshift(task)
  // 寫回 localStorage
  mockDB.set(db)
  // 回傳task (store/page可用)
  return task
}

// 更新任務(含移動狀態)
export async function updateTask(id, patch) {
  await delay()
  const db = mockDB.get()
  // 傳入需要更新的任務id -> 找出此id的位置
  const idx = db.tasks.findIndex((t) => t.id === id)
  // 找不到idx 就丟錯誤 -> id不存在
  if (idx === -1) throw new Error('Task not found')
  const now = new Date().toISOString()
  // 新物件 = { ...舊物件, ...修改內容, 新增屬性: 值 }
  // 展開舊資料 -> 合併新修改 -> 強制更新時間
  db.tasks[idx] = { ...db.tasks[idx], ...patch, updateAt: now }
  mockDB.set(db)
  return db.tasks[idx]
}

// 刪除任務
export async function removeTask(id) {
  await delay()
  const db = mockDB.get()
  // 篩選除此任務id外的所有任務
  db.tasks = db.tasks.filter((t) => t.id !== id)
  mockDB.set(db)
  return true
}
