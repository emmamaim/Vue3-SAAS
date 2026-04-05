import request from '@/utils/request';
import type {
  Booking,
  BookingQueryParams,
  CreateBookingPayload,
  UpdateBookingPayload,
  ApiResponse,
} from '@/types';

// 獲取行程列表
export const getBookingsService = (params: BookingQueryParams): Promise<ApiResponse<Booking[]>> => {
  return request<ApiResponse<Booking[]>>({
    url: '/bookings',
    method: 'get',
    params,
  });
};

// 建立行程
export const createBookingService = (data: CreateBookingPayload): Promise<ApiResponse<void>> => {
  return request<ApiResponse<void>>({
    url: '/bookings',
    method: 'post',
    data,
  });
};

// 更新行程
export const updateBookingService = (
  id: string,
  data: UpdateBookingPayload,
): Promise<ApiResponse<void>> => {
  return request<ApiResponse<void>>({
    url: `/bookings/${id}`,
    method: 'patch',
    data,
  });
};

// 刪除行程
export const removeBookingService = (id: string): Promise<ApiResponse<void>> => {
  return request<ApiResponse<void>>({
    url: `/bookings/${id}`,
    method: 'delete',
  });
};
