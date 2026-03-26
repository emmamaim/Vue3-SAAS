import { defineStore } from 'pinia';
import { systemInitService } from '@/api/system';
import { getHrListService, getInterviewerListService } from '@/api/users';
import { useUserStore } from './users';

export const useSystemStore = defineStore('system', {
  state: () => ({
    departments: [],
    sources: [],
    job_categories: [],
    jobs: [],
    hrList: [],
    interviewerList: [],
    // 標記是否已加載過數據
    isLoaded: false,
  }),

  actions: {
    // 初始化獲取所有選項
    async fetchAllOptions() {
      const userStore = useUserStore();
      if (this.isLoaded && this.jobs.length > 0) return;
      // userStore 的登入狀態
      if (!userStore.isLoggedIn) {
        console.warn('[System Store] 尚未登入，跳過資料預載');
        return;
      }
      try {
        const results = await Promise.allSettled([
          systemInitService(),
          getHrListService(),
          getInterviewerListService(),
        ]);
        // 系統配置處理
        if (results[0].status === 'fulfilled') {
          const systemRes = results[0].value;
          this.departments = systemRes.departments || [];
          this.job_categories = systemRes.job_categories || [];
          this.sources = systemRes.sources || [];
          this.jobs = systemRes.jobs || [];
        } else {
          console.error('系統基礎配置加載超時或失敗:', results[0].reason);
        }
        // HR 名單處理
        if (results[1].status === 'fulfilled') {
          this.hrList = results[1].value.data || [];
        } else {
          console.error('HR 名單加載超時:', results[1].reason);
        }
        // 面試官名單處理
        if (results[2].status === 'fulfilled') {
          this.interviewerList = results[2].value.data || [];
        } else {
          console.error('面試官名單加載超時:', results[2].reason);
        }
        if (this.interviewerList.length > 0) {
          this.isLoaded = true;
        }
        this.isLoaded = true;
      } catch (err) {
        console.error('Store Action 執行異常:', err);
      }
    },
    // 提供強制刷新
    async refreshOptions() {
      this.isLoaded = false;
      await this.fetchAllOptions();
    },
  },
  getters: {
    // 格式化HR選項
    hrOptions: (state) =>
      state.hrList.map((hr) => ({
        label: hr.label || hr.name,
        value: hr.value || hr.id,
      })),
    // 格式化面試官選項
    interviewerOptions: (state) =>
      state.interviewerList.map((int) => ({
        label: int.label || int.real_name || int.name || '未知面試官',
        value: int.value || int.id,
        dept_id: int.dept_id,
      })),
    // 根據部門 ID 過濾面試官
    getInterviewerByDept: (state) => {
      return (deptId) => {
        const list = deptId
          ? state.interviewerList.filter((int) => int.dept_id === deptId)
          : state.interviewerList;

        return list.map((int) => ({
          label: int.label || int.name,
          value: int.value || int.id,
          dept_id: int.dept_id,
        }));
      };
    },
  },
});
