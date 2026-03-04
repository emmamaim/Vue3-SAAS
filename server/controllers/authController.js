// 連接資料庫
const db = require("../config/db");
// 密碼加密與驗證
const bcrypt = require("bcrypt");
// 生成與驗證 JSON Web Token (JWT)
const jwt = require("jsonwebtoken");

// 注冊（由super_admin操作）
exports.register = async (req, res) => {
  const {
    id,
    username,
    password,
    real_name,
    role,
    dept,
    created_by = null,
  } = req.body;
  try {
    // 1.檢查賬號是否存在
    const [existingUser] = await db.execute(
      "SELECT * FROM users WHERE username = ?",
      [username],
    );
    if (existingUser.length > 0) {
      return res.status(400).json({ message: "該帳號已被使用" });
    }
    // 2.密碼雜湊化
    const hashedPassword = await bcrypt.hash(password, 10);
    // 3.存入資料庫
    await db.execute(
      "INSERT INTO users (id, username, password, real_name, role, dept, created_by) VALUES (?, ?, ?, ?, ?, ?, ?)",
      [id, username, hashedPassword, real_name, role, dept, created_by],
    );
    res.status(201).json({
      message: "用戶建立成功",
      user: { username, real_name, role },
    });
  } catch (error) {
    console.error("Register Error:", error);
    res.status(500).json({ message: "伺服器錯誤" });
  }
};

// 登入
exports.login = async (req, res) => {
  const { username, password } = req.body;
  try {
    // 1.檢查賬號是否存在
    const [users] = await db.execute("SELECT * FROM users WHERE username = ?", [
      username,
    ]);
    const user = users[0];
    if (!user) {
      return res.status(401).json({ message: "帳號或密碼錯誤" });
    }
    // 2.比對密碼
    const isMatch = await bcrypt.compare(String(password), user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "帳號或密碼錯誤" });
    }
    // 3. 更新最後登入時間
    db.execute("UPDATE users SET last_login = NOW() WHERE id = ?", [
      user.id,
    ]).catch((err) => console.error("Update login time failed:", err));
    // 4. 簽發JWT Token (含id,role,dept)
    const token = jwt.sign(
      { id: user.id, role: user.role, dept: user.dept },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN },
    );
    res.json({
      message: "登入成功",
      token,
      user: {
        id: user.id,
        username: user.username,
        real_name: user.real_name,
        role: user.role,
        dept: user.dept,
      },
    });
  } catch (error) {
    console.error("Login Error:", error);
    res.status(500).json({ message: "伺服器錯誤" });
  }
};
