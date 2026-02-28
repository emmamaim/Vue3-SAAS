import { mockDB } from '@/services/mock/db'
import { delay, genId } from '@/services/mock/helpers'

// 判斷時間是否重疊(分鐘數)
function overlap(aStart, aEnd, bStart, bEnd) {
  return aStart < bEnd && bStart < aEnd
}

// 時間字串轉成分鐘 '10:30' -> 10 * 60 + 30 = 630
function toMinutes(hhmm) {
  // 將字串從冒號處切開 -> ['10', '30']
  // 遍歷陣列，將每個字串轉換成數字 -> [10, 30]
  // 解構賦值 h = 10 m = 30
  const [h, m] = hhmm.split(':').map(Number)
  return h * 60 + m
}

// 獲取預約
export async function listBookings() {
  await delay()
  return mockDB.get().bookings
}

// 新增預約
export async function createBooking(payload) {
  await delay()
  const db = mockDB.get()
  const now = new Date().toISOString()
  // 衝突檢測：同一天時間段重疊就丟錯誤
  const date = payload.date
  const start = toMinutes(payload.startTime)
  const end = toMinutes(payload.endTime)
  // some()有任何一筆符合條件 -> 回傳true
  const hasConflict = db.bookings.some((b) => {
    if (b.date !== date) return false
    return overlap(start, end, toMinutes(b.startTime), toMinutes(b.endTime))
  })
  // 若overlap(..)結果為true則丟錯誤
  if (hasConflict) {
    const err = new Error('Time slot conflict')
    // 方便UI層顯示友善的錯誤訊息
    err.code = 'BOOKING_CONFLICT'
    throw err
  }
  const booking = {
    id: genId('b'),
    title: payload.title?.trim() || 'Untitled booking',
    date,
    startTime: payload.startTime,
    endTime: payload.endTime,
    status: payload.status,
    relatedTaskId: payload.relatedTaskId || null,
    createAt: now,
    updateAt: now,
  }
  db.bookings.unshift(booking)
  mockDB.set(db)
  return booking
}

// 更新預約
export async function updateBooking(id, patch) {
  await delay()
  const db = mockDB.get()
  // 傳入需要更新的預約id -> 找出此id的位置
  const idx = db.bookings.findIndex((b) => b.id === id)
  // 找不到idx 就丟錯誤 -> id不存在
  if (idx === -1) throw new Error('Booking not found')

  // 若日期時間變動，需重新進行衝突檢測
  const next = { ...db.bookings[idx], ...patch }
  const start = toMinutes(next.startTime)
  const end = toMinutes(next.endTime)
  const hasConflict = db.bookings.some((b) => {
    // 排除自己
    if (b.id === id) return false 
    if (b.date !== next.date) return false
    return overlap(start, end, toMinutes(b.startTime), toMinutes(b.endTime))
  })
  if (hasConflict) {
    const err = new Error('Time slot conflict')
    err.code = 'BOOKING_CONFLICT'
    throw err
  }

  const now = new Date().toISOString()
  db.bookings[idx] = { ...next, updateAt: now }
  mockDB.set(db)
  return db.bookings[idx]
}

// 刪除預約
export async function removeBooking(id) {
  await delay()
  const db = mockDB.get()
  // 篩選出除要刪除預約的id以外的所有預約
  db.bookings = db.bookings.filter((b) => b.id !== id)
  mockDB.set(db)
  return true
}
