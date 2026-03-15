import { defineStore } from 'pinia';
import { systemInitService } from '@/api/system';
import { getHrListService, getInterviewerListService } from '@/api/users';

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
      if (this.isLoaded && this.jobs.length > 0) return;
      const token = localStorage.getItem('token');
      if (!token) {
        console.warn('[System Store] 尚未登入，跳過資料預載');
        return;
      }
      try {
        const [systemRes, hrRes, intRes] = await Promise.all([
          systemInitService(),
          getHrListService(),
          getInterviewerListService(),
        ]);
        this.departments = systemRes.departments || [];
        this.job_categories = systemRes.job_categories || [];
        this.sources = systemRes.sources || [];
        this.jobs = systemRes.jobs || [];

        this.hrList = hrRes.data || [];
        this.interviewerList = intRes.data || [];
        this.isLoaded = true;
      } catch (err) {
        console.error('Store 初始化失敗:', err);
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
        label: int.label,
        value: int.value,
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
