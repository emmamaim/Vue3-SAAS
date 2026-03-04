import { defineStore } from 'pinia'
import { userLoginService, userRegisterService } from '@/api/users'

export const useUserStore = defineStore('users', {
  state: () => ({
    token: localStorage.getItem('token') || '',
    userInfo: JSON.parse(localStorage.getItem('userInfo') || '{}'),
  }),
  actions: {
    // 注冊（管理員）
    async register(registerData) {
      const res = await userRegisterService(registerData)
      return res
    },
    // 登入
    async login(loginData) {
      const res = await userLoginService(loginData)
      // 更新store
      this.token = res.token
      this.userInfo = res.user
      // 持久化存儲
      localStorage.setItem('token', res.token)
      localStorage.setItem('userInfo', JSON.stringify(res.user))
      return res
    },
    // 登出
    logout() {
      this.token = ''
      this.userInfo = {}
      localStorage.removeItem('token')
      localStorage.removeItem('userInfo')
    },
  },
})
