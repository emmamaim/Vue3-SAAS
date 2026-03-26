import { defineStore } from 'pinia';
import { userCreateService } from '@/api/users';
import { getMeService, userLoginService, userLogoutService } from '@/api/auth';

export const useUserStore = defineStore('users', {
  state: () => ({
    userInfo: JSON.parse(localStorage.getItem('userInfo') || '{}'),
  }),
  actions: {
    // 注冊（管理員）
    async register(registerData) {
      const res = await userCreateService(registerData);
      return res;
    },
    // 登入
    async login(loginData) {
      try {
        this.clearLocalData();
        const res = await userLoginService(loginData);
        this.userInfo = res.user;
        // 持久化存儲
        localStorage.setItem('userInfo', JSON.stringify(res.user));
        return res;
      } catch (error) {
        throw error;
      }
    },
    // 登出
    async logout() {
      try {
        await userLogoutService();
      } finally {
        this.clearLocalData();
      }
    },
    // 重置用戶資訊
    clearLocalData() {
      this.userInfo = {};
      localStorage.removeItem('userInfo');
    },
    // 獲取用戶資訊
    async getUserInfo() {
      try {
        const res = await getMeService();
        this.userInfo = res.user;
        localStorage.setItem('userInfo', JSON.stringify(res.user));
        return res;
      } catch (error) {
        this.clearLocalData();
        throw error;
      }
    },
  },
  getters: {
    isLoggedIn: (state) => !!state.userInfo.id,
  },
});
