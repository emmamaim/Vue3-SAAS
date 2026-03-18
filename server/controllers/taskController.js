import TaskModel from "../models/taskModel.js";

// 獲取任務
export const getTasks = async (req, res) => {
  try {
    const userId = req.user.id;
    const tasks = await TaskModel.findAllByUserId(userId);
    res.json({
      success: true,
      data: tasks,
    });
  } catch (error) {
    console.error("Get Tasks Error:", error);
    res.status(500).json({ success: false, message: "獲取任務列表失敗" });
  }
};

// 提交面試評價
export const completeInterview = async (req, res) => {
  try {
    const taskId = req.params.id;
    const { result, comments } = req.body;
    const currentUserId = req.user.id;
    // 檢查任務是否存在且屬於該面試官
    const task = await TaskModel.getById(taskId);
    if (!task) {
      return res.status(404).json({ success: false, message: "找不到該任務" });
    }
    if (task.user_id !== currentUserId) {
      return res
        .status(403)
        .json({ success: false, message: "無權操作此任務" });
    }
    // 方便前端頁面展示（面試官可更改評價再次提交）
    // if (task.status === "done") {
    //   return res
    //     .status(400)
    //     .json({ success: false, message: "該任務已完成，請勿重複提交" });
    // }

    // 驗證面試評價結果
    if (!["pass", "fail", "pending"].includes(result)) {
      return res
        .status(400)
        .json({ success: false, message: "無效的面試結果狀態" });
    }
    // 執行更新
    await TaskModel.submitInterviewFeedback(taskId, {
      result,
      comments: comments.trim() || task.comments || "面試官未提供額外說明",
    });
    const updatedTask = await TaskModel.getTaskWithFeedback(taskId);
    res.json({
      success: true,
      message: "面試評價提交成功，相關行程與面試紀錄已同步更新",
      data: updatedTask,
    });
  } catch (error) {
    console.error("Complete Interview Error:", error);
    res.status(500).json({ success: false, message: "提交評價失敗" });
  }
};

// 更新任務狀態
export const updateTaskStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const currentUserId = req.user.id;
    // 權限驗證 => 確保只能更改自己的任務
    const task = await TaskModel.getById(id);
    if (!task || task.user_id !== currentUserId) {
      return res
        .status(403)
        .json({ success: false, message: "無權修改此任務狀態" });
    }
    await TaskModel.updateStatus(id, status);
    const updatedTask = await TaskModel.getTaskWithFeedback(id);
    res.json({
      success: true,
      message: "任務狀態已更新",
      data: updatedTask,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "更新任務失敗" });
  }
};
