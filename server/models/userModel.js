import db from '../config/db.js';
import bcrypt from 'bcrypt';

const UserModel = {
  // 登入專用：獲取完整資訊含密碼
  findByUsername: async (username) => {
    const sql = `
      SELECT u.*, d.name as dept_name 
      FROM users u 
      LEFT JOIN departments d ON u.dept_id = d.id 
      WHERE u.username = ?
    `;
    const [rows] = await db.execute(sql, [username]);
    return rows[0];
  },

  // 通過ID獲取用戶資訊
  findById: async (id) => {
    const sql = `
      SELECT u.id, u.username, u.real_name, u.role, u.dept_id, u.status, d.name as dept_name 
      FROM users u 
      LEFT JOIN departments d ON u.dept_id = d.id 
      WHERE u.id = ?
    `;
    const [rows] = await db.execute(sql, [id]);
    return rows[0];
  },

  // 列表查詢：含分頁、篩選與 JOIN
  findAll: async ({ dept_id, role, status, limit, offset }) => {
    let sql = `
      SELECT u.id, u.username, u.real_name, u.role, u.dept_id, u.status, u.last_login, u.createAt,
             d.name as dept_name
      FROM users u
      LEFT JOIN departments d ON u.dept_id = d.id
      WHERE 1=1
    `;
    let params = [];

    if (dept_id) {
      sql += ' AND u.dept_id = ?';
      params.push(dept_id);
    }
    if (role) {
      sql += ' AND u.role = ?';
      params.push(role);
    }
    if (status) {
      sql += ' AND u.status = ?';
      params.push(status);
    }

    const countSql = `SELECT COUNT(*) as total FROM (${sql}) as temp`;
    const [countResult] = await db.execute(countSql, params);

    sql += ' ORDER BY u.createAt DESC LIMIT ? OFFSET ?';
    params.push(String(limit), String(offset));

    const [rows] = await db.execute(sql, params);
    return { users: rows, total: countResult[0].total };
  },
  // 新增用戶
  create: async (userData) => {
    const sql = `
      INSERT INTO users (id, username, password, real_name, role, dept_id, created_by) 
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `;
    const { id, username, password, real_name, role, dept_id, created_by } =
      userData;
    return await db.execute(sql, [
      id,
      username,
      password,
      real_name,
      role,
      dept_id,
      created_by
    ]);
  },
  // 更新用戶
  update: async (id, updateData) => {
    let fields = [];
    let params = [];
    // 定義允許更新的白名單欄位
    const allowedFields = [
      'username',
      'real_name',
      'role',
      'dept_id',
      'status',
      'password'
    ];
    for (const [key, value] of Object.entries(updateData)) {
      if (allowedFields.includes(key) && value !== undefined) {
        if (key === 'password') {
          if (value.trim() !== '') {
            const hashedPassword = await bcrypt.hash(value, 10);
            fields.push(`${key} = ?`);
            params.push(hashedPassword);
          }
          continue;
        }
        fields.push(`${key} = ?`);
        params.push(value);
      }
    }
    // 沒有有效的更新欄位
    if (fields.length === 0) return null;
    params.push(id);
    const sql = `UPDATE users SET ${fields.join(', ')} WHERE id = ?`;
    return await db.execute(sql, params);
  },
  // 獲取HR列表（供前端下拉選單使用）
  getHrList: async () => {
    const sql = `
    SELECT 
      id as value, 
      real_name as label 
    FROM users 
    WHERE role IN ('super_admin', 'dept_hr') 
      AND status = 'active'
      AND id IS NOT NULL
      AND real_name IS NOT NULL
    ORDER BY real_name ASC
    `;
    const [rows] = await db.execute(sql);
    return rows;
  },
  // 獲取面試官列表（供前端下拉選單使用）
  getInterviewerList: async () => {
    const sql =
      "SELECT id as value, real_name as label, dept_id FROM users WHERE role = 'interviewer' AND status = 'active' AND id IS NOT NULL AND real_name IS NOT NULL ORDER BY real_name ASC ";
    const [rows] = await db.execute(sql);
    return rows;
  }
};

export default UserModel;
