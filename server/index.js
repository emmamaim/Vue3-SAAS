const express = require("express");
// 引入cors: 允許來自 Vue 前端的請求進入
const cors = require("cors");
// 引入資料庫連線設定
const db = require("./config/db");
require("dotenv").config();
// 引入路由
const taskRoutes = require("./routes/taskRoutes");
const bookingRoutes = require("./routes/bookingRoutes");
const app = express();

// 中間件設定
app.use(cors());
app.use(express.json());

// 註冊路徑
app.use("/api/tasks", taskRoutes);
app.use("/api/bookings", bookingRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`後端伺服器運作中：http://localhost:${PORT}`);
});
