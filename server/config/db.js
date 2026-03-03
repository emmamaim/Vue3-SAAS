const mysql = require("mysql2");
// 載入.env設定
require("dotenv").config();

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
  queueLimit: 0,
});

// 轉爲Promise版本 => 後續async/await
const promisePool = pool.promise();

module.exports = promisePool;