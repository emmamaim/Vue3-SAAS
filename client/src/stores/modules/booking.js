import { defineStore } from 'pinia';
import {
  getBookingsService,
  createBookingService,
  updateBookingService,
  removeBookingService,
} from '@/api/booking';

export const useBookingStore = defineStore('booking', {
  state: () => ({
    items: [],
    loading: false,
    error: null,
    // 查詢參數
    currentQuery: {
      userId: null,
      startDate: '',
      endDate: '',
    },
  }),
  getters: {
    // 按日期時間排序
    sortedItems: (s) => {
      const list = Array.isArray(s.items) ? s.items : [];
      return [...list].sort(
        (a, b) => a.date.localeCompare(b.date) || a.startTime.localeCompare(b.startTime),
      );
    },
    // 近期行程
    upcoming: (s) => {
      const today = new Date().toISOString().slice(0, 10);
      return s.sortedItems.filter((b) => b.date >= today);
    },
  },
  actions: {
    // 獲取行程
    async fetchAll(params = {}) {
      this.loading = true;
      this.error = null;
      this.currentQuery = { ...params };
      try {
        const res = await getBookingsService(params);
        this.items = res.data;
      } catch (e) {
        this.error = e.response?.data?.message || '無法讀取行程資料';
        this.items = [];
      } finally {
        this.loading = false;
      }
    },
    // 新增行程
    async add(payload) {
      try {
        const res = await createBookingService(payload);
        if (res.data) {
          this.items.unshift(res.data);
        } else {
          await this.fetchAll(this.currentQuery);
        }
      } catch (e) {
        throw e;
      }
    },
    // 更新行程
    async patch(id, patch) {
      try {
        const res = await updateBookingService(id, patch);
        const idx = this.items.findIndex((b) => b.id === id);
        if (idx !== -1) {
          if (res.data) {
            this.items.splice(idx, 1, res.data);
          } else {
            await this.fetchAll(this.currentQuery);
          }
        }
        return res;
      } catch (e) {
        throw e;
      }
    },
    // 刪除行程
    async remove(id) {
      try {
        await removeBookingService(id);
        this.items = this.items.filter((b) => b.id !== id);
      } catch (e) {
        throw e;
      }
    },
  },
});
