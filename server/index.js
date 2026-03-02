const express = require("express");
// 引入cors: 允許來自 Vue 前端的請求進入
const cors = require("cors");
// 引入資料庫連線設定
const db = require("./config/db");
require("dotenv").config();
// 引入路由
const taskRoutes = require('./routes/taskRoutes');
const app = express();

// 中間件設定
app.use(cors());
app.use(express.json());

// 註冊路徑：將所有 /api/tasks 的請求導向 taskRoutes
app.use('/api/tasks', taskRoutes);

// 測試資料庫連線的 API
// app.get("/api/test-db", async (req, res) => {
//   try {
//     // 抓取資料
//     const [rows] = await db.query("SELECT * FROM tasks");
//     res.json({
//       message: "資料庫連線成功！",
//       data: rows,
//     });
//   } catch (err) {
//     // 連線失敗: 回傳錯誤訊息
//     res.status(500).json({
//       error: "資料庫讀取失敗",
//       details: err.message,
//     });
//   }
// });

const PORT = process.env.PROT || 3000;
app.listen(3000, () => {
  console.log(`後端伺服器運作中：http://localhost:${PORT}`);
});
