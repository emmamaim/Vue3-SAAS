import db from "../config/db.js";

// 獲取任務
export const getAllTasks = async (req, res) => {
  try {
    const [rows] = await db.execute(
      "SELECT * FROM tasks ORDER BY createAt DESC",
    );
    res.json({ data: rows });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 新增任務
export const createTasks = async (req, res) => {
  const { title, status, priority, description, dueDate } = req.body;
  // 生成隨機ID
  const id = "t_" + Date.now();
  try {
    const sql =
      "INSERT INTO tasks (id, title, status, priority, description, dueDate) VALUES (?, ?, ?, ?, ?, ?)";
    await db.execute(sql, [id, title, status, priority, description, dueDate]);
    res.status(201).json({ message: "新增成功", data: { id, ...req.body } });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// 更新任務
export const updateTask = async (req, res) => {
  // 任務ID以及需要更新的内容
  const { id } = req.params;
  const patch = req.body;
  try {
    // 白名單過濾：過濾掉不應該出現在 SQL 裡的欄位
    const allowedFields = [
      "title",
      "status",
      "priority",
      "description",
      "dueDate",
    ];
    const updateKeys = Object.keys(patch).filter((key) =>
      allowedFields.includes(key),
    );
    // 非空判斷
    if (updateKeys.length === 0)
      return res.status(400).json({ error: "無效的更新内容" });
    // 動態sql：更新傳過來的内容
    const fields = updateKeys.map((key) => `${key}=?`).join(",");
    const values = updateKeys.map((key) => patch[key]);
    const sql = `UPDATE tasks SET ${fields}, updateAt = NOW() WHERE id = ?`;
    await db.execute(sql, [...values, id]);
    // 重新查詢更新後的結果
    const [rows] = await db.execute("SELECT * FROM tasks WHERE id = ?", [id]);
    res.json({ message: "更新成功", data: rows[0] });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

// 刪除任務
export const removeTask = async (req, res) => {
  // 任務ID
  const { id } = req.params;
  try {
    await db.execute("DELETE FROM tasks WHERE id = ?", [id]);
    res.json({ message: "刪除成功" });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};
