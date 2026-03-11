import db from "../config/db.js";
import InterviewModel from "../models/interviewModel.js";
import { v4 as uuidv4 } from "uuid";

// 建立面試
export const createInterview = async (req, res) => {
  const conn = await db.getConnection();
  try {
    const {
      candidate_id,
      interviewer_id,
      dept_id,
      interview_round,
      date,
      startTime,
      endTime,
      location,
      title,
    } = req.body;
    const hr_id = req.user.id;
    // 1.預先檢查時間衝突（不進入transaction）
    const hasConflict = await InterviewModel.checkConflict(
      interviewer_id,
      date,
      startTime,
      endTime,
    );
    if (hasConflict) {
      return res
        .status(409)
        .json({ message: "面試官該時段已有行程，請更換時間" });
    }
    // 2.準備三表聯動所需的隨機ID
    const interviewData = {
      interviewId: `int_${uuidv4()}`,
      taskId: `tsk_${uuidv4()}`,
      bookingId: `bk_${uuidv4()}`,
      candidate_id,
      interviewer_id,
      hr_id,
      dept_id,
      interview_round,
      date,
      startTime,
      endTime,
      location: location || "Remote / Online",
      title: title || `應徵者面試 - ${candidate_id}`,
    };
    // 3.開始transaction
    await conn.beginTransaction();
    await InterviewModel.createWithTransaction(conn, interviewData);
    await conn.commit();
    res.status(201).json({ message: "面試安排成功" });
  } catch (error) {
    await conn.rollback();
    console.error("Create Interview Error:", error);
    res.status(500).json({ message: "安排面試失敗，伺服器錯誤" });
  } finally {
    conn.release();
  }
};

// 更新面試
export const updateInterview = async (req, res) => {
  const { id } = req.params;
  const patch = req.body;
  const conn = await db.getConnection();
  try {
    await conn.beginTransaction();
    await InterviewModel.updateWithTransaction(conn, id, patch);
    await conn.commit();
    res.json({ message: "面試更新成功" });
  } catch (error) {
    await conn.rollback();
    if (error.message.includes("衝突") || error.message.includes("不存在")) {
      return res.status(400).json({ message: error.message });
    }
    console.error("Update Interview Error:", error);
    res.status(500).json({ message: "更新面試失敗" });
  } finally {
    conn.release();
  }
};

// 取消面試
export const cancelInterview = async (req, res) => {
  const { id } = req.params;
  const conn = await db.getConnection();
  try {
    await conn.beginTransaction();
    await InterviewModel.deleteWithTransaction(conn, id);
    await conn.commit();
    res.json({ message: "面試已成功取消" });
  } catch (error) {
    await conn.rollback();
    console.error("Delete Interview Error:", error);
    res.status(500).json({ message: "取消失敗" });
  } finally {
    conn.release();
  }
};
