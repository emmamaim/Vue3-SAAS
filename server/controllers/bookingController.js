import db from "../config/db.js";

// 獲取預約
export const getAllBookings = async (req, res) => {
  try {
    // 時間格式化
    const sql = `SELECT id, title, DATE_FORMAT(date, '%Y-%m-%d') as date, startTime, endTime, status, relatedTaskId, createAt, updateAt FROM bookings ORDER BY createAt DESC`;
    const [rows] = await db.execute(sql);
    res.json({ data: rows });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// 新增預約
export const createBooking = async (req, res) => {
  const { title, date, startTime, endTime, status, relatedTaskId } = req.body;
  // 生成隨機ID
  const id = "b_" + Date.now();
  try {
    // 衝突檢測
    // 第一步：查詢同一天資料（格式化日期）
    const [rows] = await db.execute(
      "SELECT * FROM bookings WHERE DATE_FORMAT(date, '%Y-%m-%d') = ?",
      [date],
    );
    // 第二步：將時間轉換成分鐘數方便比較
    const toMin = (timeStr) => {
      const [h, m] = timeStr.split(":").map(Number);
      return h * 60 + m;
    };
    const newStart = toMin(startTime);
    const newEnd = toMin(endTime);
    // 第二步：some()進行時間衝突檢測
    const hasConflict = rows.some((b) => {
      const oldStart = toMin(b.startTime);
      const oldEnd = toMin(b.endTime);
      return newStart < oldEnd && oldStart < newEnd;
    });
    if (hasConflict) {
      return res.status(400).json({ error: "預約時間有衝突" });
    }
    // 第三步：無衝突 => 新增
    const sql =
      "INSERT INTO bookings (id, title, date, startTime, endTime, status, relatedTaskId) VALUES(?, ?, ?, ?, ?, ?, ?)";
    await db.execute(sql, [
      id,
      title,
      date,
      startTime,
      endTime,
      status,
      relatedTaskId,
    ]);
    res.status(201).json({ message: "新增成功", data: { id, ...req.body } });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// 更新預約
export const updateBooking = async (req, res) => {
  // 預約ID以及需要更新的内容
  const { id } = req.params;
  const patch = req.body;
  try {
    // 第一步：確認該筆資料是否存在
    const [existing] = await db.execute("SELECT * FROM bookings WHERE id = ?", [
      id,
    ]);
    if (existing.length === 0)
      return res.status(404).json({ error: "找不到該預約" });
    // 第二步：準備檢測資料
    const checkDate = patch.date || existing[0].date;
    const [allDayRows] = await db.execute(
      "SELECT * FROM bookings WHERE DATE_FORMAT(date, '%Y-%m-%d') = ? AND id != ?",
      [checkDate, id],
    );
    // 第三步：時間衝突檢測（僅當有傳入時間時進行）
    if (patch.date || patch.startTime || patch.endTime) {
      const toMin = (timeStr) => {
        const [h, m] = timeStr.split(":").map(Number);
        return h * 60 + m;
      };
      const newStart = toMin(patch.startTime);
      const newEnd = toMin(patch.endTime);
      const hasConflict = allDayRows.some((b) => {
        const oldStart = toMin(b.startTime);
        const oldEnd = toMin(b.endTime);
        return newStart < oldEnd && oldStart < newEnd;
      });
      if (hasConflict) {
        return res.status(400).json({ error: "預約時間有衝突" });
      }
    }
    // 第四步：白名單過濾
    const allowedFields = [
      "title",
      "date",
      "startTime",
      "endTime",
      "status",
      "relatedTaskId",
    ];
    const updateKeys = Object.keys(patch).filter((key) =>
      allowedFields.includes(key),
    );
    if (updateKeys.length === 0)
      return res.status(400).json({ error: "無效更新内容" });
    // 第五步：動態sql
    const fields = updateKeys.map((key) => `${key}=?`).join(",");
    const values = updateKeys.map((key) => patch[key]);
    const sql = `UPDATE bookings SET ${fields}, updateAt = NOW() WHERE id = ?`;
    await db.execute(sql, [...values, id]);
    // 第六步：重新查詢更新后的結果
    const [result] = await db.execute(
      `SELECT id, title, DATE_FORMAT(date, '%Y-%m-%d') as date, startTime, endTime, status, relatedTaskId FROM bookings WHERE id = ?`,
      [id],
    );
    res.json({ message: "更新成功", data: result[0] });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

//刪除預約
export const removeBooking = async (req, res) => {
  const { id } = req.params;
  try {
    await db.execute("DELETE FROM bookings WHERE id = ?", [id]);
    res.json({ message: "刪除成功" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
