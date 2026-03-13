import bookingModel from "../models/bookingModel.js";
import { v4 as uuidv4 } from "uuid";

// 獲取行程列表
export const getBookings = async (req, res) => {
  try {
    const { userId, startDate, endDate } = req.query;
    // 權限控制：
    // 管理員/HR => 可查看所有人的行程
    // 面試官 => 只能查看自己的行程
    const currentUserId = req.user.id;
    const currentUserRole = req.user.role;
    let targetUserId = null;
    // 面試官 => userId 強制設定為自己
    if (!["super_admin", "dept_hr"].includes(currentUserRole) || !userId) {
      targetUserId = currentUserId;
    }
    const data = await bookingModel.findAll({
      userId: targetUserId,
      startDate,
      endDate,
    });
    res.json({ success: true, data });
  } catch (err) {
    console.error("Critical Error:", err);
    res.status(500).json({ success: false, message: "獲取行程失敗" });
  }
};

// 新增行程
export const createBooking = async (req, res) => {
  try {
    const { title, date, startTime, endTime, userId: targetUserId } = req.body;
    const currentUserId = req.user.id;
    const currentUserRole = req.user.role;
    // 權限控制
    let finalUserId = currentUserId;
    const isStaff = ["super_admin", "dept_hr"].includes(currentUserRole);
    if (isStaff && targetUserId) {
      finalUserId = targetUserId;
    }
    // 檢查時間衝突
    const hasConflict = await bookingModel.checkConflict(
      finalUserId,
      date,
      startTime,
      endTime,
    );
    if (hasConflict) {
      return res
        .status(409)
        .json({ success: false, message: "該時段已有行程，請更換時間" });
    }
    // 寫入資料
    const bookingData = {
      // 個人行程標記
      id: `bk_p_${uuidv4()}`,
      user_id: finalUserId,
      title,
      date,
      startTime,
      endTime,
      status: "confirmed",
      relatedTaskId: null,
    };
    await bookingModel.create(bookingData);
    res.status(201).json({ success: true, message: "行程已建立" });
  } catch (error) {
    res.status(500).json({ success: false, message: "建立行程失敗" });
  }
};

// 更新預約
export const updateBooking = async (req, res) => {
  try {
    const { id } = req.params;
    const currentUserId = req.user.id;
    const currentUserRole = req.user.role;
    const patch = req.body;
    // 1.確認該筆資料是否存在且屬於該用戶(或具有 HR 權限)
    const target = await bookingModel.findById(id);
    if (!target) {
      return res
        .status(404)
        .json({ success: false, message: "找不到該行程或無權限修改" });
    }
    // 2.權限控制
    const isStaff = ["super_admin", "dept_hr"].includes(currentUserRole);
    const isOwner = target.user_id === currentUserId;
    if (!isOwner && !isStaff) {
      return res
        .status(403)
        .json({ success: false, message: "無權限修改他人行程" });
    }
    if (target.relatedTaskId && !isStaff) {
      return res.status(403).json({
        success: false,
        message: "禁止修改：面試預約僅限管理員或 HR 調整，請聯繫系統管理員",
      });
    }
    // 3.修改日期時間 => 重新檢查衝突
    const isChanged =
      (patch.date && patch.date !== target.date) ||
      (patch.startTime && patch.startTime !== target.startTime) ||
      (patch.endTime && patch.endTime !== target.endTime);
    if (isChanged) {
      const checkDate = patch.date || target.date;
      const checkStart = patch.startTime || target.startTime;
      const checkEnd = patch.endTime || target.endTime;
      const hasConflict = await bookingModel.checkConflict(
        target.user_id,
        checkDate,
        checkStart,
        checkEnd,
        id,
      );
      if (hasConflict) {
        return res
          .status(409)
          .json({ success: false, message: "修改後的時段與現有行程衝突" });
      }
    }
    // 4.執行更新
    await bookingModel.update(id, patch);
    res.json({ success: true, message: "行程已更新" });
  } catch (error) {
    res.status(500).json({ success: false, message: "更新失敗" });
  }
};

//刪除預約
export const removeBooking = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    const userRole = req.user.role;
    await bookingModel.delete(id, userId, userRole);
    res.json({ success: true, message: "刪除成功" });
  } catch (error) {
    // 捕獲 Model 拋出的 403 錯誤
    if (error.statusCode === 403) {
      return res.status(403).json({ success: false, message: error.message });
    }
    res
      .status(500)
      .json({ success: false, message: error.message || "刪除失敗" });
  }
};
