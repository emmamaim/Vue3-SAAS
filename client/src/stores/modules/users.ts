import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { userCreateService } from '@/api/users';
import { getMeService, userLoginService, userLogoutService } from '@/api/auth';
import type { User, LoginParams, RegisterParams } from '@/types';

export const useUserStore = defineStore('users', () => {
  // --- state ---
  const userInfo = ref<User | null>(JSON.parse(localStorage.getItem('userInfo') || 'null'));

  // --- getters ---
  const isLoggedIn = computed(() => !!userInfo.value?.id);

  // --- actions ---
  // 清除本地資料
  const clearLocalData = () => {
    userInfo.value = null;
    localStorage.removeItem('userInfo');
  };

  // 註冊
  const register = async (registerData: RegisterParams) => {
    const res = await userCreateService(registerData);
    return res;
  };

  // 登入
  const login = async (loginData: LoginParams) => {
    try {
      clearLocalData();
      const res = await userLoginService(loginData);
      userInfo.value = res.user || null;
      localStorage.setItem('userInfo', JSON.stringify(res.user));
      return res;
    } catch (error) {
      throw error;
    }
  };

  // 登出
  const logout = async () => {
    try {
      await userLogoutService();
    } finally {
      clearLocalData();
    }
  };

  // 獲取用戶資訊
  const getUserInfo = async () => {
    try {
      const res = await getMeService();
      userInfo.value = res.user || null;
      localStorage.setItem('userInfo', JSON.stringify(res.user));
      return res;
    } catch (error) {
      clearLocalData();
      throw error;
    }
  };

  return {
    userInfo,
    clearLocalData,
    login,
    logout,
    getUserInfo,
    isLoggedIn,
    register,
  };
});
