import mysql from 'mysql2/promise';
import 'dotenv/config';

// rocess.env.XXX: Node.js 讀取 .env 檔案內容
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  // 強制讓資料庫回傳字串而不是Date物件
  dateStrings: true,
  // 設置本地時區
  timezone: '+08:00',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// === 新增：啟動即時測試連線 ===
(async () => {
  try {
    const connection = await pool.getConnection();
    console.log('[Database] 雲端資料庫連線成功！');
    connection.release();
  } catch (err) {
    console.error('[Database] 資料庫連線失敗！');
    console.error('錯誤詳細資訊：', err.message);
    console.error('請檢查 .env 中的 DB_PASSWORD 是否正確。');
  }
})();

export default pool;
