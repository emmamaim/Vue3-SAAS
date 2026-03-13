import jwt from "jsonwebtoken";

// 1. 基礎token檢查
export const auth = (req, res, next) => {
  // 從Header抓取token
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (!token) {
    return res.status(401).json({ message: "未提供憑證，請先登入" });
  }
  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ message: "憑證無效或已過期" });
    }
    req.user = user;
    next();
  });
};

// 2. role檢查
// 管理員：負責用戶管理 (User CRUD)
export const isAdmin = (req, res, next) => {
  const { role } = req.user;
  if (role !== "super_admin") {
    return res.status(403).json({ message: "權限不足，僅限管理員操作" });
  }
  next();
};

// 業務操作者：管理員 + HR (負責應徵者管理、面試安排等)
export const isStaff = (req, res, next) => {
  const { role } = req.user;
  const allowedRoles = ["super_admin", "dept_hr"];
  if (!allowedRoles.includes(role)) {
    return res.status(403).json({ message: "權限不足，僅限管理員或 HR 操作" });
  }
  next();
};

// 個人執行者：面試官 (僅限查看自己的任務清單)
export const isInterviewer = (req, res, next) => {
  if (req.user.role !== "interviewer") {
    return res.status(403).json({ message: "此操作僅限面試官權限" });
  }
  next();
};
