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
      // 1. 先過濾出今天及之後的行程
      return (
        items
          .filter((b) => b.date >= today)
          // 2. 進行排序
          .sort((a, b) => {
            // 後端CHAR(5)格式統一
            return a.date.localeCompare(b.date) || a.startTime.localeCompare(b.startTime)
          })
      )
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
        const { data } = await listBookings()
        this.items = data
      } catch (e) {
        this.error = e.response?.data?.error || '無法讀取資料'
        this.items = []
      } finally {
        this.loading = false
      }
    },
    // 新增預約
    async add(payload) {
      try {
        const { data } = await createBooking(payload)
        // 需更新this.items 陣列 -> 畫面更新
        this.items.unshift(data)
        return data
      } catch (e) {
        throw e.response?.data?.error || '新增失敗'
      }
    },
    // 更新預約
    async patch(id, patch) {
      try {
        const { data } = await updateBooking(id, patch)
        const idx = this.items.findIndex((t) => t.id === id)
        if (idx !== -1) {
          // splice(開始操作的位置，刪除元素個數，插入的新資料)
          this.items.splice(idx, 1, data)
        }
        return data
      } catch (e) {
        throw e.response?.data?.error || '更新失敗'
      }
    },
    // 刪除預約
    async remove(id) {
      try {
        await removeBooking(id)
        this.items = this.items.filter((p) => p.id !== id)
      } catch (e) {
        throw e.response?.data?.error || '刪除失敗'
      }
    },
  },
})
