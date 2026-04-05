// 行程
export interface Booking {
  id: string;
  user_id: string;
  user_name?: string;
  title: string;
  date: string;
  startTime: string;
  endTime: string;
  status: 'confirmed' | 'canceled';
  relatedTaskId: string | null;
}

// 查詢參數
export interface BookingQueryParams {
  userId?: string;
  startDate?: string;
  endDate?: string;
}

// 新增行程
export interface CreateBookingPayload {
  title: string;
  date: string;
  startTime: string;
  endTime: string;
  userId?: string;
}

// 更新行程
export interface UpdateBookingPayload {
  title?: string;
  date?: string;
  startTime?: string;
  endTime?: string;
  status?: 'confirmed' | 'canceled';
}
