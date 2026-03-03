import request from '@/utils/request'

// 獲取預約
export async function listBookings() {
  return request({
    url: '/bookings',
    method: 'get',
  })
}

// 新增預約
export async function createBooking(payload) {
  return request({
    url: '/bookings',
    method: 'post',
    data: payload,
  })
}

// 更新預約
export async function updateBooking(id, patch) {
  return request({
    url: `/bookings/${id}`,
    method: 'patch',
    data: patch,
  })
}

// 刪除預約
export async function removeBooking(id) {
  return request({
    url: `/bookings/${id}`,
    method: 'delete',
  })
}
