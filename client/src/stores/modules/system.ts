import { defineStore } from 'pinia';
import { systemInitService } from '@/api/system';
import { getHrListService, getInterviewerListService } from '@/api/users';
import { useUserStore } from './users';
import type { BaseOptions, JobOption, UserOption, SystemInitData } from '@/types';

// 定義state
interface SystemState {
  departments: BaseOptions[];
  sources: BaseOptions[];
  job_categories: BaseOptions[];
  jobs: JobOption[];
  hrList: UserOption[];
  interviewerList: UserOption[];
  isLoaded: boolean;
}

export const useSystemStore = defineStore('system', {
  state: (): SystemState => ({
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
      if (this.isLoaded) return;
      // userStore 的登入狀態
      if (!userStore.isLoggedIn) {
        console.warn('[System Store] 尚未登入，跳過資料預載');
        return;
      }
      try {
        const [sysRes, hrRes, intRes] = await Promise.allSettled([
          systemInitService(),
          getHrListService(),
          getInterviewerListService(),
        ]);
        // 系統配置處理
        if (sysRes.status === 'fulfilled') {
          const data = sysRes.value as unknown as SystemInitData;
          if (data && data.departments) {
            this.departments = data.departments || [];
            this.job_categories = data.job_categories || [];
            this.sources = data.sources || [];
            this.jobs = data.jobs || [];
          }
        }
        // HR 名單處理
        if (hrRes.status === 'fulfilled') {
          const res = hrRes.value;
          this.hrList = res.data || [];
        }
        // 面試官名單處理
        if (intRes.status === 'fulfilled') {
          const res = intRes.value;
          this.interviewerList = res.data || [];
        }
        this.isLoaded = true;
      } catch (err) {
        console.error('Store Action 執行異常:', err);
      }
    },

    // 提供強制刷新
    async refreshOptions(): Promise<void> {
      this.isLoaded = false;
      await this.fetchAllOptions();
    },
  },
  getters: {
    // HR選項
    hrOptions: (state) => state.hrList,

    // 面試官選項
    interviewerOptions: (state) => state.interviewerList,

    // 根據部門 ID 過濾面試官
    getInterviewerByDept: (state) => {
      return (deptId: number | string | undefined) => {
        if (!deptId) return state.interviewerList;
        return state.interviewerList.filter((int) => int.dept_id === Number(deptId));
      };
    },
  },
});
