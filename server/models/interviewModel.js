import db from "../config/db.js";

// 時間工具：預設tasks的截止時間為面試的隔天18：00
const getNextDaySixPM = (dateStr) => {
  const date = new Date(dateStr);
  date.setDate(date.getDate() + 1);
  // 取得 YYYY-MM-DD
  const nextDay = date.toISOString().split("T")[0];
  return `${nextDay} 18:00:00`;
};

const InterviewModel = {
  // 檢查衝突
  checkConflict: async (
    interviewerId,
    date,
    startTime,
    endTime,
    excludeBookingId = null,
  ) => {
    let sql =
      "SELECT * FROM bookings WHERE user_id = ? AND date = ? AND status != 'canceled' AND (? < endTime AND ? > startTime)";
    const params = [interviewerId, date, startTime, endTime];
    if (excludeBookingId) {
      sql += ` AND id != ?`;
      params.push(excludeBookingId);
    }
    const [rows] = await db.execute(sql, params);
    return rows.length > 0;
  },
  // 三表聯動：傳入connection物件，控制transaction
  // 建立面試
  createWithTransaction: async (conn, data) => {
    const {
      interviewId,
      taskId,
      bookingId,
      candidate_id,
      interviewer_id,
      hr_id,
      dept_id,
      interview_round,
      date,
      startTime,
      endTime,
      title,
      location,
    } = data;
    // 計算截止時間：隔天 18:00
    const dueDate = getNextDaySixPM(date);
    // 1.建立tasks
    const taskSql =
      "INSERT INTO tasks (id, user_id, title, status, priority, description, dueDate) VALUES (?, ?, ?, 'todo', 'high', ?, ?)";
    await conn.execute(taskSql, [
      taskId,
      interviewer_id,
      `面試評價: ${title}`,
      `請針對應徵者進行第 ${interview_round} 輪面試評價`,
      dueDate,
    ]);
    // 2.建立 bookings
    const bookingSql =
      "INSERT INTO bookings (id, user_id, title, date, startTime, endTime, status, relatedTaskId) VALUES (?, ?, ?, ?, ?, ?, 'confirmed', ?)";
    await conn.execute(bookingSql, [
      bookingId,
      interviewer_id,
      title,
      date,
      startTime,
      endTime,
      taskId,
    ]);
    // 3.建立 interviews
    const interviewSql =
      "INSERT INTO interviews (id, candidate_id, interviewer_id, hr_id, dept_id, interview_round, date, startTime, endTime, location, booking_id, task_id, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'scheduled')";
    await conn.execute(interviewSql, [
      interviewId,
      candidate_id,
      interviewer_id,
      hr_id,
      dept_id,
      interview_round,
      date,
      startTime,
      endTime,
      location,
      bookingId,
      taskId,
    ]);
    // 4.更新應徵者狀態
    await conn.execute(
      "UPDATE candidates SET status = 'interviewing' WHERE id = ?",
      [candidate_id],
    );
  },

  // 更新面試（檢測時間衝突）
  updateWithTransaction: async (conn, interviewId, patch) => {
    const [old] = await conn.execute("SELECT * FROM interviews WHERE id = ?", [
      interviewId,
    ]);
    if (old.length === 0) {
      throw new Error("面試記錄不存在！");
    }

    // 核心：面試官、日期、或時間變動 => 檢測衝突
    const {
      task_id,
      booking_id,
      interviewer_id: oldId,
      date: oldDate,
      startTime: oldStart,
      endTime: oldEnd,
    } = old[0];
    const isChanged =
      (patch.interviewer_id && patch.interviewer_id !== oldId) ||
      (patch.date && patch.date !== oldDate) ||
      (patch.startTime && patch.startTime !== oldStart) ||
      (patch.endTime && patch.endTime !== oldEnd);
    if (isChanged) {
      // 檢查的資料
      const checkId = patch.interviewer_id || oldId;
      const checkDate = patch.date || oldDate;
      const checkStart = patch.startTime || oldStart;
      const checkEnd = patch.endTime || oldEnd;
      const hasConflict = await InterviewModel.checkConflict(
        checkId,
        checkDate,
        checkStart,
        checkEnd,
        booking_id,
      );
      if (hasConflict) {
        throw new Error("更新失敗：新時段與面試官現有行程衝突");
      }
    }
    // 1.更新tasks
    if (patch.interviewer_id || patch.date || patch.endTime || patch.title) {
      const updateTaskSql =
        "UPDATE tasks SET user_id = COALESCE(?, user_id), title = COALESCE(?, title), dueDate = COALESCE(?, dueDate) WHERE id = ?";
      // 計算新的截止時間
      const finalDate = patch.date || oldDate;
      const newDueDate = getNextDaySixPM(finalDate);
      await conn.execute(updateTaskSql, [
        patch.interviewer_id || null,
        patch.title ? `面試評價: ${patch.title}` : null,
        newDueDate,
        task_id,
      ]);
    }
    // 2.更新bookings
    const updateBookingSql = `
      UPDATE bookings SET 
        user_id = COALESCE(?, user_id),
        title = COALESCE(?, title),
        date = COALESCE(?, date),
        startTime = COALESCE(?, startTime),
        endTime = COALESCE(?, endTime)
      WHERE id = ?
    `;
    await conn.execute(updateBookingSql, [
      patch.interviewer_id || null,
      patch.title || null,
      patch.date || null,
      patch.startTime || null,
      patch.endTime || null,
      booking_id,
    ]);
    // 3.更新interviews
    const allowedFields = [
      "interviewer_id",
      "interview_round",
      "date",
      "startTime",
      "endTime",
      "location",
      "result",
      "comments",
      "status",
    ];
    const updateKeys = Object.keys(patch).filter((key) =>
      allowedFields.includes(key),
    );
    if (updateKeys.length > 0) {
      const setClause = updateKeys.map((key) => `${key} = ?`).join(", ");
      const values = updateKeys.map((key) => patch[key]);
      await conn.execute(
        `UPDATE interviews SET ${setClause}, updatedAt = NOW() WHERE id = ?`,
        [...values, interviewId],
      );
    }
  },

  // 刪除面試
  deleteWithTransaction: async (conn, interviewId) => {
    // 取得關聯ID
    const [rows] = await conn.execute(
      "SELECT task_id, booking_id, candidate_id FROM interviews WHERE id = ?",
      [interviewId],
    );
    if (rows.length > 0) {
      const { task_id, booking_id, candidate_id } = rows[0];
      // 先刪除子表（tasks, bookings）
      if (task_id) {
        await conn.execute("DELETE FROM tasks WHERE id = ?", [task_id]);
      }
      if (booking_id) {
        await conn.execute("DELETE FROM bookings WHERE id = ?", [booking_id]);
      }
      // 刪除主表（interviews）
      await conn.execute("DELETE FROM interviews WHERE id = ?", [interviewId]);
      // 檢查剩餘面試，若無則更新應徵者狀態
      const [remaining] = await conn.execute(
        "SELECT id FROM interviews WHERE candidate_id = ? AND status = 'scheduled'",
        [candidate_id],
      );
      if (remaining.length === 0) {
        await conn.execute(
          "UPDATE candidates SET status = 'pending' WHERE id = ?",
          [candidate_id],
        );
      }
    }
  },
};

export default InterviewModel;
