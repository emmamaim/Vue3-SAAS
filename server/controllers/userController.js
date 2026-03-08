import UserModel from '../models/userModel.js';
// 密碼加密與驗證
import bcrypt from 'bcrypt';
// 生成與驗證 JSON Web Token (JWT)
import jwt from 'jsonwebtoken';
// 生成隨機ID
import crypto from 'node:crypto';

// 登入
export const login = async (req, res) => {
  const { username, password } = req.body;
  try {
    // 確認用戶賬號存在與狀態正常
    const user = await UserModel.findByUsername(username);
    if (!user || user.status === 'disabled') {
      return res.status(401).json({
        message: user?.status === 'disabled' ? '帳號停用' : '帳號或密碼錯誤'
      });
    }
    // 密碼驗證
    const isMatch = await bcrypt.compare(String(password), user.password);
    if (!isMatch) return res.status(401).json({ message: '帳號或密碼錯誤' });
    // 更新登入時間 (非同步執行不阻塞)
    UserModel.update(user.id, { last_login: new Date() });
    // 生成 JWT
    const token = jwt.sign(
      { id: user.id, role: user.role, dept_id: user.dept_id },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN }
    );
    res.json({
      token,
      user: {
        id: user.id,
        username: user.username,
        real_name: user.real_name,
        role: user.role,
        dept_name: user.dept_name
      }
    });
  } catch (error) {
    res.status(500).json({ message: '伺服器錯誤' });
  }
};

// 獲取HR列表
export const getHrList = async (req, res) => {
  try {
    const hrList = await UserModel.getHrList();
    res.json({
      success: true,
      data: hrList
    });
  } catch (error) {
    console.error('獲取 HR 列表出錯:', error);
    res.status(500).json({
      success: false,
      message: '伺服器錯誤',
      detail: error.message
    });
  }
};

// 獲取用戶列表
export const getUserList = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const pageSize = parseInt(req.query.pageSize) || 10;
    const { dept_id, role, status } = req.query;
    const { users, total } = await UserModel.findAll({
      dept_id,
      role,
      status,
      limit: pageSize,
      offset: (page - 1) * pageSize
    });
    res.json({ data: users, total, page, pageSize });
  } catch (error) {
    res.status(500).json({ message: '伺服器錯誤' });
  }
};

// 新增用戶
export const createUser = async (req, res) => {
  const { username, password, real_name, role, dept_id } = req.body;
  // 檢查必填欄位
  if (!username || !password || !real_name || !role) {
    return res.status(400).json({ message: '必填欄位缺失' });
  }
  try {
    const existing = await UserModel.findByUsername(username);
    if (existing) return res.status(400).json({ message: '帳號已存在' });
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUserId = `u_${crypto.randomBytes(4).toString('hex')}`;
    await UserModel.create({
      id: newUserId,
      username,
      password: hashedPassword,
      real_name,
      role,
      dept_id,
      created_by: req.user.id
    });
    res.status(201).json({ message: '用戶建立成功' });
  } catch (error) {
    res.status(500).json({ message: '伺服器錯誤' });
  }
};

// 更新用戶信息
export const updateUser = async (req, res) => {
  const { id } = req.params;
  const { username, real_name, role, dept_id, status, password } = req.body;
  try {
    // 確認用戶存在
    const user = await UserModel.findById(id);
    if (!user) {
      return res.status(404).json({ success: false, message: '找不到該用戶' });
    }
    const result = await UserModel.update(id, {
      username,
      real_name,
      role,
      dept_id,
      status,
      password
    });
    if (!result) {
      return res
        .status(400)
        .json({ success: false, message: '沒有有效的更新欄位' });
    }
    res.json({ success: true, message: '用戶資料更新成功' });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: '伺服器錯誤',
      detail: error.message
    });
  }
};

// 停用/啓用用戶（軟刪除）
export const toggleUserStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  if (id === req.user.id)
    return res.status(400).json({ message: '不能停用自己' });

  try {
    await UserModel.update(id, { status });
    res.json({ message: '狀態已更新' });
  } catch (error) {
    res.status(500).json({ message: '伺服器錯誤' });
  }
};
