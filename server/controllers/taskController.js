const db = require("../config/db");

// 獲取任務
exports.getAllTasks = async (req, res) => {
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
exports.createTasks = async (req, res) => {
  const { title, status, priority, description, dueDate } = req.body;
  // 生成隨機ID
  const id = "t_" + Date.now();
  try {
    const sql =
      "INSERT INTO tasks (id, title, status, priority, description, dueDate) VALUES (?, ?, ?, ?, ?, ?)";
    await db.execute(sql, [title, status, priority, description, dueDate]);
    res.status(201).json({ message: "建立成功", data: { id, ...req.body } });
  } catch {
    res.status(500).json({ message: err.message });
  }
};
