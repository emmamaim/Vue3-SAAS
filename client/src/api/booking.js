import request from '@/utils/request';

// 獲取行程列表
export const getBookingsService = (params) => {
  return request({
    url: '/bookings',
    method: 'get',
    params,
  });
};

// 建立行程
export const createBookingService = (data) => {
  return request({
    url: '/bookings',
    method: 'post',
    data,
  });
};

// 更新行程
export const updateBookingService = (id, data) => {
  return request({
    url: `/bookings/${id}`,
    method: 'patch',
    data,
  });
};

// 刪除行程
export const removeBookingService = (id) => {
  return request({
    url: `/bookings/${id}`,
    method: 'delete',
  });
};
