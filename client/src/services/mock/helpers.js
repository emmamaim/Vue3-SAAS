// 模擬延遲250毫秒
export function delay(ms = 250) {
  return new Promise((r) => setTimeout(r, ms))
}
// 產生不重複的字串id:task_9f3a1b_17000...
export function genId(prefix = 'id') {
  // 隨機生成0-1之間的小數->16進位字串->slice去除'0.'->加上時間戳(毫秒)
  return `${prefix}_${Math.random().toString(16).slice(2)}_${Date.now()}`
}
