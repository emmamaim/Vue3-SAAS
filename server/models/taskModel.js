import db from "../config/db.js";

const TaskModel = {
  // 獲取任務列表
  findAllByUserId: async (userId) => {
    const sql = `
            SELECT t.*, i.id as interview_id, i.candidate_id, i.interview_round, i.location
            FROM tasks t
            LEFT JOIN interviews i ON t.id = i.task_id
            WHERE t.user_id = ?
            ORDER BY t.priority DESC, t.dueDate ASC
        `;
    const [rows] = await db.execute(sql, [userId]);
    return rows;
  },
  // 獲取單筆任務詳情
  getById: async (id) => {
    const [rows] = await db.execute("SELECT * FROM tasks WHERE id = ?", [id]);
    return rows[0] || null;
  },
  // 提交面試評價（三表同步更新）
  submitInterviewFeedback: async (taskId, feedbackData) => {
    const { result, comments } = feedbackData;
    // 開始transaction
    const connection = await db.getConnection();
    await connection.beginTransaction();
    try {
      // 更新tasks.status => done
      await connection.execute(
        "UPDATE tasks SET status = 'done' WHERE id = ?",
        [taskId],
      );
      // 更新interviews.result/comments/status=>completed
      await connection.execute(
        "UPDATE interviews SET result = ?, comments = ?, status = 'completed' WHERE task_id = ?",
        [result, comments, taskId],
      );
      // 更新bookings.status => completed
      await connection.execute(
        "UPDATE bookings SET status = 'completed' WHERE relatedTaskId = ?",
        [taskId],
      );
      // 提交transaction
      await connection.commit();
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  },
  // 更新任務狀態
  updateStatus: async (taskId, status) => {
    return await db.execute("UPDATE tasks SET status = ? WHERE id = ?", [
      status,
      taskId,
    ]);
  },
};

export default TaskModel;
