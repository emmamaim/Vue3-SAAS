import request from '@/utils/request'

// 登入
export const userLoginService = (data) => {
  return request({
    url: '/auth/login',
    method: 'post',
    data,
  })
}
// 注冊（管理員）
export const userRegisterService = (data) => {
  return request({
    url: '/auth/register',
    method: 'post',
    data,
  })
}
