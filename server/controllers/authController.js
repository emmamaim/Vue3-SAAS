import UserModel from '../models/userModel.js';
// 密碼加密與驗證
import bcrypt from 'bcrypt';
// 生成與驗證 JSON Web Token (JWT)
import jwt from 'jsonwebtoken';

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
    // 設定 HttpOnly Cookie
    res.cookie('token', token, {
      // 防止XSS攻擊
      httpOnly: true,
      // 生產環境https才啟用
      secure: process.env.NODE_ENV === 'production',
      // 現代瀏覽器防禦 CSRF 的建議設定
      sameSite: 'Lax',
      // 有效期24小時
      maxAge: 24 * 60 * 60 * 1000
    });
    res.json({
      user: {
        id: user.id,
        username: user.username,
        real_name: user.real_name,
        role: user.role,
        dept_name: user.dept_name
      }
    });
  } catch (error) {
    console.log('!!! 登入 Controller 發生錯誤 !!!');
    console.error(error);
    res.status(500).json({
      message: '伺服器錯誤',
      detail: error.message
    });
  }
};

// 登出
export const logout = (req, res) => {
  res.clearCookie('token', {
    httpOnly: true,
    sameSite: 'Lax',
    secure: process.env.NODE_ENV === 'production'
  });
  res.json({ success: true, message: '已安全登出' });
};

// 檢查 Cookie 是否有效並重新獲取用戶資訊
export const getMe = async (req, res) => {
  try {
    const user = await UserModel.findById(req.user.id);
    if (!user) return res.status(404).json({ message: '用戶不存在' });
    res.json({
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
