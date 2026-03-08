import jwt from 'jsonwebtoken';

// token檢查
export const auth = (req, res, next) => {
  // 從Header抓取token
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) {
    return res.status(401).json({ message: '未提供憑證，請先登入' });
  }
  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ message: '憑證無效或已過期' });
    }
    req.user = user;
    next();
  });
};

// role檢查
export const isAdmin = (req, res, next) => {
  const { role } = req.user;
  if (role !== 'super_admin') {
    return res.status(403).json({ message: '權限不足，僅限管理員操作' });
  }
  next();
};
