import express from 'express';
import { createServer } from 'http';
import cors from 'cors';
import 'dotenv/config';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { initSocket } from './socket/io.js';
import cookieParser from 'cookie-parser';
import {
  auth,
  isAdmin,
  isStaff,
  isInterviewer
} from './middleware/authMiddleware.js'; 

// 路由
import authRoutes from './routes/authRoutes.js';
import systemRoutes from './routes/systemRoutes.js';
import dashRoutes from './routes/dashboardRoutes.js';
import userRoutes from './routes/userRoutes.js';
import candidateRoutes from './routes/candidateRoutes.js';
import interviewRoutes from './routes/interviewRoutes.js';
import taskRoutes from './routes/taskRoutes.js';
import bookingRoutes from './routes/bookingRoutes.js';

const app = express();
const server = createServer(app);
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 初始化 WebSocket
initSocket(server);
console.log('Socket 初始化完成');

// 初始化檢查：確保資料夾存在
const uploadDir = path.join(__dirname, 'uploads', 'resumes');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
  console.log('已檢查並自動建立履歷上傳目錄: uploads/resumes');
}

// 中間件設定：允許跨域攜帶 Cookie
app.set('trust proxy', 1);
app.use(
  cors({
    origin: [
      'https://talentflow-saas.com',
      'https://www.talentflow-saas.com',
      'http://localhost:5173'
    ],
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


// 錯誤處理：中間件
app.use((err, req, res, next) => {
  console.log('!!! 捕捉到後端錯誤 !!!');
  // 針對 Multer 錯誤進行特殊處理
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ message: '檔案太大了，上限為 5MB' });
    }
    return res.status(400).json({ message: `上傳錯誤: ${err.message}` });
  }
  // 針對我們在 fileFilter 拋出的自定義錯誤
  if (err.message === '檔案格式錯誤，僅支援 PDF 與 Word') {
    return res.status(400).json({ message: err.message });
  }

  console.error(err.stack);
  res.status(500).json({
    message: err.message || '系統發生錯誤',
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`後端伺服器運作中：http://localhost:${PORT}`);
});
