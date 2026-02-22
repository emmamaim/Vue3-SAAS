import { createSeedData } from './seed'
// localStorage 的 存取key
const KEY = 'workhub_mock_db_v1'

// 從localStorage 讀資料
function read() {
  const raw = localStorage.getItem(KEY)
  return raw ? JSON.parse(raw) : null
}

//將資料寫入 localStorage
function write(db) {
  localStorage.setItem(KEY, JSON.stringify(db))
  return db
}

// initMockDB() 第一次啟動用seed資料
export function initMockDB() {
  const existing = read()
  if (existing) return existing
  // 當 localStorage無資料，則讀取seed
  const seeded = createSeedData()
  return write(seeded)
}

// mockDB 提供get/set/reset
// 讓API可以用mockDB.get()...
export const mockDB = {
  get() {
    // 若read()無資料則呼叫initMockDB()
    return read() ?? initMockDB()
  },
  set(next) {
    return write(next)
  },
  reset() {
    localStorage.removeItem(KEY)
    return initMockDB()
  },
}
