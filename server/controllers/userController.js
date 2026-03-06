import db from "../config/db.js";
// 密碼加密與驗證
import bcrypt from "bcrypt";
// 生成與驗證 JSON Web Token (JWT)
import jwt from "jsonwebtoken";
// 生成隨機ID
import crypto from "node:crypto";

// 登入
export const login = async (req, res) => {
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
    // 2.檢查是否被停用
    if (user.status === "disabled") {
      return res.status(403).json({ message: "該帳號已被停用，請聯繫管理員" });
    }
    // 3.比對密碼
    const isMatch = await bcrypt.compare(String(password), user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "帳號或密碼錯誤" });
    }
    // 4.更新最後登入時間
    db.execute("UPDATE users SET last_login = NOW() WHERE id = ?", [
      user.id,
    ]).catch((err) => console.error("Update login time failed:", err));
    // 5. 簽發JWT Token (含id,role,dept)
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

// 獲取用戶列表
export const getUserList = async (req, res) => {
  try {
    // 分頁 / 篩選分類功能設定
    const page = parseInt(req.query.page) || 1;
    const pageSize = parseInt(req.query.pageSize) || 10;
    const { dept, role, status } = req.query;
    // 需要跳過的資料數目
    const offset = (page - 1) * pageSize;

    let sql =
      "SELECT id, username, real_name, role, dept, status, last_login, createAt FROM users WHERE 1=1";
    let params = [];
    // 動態拼接篩選條件
    if (dept) {
      sql += " AND dept = ?";
      params.push(dept);
    }
    if (role) {
      sql += " AND role = ?";
      params.push(role);
    }
    if (status) {
      sql += " AND status = ?";
      params.push(status);
    }
    // 獲取縂筆數
    const [totalResult] = await db.execute(
      sql.replace(
        "id, username, real_name, role, dept, status, last_login, createAt",
        "COUNT(*) as total",
      ),
      params,
    );
    const total = totalResult[0].total;
    // 分頁sql
    sql += " ORDER BY createAt DESC LIMIT ? OFFSET ?";
    params.push(pageSize, offset);
    const [users] = await db.execute(sql, params);
    res.json({
      message: "獲取用戶列表成功",
      data: users,
      total,
      page,
      pageSize,
    });
  } catch (error) {
    res.status(500).json({ message: "伺服器錯誤" });
  }
};

// 新增用戶
export const createUser = async (req, res) => {
  const { username, password, real_name, role, dept } = req.body;
  // 嚴格校驗必填欄位
  if (!username || !password || !real_name || !role || !dept) {
    return res
      .status(400)
      .json({ message: "資料填寫不完整，所有欄位皆為必填" });
  }
  // 獲取當前操作者ID（通過auth middleware）
  const adminId = req.user.id;
  try {
    // 1.檢查賬號是否存在
    const [existingUser] = await db.execute(
      "SELECT * FROM users WHERE username = ?",
      [username],
    );
    if (existingUser.length > 0) {
      return res.status(400).json({ message: "該帳號已被使用" });
    }
    // 2.密碼雜湊化 + 生成自定義ID
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUserId = `u_${crypto.randomBytes(4).toString("hex")}`;
    // 3.存入資料庫
    await db.execute(
      "INSERT INTO users (id, username, password, real_name, role, dept, created_by) VALUES (?, ?, ?, ?, ?, ?, ?)",
      [newUserId, username, hashedPassword, real_name, role, dept, adminId],
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

// 更新用戶信息
export const updateUser = async (req, res) => {
  const { id } = req.params;
  const { username, real_name, role, dept, password } = req.body;
  try {
    // 1.檢查賬號是否存在
    const [user] = await db.execute("SELECT * FROM users WHERE id = ?", [id]);
    if (user.length === 0) {
      return res.status(404).json({ message: "找不到該用戶" });
    }

    let sql =
      "UPDATE users SET username = ?, real_name = ?, role = ?, dept = ?";
    let params = [username, real_name, role, dept];
    // 2.判斷是否需要更改密碼
    if (password && password.trim() !== "") {
      const hashedPassword = await bcrypt.hash(password, 10);
      sql += ", password = ?";
      params.push(hashedPassword);
    }
    sql += " WHERE id = ?";
    params.push(id);
    await db.execute(sql, params);
    res.json({ message: "用戶資料更新成功" });
  } catch (error) {
    console.error("Update User Error:", error);
    res.status(500).json({ message: "伺服器錯誤" });
  }
};

// 停用/啓用用戶（軟刪除）
export const toggleUserStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  const adminId = req.user.id;
  try {
    // 1.防止管理員誤操作停用自己
    if (parseInt(id) === adminId) {
      return res.status(400).json({ message: "您不能停用自己的帳號" });
    }
    // 2.用戶狀態更新
    const sql = "UPDATE users SET status = ? WHERE id = ?";
    const [result] = await db.execute(sql, [status, id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "找不到該用戶" });
    }
    res.json({
      message: status === "disabled" ? "用戶已停用" : "用戶已啟用",
      status: status,
    });
  } catch (error) {
    console.error("Toggle Status Error:", error);
    res.status(500).json({ message: "伺服器錯誤" });
  }
};
