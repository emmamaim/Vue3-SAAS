import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import {
  auth,
  isAdmin,
  isStaff,
  isInterviewer
} from './middleware/authMiddleware.js';
// 引入資料庫和路由
import db from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import systemRoutes from './routes/systemRoutes.js';
import dashRoutes from './routes/dashboardRoutes.js';
import userRoutes from './routes/userRoutes.js';
import candidateRoutes from './routes/candidateRoutes.js';
import interviewRoutes from './routes/interviewRoutes.js';
import taskRoutes from './routes/taskRoutes.js';
import bookingRoutes from './routes/bookingRoutes.js';
import cookieParser from 'cookie-parser';

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 初始化檢查：確保uploads資料夾存在
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
  console.log('已自動建立 uploads 資料夾');
}

// 中間件設定：允許跨域攜帶 Cookie
app.use(
  cors({
    origin: 'http://localhost:5173',
    credentials: true
  })
);
app.use(express.json());
app.use(cookieParser());

// 增加解析 urlencoded 資料 (處理 form 提交)
app.use(express.urlencoded({ extended: true }));

// 靜態檔案服務
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// 註冊路徑
// 1. 公共登入登出/系統層/數據分析
app.use('/api/auth', authRoutes);
app.use('/api/system', systemRoutes);
app.use('/api/dashboard', dashRoutes);

// 2. 系統管理層 (僅限超級管理員)
app.use('/api/users', userRoutes);

// 3. 業務操作層 (管理員與 HR)
app.use('/api/candidates', auth, isStaff, candidateRoutes);
app.use('/api/interviews', auth, isStaff, interviewRoutes);

// 4. 個人執行層 (面試官)
app.use('/api/tasks', auth, isInterviewer, taskRoutes);
app.use('/api/bookings', auth, bookingRoutes);

// 資料庫與伺服器啟動
// 1. 測試資料庫連線
db.getConnection()
  .then((conn) => {
    console.log('雲端資料庫連線成功！');
    conn.release();
  })
  .catch((err) => {
    console.error('資料庫連線失敗:', err.message);
  });

// 2. 真正的錯誤處理中間件
app.use((err, req, res, next) => {
  console.log('!!! 捕捉到後端錯誤 !!!');
  console.error(err.stack);
  res.status(500).json({
    message: err.message || '系統發生錯誤',
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`後端伺服器運作中：http://localhost:${PORT}`);
});
