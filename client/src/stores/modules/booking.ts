import { defineStore } from 'pinia';
import {
  getBookingsService,
  createBookingService,
  updateBookingService,
  removeBookingService,
} from '@/api/booking';
import type {
  Booking,
  BookingQueryParams,
  CreateBookingPayload,
  UpdateBookingPayload,
} from '@/types';

// 定義 State 接口
interface BookingState {
  items: Booking[];
  loading: boolean;
  error: string | null;
  currentQuery: BookingQueryParams;
}

export const useBookingStore = defineStore('booking', {
  state: (): BookingState => ({
    items: [],
    loading: false,
    error: null,
    // 查詢參數
    currentQuery: {
      userId: undefined,
      startDate: '',
      endDate: '',
    },
  }),

  getters: {
    // 按日期時間排序
    sortedItems: (s): Booking[] => {
      const list = Array.isArray(s.items) ? s.items : [];
      return [...list].sort(
        (a, b) => a.date.localeCompare(b.date) || a.startTime.localeCompare(b.startTime),
      );
    },

    // 近期行程
    upcoming(): Booking[] {
      const today = new Date().toISOString().slice(0, 10);
      return this.sortedItems.filter((b: Booking) => b.date >= today);
    },
  },

  actions: {
    // 獲取行程
    async fetchAll(params: BookingQueryParams = {}) {
      this.loading = true;
      this.error = null;
      this.currentQuery = { ...params };
      try {
        const res = await getBookingsService(params);
        this.items = res.data || [];
      } catch (e: unknown) {
        if (e instanceof Error) {
          this.error = e.message || '無法讀取行程資料';
        } else {
          this.error = '發生未知錯誤';
        }
        this.items = [];
      } finally {
        this.loading = false;
      }
    },

    // 新增行程
    async add(payload: CreateBookingPayload) {
      try {
        const res = await createBookingService(payload);
        if (res.data) {
          this.items.unshift(res.data);
        } else {
          await this.fetchAll(this.currentQuery);
        }
      } catch (e: unknown) {
        throw e;
      }
    },
    // 更新行程
    async patch(id: string, patch: UpdateBookingPayload) {
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
      } catch (e: unknown) {
        throw e;
      }
    },
    // 刪除行程
    async remove(id: string) {
      try {
        await removeBookingService(id);
        this.items = this.items.filter((b) => b.id !== id);
      } catch (e: unknown) {
        throw e;
      }
    },
  },
});
