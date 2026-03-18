import { defineStore } from 'pinia';
// store不接觸localStorage -> 負責呼叫api
import { getTasksService, completeInterviewService, updateTaskStatusService } from '@/api/task';

export const useTasksStore = defineStore('tasks', {
  state: () => ({
    items: [],
    loading: false,
    error: null,
  }),
  getters: {
    // 雙層箭頭函數：利用閉包進行資料篩選(私有化s)
    // 第一層(s)接收來自state的物件
    // 第二層(status)接收需要篩選的狀態標簽
    byStatus: (s) => (status) => s.items.filter((t) => t && t.status === status),
    // 先定義逾期 -> 根據時間動態篩選數據 -> 數據長度（個數）
    overdueCount: (s) => {
      const now = Date.now();
      return s.items.filter(
        (t) => t && t.dueDate && Date.parse(t.dueDate) < now && t.status !== 'done',
      ).length;
    },
  },
  actions: {
    // 載入畫面抓取資料
    async fetchAll() {
      this.loading = true;
      this.error = null;
      try {
        const res = await getTasksService();
        this.items = res.data || [];
      } catch (e) {
        this.error = e;
        this.items = [];
      } finally {
        this.loading = false;
      }
    },
    // 更新任務狀態
    async updateStatus(id, status) {
      try {
        const res = await updateTaskStatusService(id, status);
        const updated = res.data;
        const idx = this.items.findIndex((t) => String(t.id) === String(id));
        if (idx !== -1) {
          if (updated && updated.id) {
            this.items.splice(idx, 1, updated);
          } else {
            this.items[idx].status = status;
          }
        }
        return updated;
      } catch (e) {
        this.error = e.message;
        throw e;
      }
    },
    // 完成面試任務 (提交評價)
    async submitInterviewResult(taskId, result) {
      this.loading = true;
      try {
        const res = await completeInterviewService(taskId, result);
        const updated = res.data;
        const idx = this.items.findIndex((t) => t.id === taskId);
        if (idx !== -1) {
          if (updated && updated.id) {
            this.items.splice(idx, 1, updated);
          } else {
            this.items[idx].status = 'done';
          }
        }
        return updated;
      } catch (e) {
        this.error = e.message;
        throw e;
      } finally {
        this.loading = false;
      }
    },
  },
});
