import { defineStore } from 'pinia'
// store不接觸localStorage -> 負責呼叫api
import { listTasks, createTask, updateTask, removeTask } from '@/modules/tasks/tasks.api.js'

export const useTasksStore = defineStore('tasks', {
  state: () => ({
    // 任務清單
    items: [],
    // loading動畫
    loading: false,
    // 若api失敗則顯示錯誤
    error: null,
  }),
  getters: {
    // 雙層箭頭函數：利用閉包進行資料篩選(私有化s)
    // 第一層(s)接收來自state的物件
    // 第二層(status)接收需要篩選的狀態標簽
    byStatus: (s) => (status) => s.items.filter((t) => t.status === status),
    // 先定義逾期 -> 根據時間動態篩選數據 -> 數據長度（個數）
    overdueCount: (s) => {
      const now = Date.now()
      return s.items.filter((t) => t.dueDate && Date.parse(t.dueDate) < now && t.status !== 'done')
        .length
    },
  },
  actions: {
    // 載入畫面抓取資料
    async fetchAll() {
      this.loading = true
      this.error = null
      // 顯示 Loading -> 呼叫api獲取資料 →
      // 成功(寫入資料)/失敗(存記錄) -> 最後强制關閉 loading
      try {
        this.items = await listTasks()
      } catch (e) {
        this.error = e
        this.items = []
      } finally {
        this.loading = false
      }
    },
    // 新增任務
    async add(payload) {
      const created = await createTask(payload)
      // 需更新this.items 陣列 -> 畫面更新
      this.items.unshift(created)
      return created
    },
    // 更新任務
    async patch(id, patch) {
      const updated = await updateTask(id, patch)
      const idx = this.items.findIndex((t) => t.id === id)
      if (idx !== -1) this.items[idx] = updated
      return updated
    },
    // 刪除任務
    async remove(id) {
      await removeTask(id)
      this.items = this.items.filter((p) => p.id !== id)
    },
  },
})
