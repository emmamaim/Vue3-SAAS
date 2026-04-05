import { defineStore } from 'pinia';
import { getTasksService, completeInterviewService, updateTaskStatusService } from '@/api/task';
import type { Task, TaskFeedbackPayload, UpdateTaskStatusPayload } from '@/types';

// 定義 State 的接口
interface TasksState {
  items: Task[];
  loading: boolean;
  error: string | null;
}

export const useTasksStore = defineStore('tasks', {
  state: (): TasksState => ({
    items: [],
    loading: false,
    error: null,
  }),

  getters: {
    // 雙層箭頭函數：利用閉包進行資料篩選(私有化s)
    // 第一層(s)接收來自state的物件
    // 第二層(status)接收需要篩選的狀態標簽
    byStatus: (s) => (status: 'todo' | 'done') => s.items.filter((t) => t && t.status === status),
  },

  actions: {
    // 載入畫面抓取資料
    async fetchAll() {
      this.loading = true;
      this.error = null;
      try {
        const res = await getTasksService();
        this.items = res.data || [];
      } catch (e: unknown) {
        this.error = e instanceof Error ? e.message : '獲取任務失敗';
        this.items = [];
      } finally {
        this.loading = false;
      }
    },

    // 更新任務狀態
    async updateStatus(id: string, status: 'todo' | 'done') {
      try {
        const payload: UpdateTaskStatusPayload = { status };
        const res = await updateTaskStatusService(id, payload);
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
      } catch (e: unknown) {
        this.error = e instanceof Error ? e.message : '更新失敗';
        throw e;
      }
    },

    // 完成面試任務 (提交評價)
    async submitInterviewResult(taskId: string, result: TaskFeedbackPayload) {
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
      } catch (e: unknown) {
        this.error = e instanceof Error ? e.message : '提交評價失敗';
        throw e;
      } finally {
        this.loading = false;
      }
    },
  },
});
