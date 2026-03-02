import axios from 'axios'

// 建立 axios實例
const service = axios.create({
  baseURL: 'http://localhost:3000/api',
  // 超過五秒沒回應就中斷
  timeout: 5000,
})

// Request 攔截器(請求前token驗證)
service.interceptors.request.use(
  function (config) {
    console.log('--- 請求發送中 ---', config.url)
    return config
  },
  function (error) {
    return Promise.reject(error)
  },
)

// 添加响应拦截器
service.interceptors.response.use(
  function (response) {
    // 直接回傳 response.data，少寫一層.data
    return response.data
  },
  function (error) {
    // 統一處理錯誤
    console.error('API 錯誤:', error.response?.data || error.message)
    return Promise.reject(error)
  },
)

export default service
