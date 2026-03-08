import express from 'express';
// 引入cors: 允許來自 Vue 前端的請求進入
import cors from 'cors';
import 'dotenv/config';
import path from 'path';
import { fileURLToPath } from 'url';
// 引入資料庫和路由
import db from './config/db.js';
import systemRoutes from './routes/systemRoutes.js';
import userRoutes from './routes/userRoutes.js';
import deptRoutes from './routes/deptRoutes.js';
import candidateRoutes from './routes/candidateRoutes.js';

import taskRoutes from './routes/taskRoutes.js';
import bookingRoutes from './routes/bookingRoutes.js';

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 中間件設定
app.use(cors());
app.use(express.json());

// 靜態檔案服務
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// 註冊路徑
app.use('/api/system', systemRoutes);
app.use('/api/departments', deptRoutes);

app.use('/api/users', userRoutes);
app.use('/api/candidates', candidateRoutes);

app.use('/api/tasks', taskRoutes);
app.use('/api/bookings', bookingRoutes);

// 錯誤處理中間件
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: '系統發生錯誤' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`後端伺服器運作中：http://localhost:${PORT}`);
});
