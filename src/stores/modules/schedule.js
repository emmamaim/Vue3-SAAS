import { defineStore } from 'pinia'
import {
  listBookings,
  createBooking,
  updateBooking,
  removeBooking,
} from '@/modules/schedule/schedule.api.js'

export const useScheduleStore = defineStore('schedule', {
  state: () => ({
    items: [],
    loading: false,
    error: null,
  }),
  getters: {
    // 近期行程（未來）
    upcoming: (s) => {
      // 防呆處理
      const items = Array.isArray(s.items) ? s.items : []
      const today = new Date().toISOString().slice(0, 10)
      return items.filter((b) => b.date >= today)
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
        this.items = await listBookings()
      } catch (e) {
        this.error = e
      } finally {
        this.loading = false
      }
    },
    // 新增預約
    async add(payload) {
      const created = await createBooking(payload)
      // 需更新this.items 陣列 -> 畫面更新
      this.items.unshift(created)
      return created
    },
    // 更新預約
    async patch(id, patch) {
      const updated = await updateBooking(id, patch)
      const idx = this.items.findIndex((t) => t.id === id)
      if (idx !== -1) this.items[idx] = updated
      return updated
    },
    // 刪除預約
    async remove(id) {
      await removeBooking(id)
      this.items = this.items.filter((p) => p.id !== id)
    },
  },
})
