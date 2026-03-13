import db from "../config/db.js";

const BookingModel = {
  // 查詢（篩選用戶/日期範圍）
  findAll: async ({ userId, startDate, endDate }) => {
    let sql = `
            SELECT b.*, u.real_name as user_name
            FROM bookings b
            JOIN users u ON b.user_id = u.id
            WHERE 1=1
        `;
    const params = [];
    if (userId) {
      sql += " AND b.user_id = ?";
      params.push(userId);
    }
    if (startDate && endDate) {
      sql += " AND b.date BETWEEN ? AND ?";
      params.push(startDate, endDate);
    }
    sql += " ORDER BY b.date ASC, b.startTime ASC";
    const [rows] = await db.execute(sql, params);
    return rows;
  },
  // 查詢單筆行程
  findById: async (id) => {
    const [rows] = await db.execute("SELECT * FROM bookings WHERE id = ?", [
      id,
    ]);
    return rows[0] || null;
  },
  // 建立行程
  create: async (data) => {
    const {
      id,
      user_id,
      title,
      date,
      startTime,
      endTime,
      status = "confirmed",
      relatedTaskId = null,
    } = data;
    const sql =
      "INSERT INTO bookings (id, user_id, title, date, startTime, endTime, status, relatedTaskId) VALUES (?, ?, ?, ?, ?, ?, ?, ?)";
    return await db.execute(sql, [
      id,
      user_id,
      title,
      date,
      startTime,
      endTime,
      status,
      relatedTaskId,
    ]);
  },
  // 更新行程
  update: async (id, patch) => {
    // 白名單過濾
    const allowedFields = ["title", "date", "startTime", "endTime", "status"];
    const updateKeys = Object.keys(patch).filter((key) =>
      allowedFields.includes(key),
    );
    if (updateKeys.length === 0) return;
    const setClause = updateKeys.map((key) => `${key} = ?`).join(", ");
    const values = updateKeys.map((key) => patch[key]);
    return await db.execute(`UPDATE bookings SET ${setClause} WHERE id = ?`, [
      ...values,
      id,
    ]);
  },
  // 刪除行程
  delete: async (id, userId, userRole) => {
    // 確認行程是否有關聯任務
    const [rows] = await db.execute(
      "SELECT user_id, relatedTaskId FROM bookings WHERE id = ?",
      [id],
    );
    if (rows.length === 0) {
      throw new Error("找不到該行程紀錄");
    }
    // 權限檢查：只有本人或HR/管理員才能刪除
    const isOwner = rows[0].user_id === userId;
    const isPrivileged = ["super_admin", "dept_hr"].includes(userRole);
    if (!isOwner && !isPrivileged) {
      const error = new Error("無權限刪除此行程");
      error.statusCode = 403;
      throw error;
    }
    if (rows[0].relatedTaskId) {
      const error = new Error(
        "禁止刪除：此行程與面試任務關聯，請透過面試管理模組取消",
      );
      error.statusCode = 403; // Forbidden
      throw error;
    }
    return await db.execute("DELETE FROM bookings WHERE id = ?", [id]);
  },
  checkConflict: async (
    userId,
    date,
    startTime,
    endTime,
    excludeBookingId = null,
  ) => {
    let sql =
      "SELECT * FROM bookings WHERE user_id = ? AND date = ? AND status != 'canceled' AND (? < endTime AND ? > startTime)";
    const params = [userId, date, startTime, endTime];
    if (excludeBookingId) {
      sql += ` AND id != ?`;
      params.push(excludeBookingId);
    }
    const [rows] = await db.execute(sql, params);
    return rows.length > 0;
  },
};

export default BookingModel;