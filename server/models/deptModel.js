import db from '../config/db.js';

const DeptModel = {
  findAll: async () => {
    const sql =
      'SELECT d.*, u.real_name as manager_name FROM departments d LEFT JOIN users u ON d.manager_id = u.id';
    const [rows] = await db.execute(sql);
    return rows;
  },
  getOptions: async () => {
    const [rows] = await db.execute(
      'SELECT id, name FROM departments ORDER BY name ASC'
    );
    return rows;
  },
  create: async (data) => {
    const sql =
      'INSERT INTO departments (name, manager_id, description) VALUES (?, ?, ?)';
    return await db.execute(sql, [
      data.name,
      data.manager_id,
      data.description
    ]);
  },
  update: async (id, data) => {
    const sql =
      'UPDATE departments SET name = ?, manager_id = ?, description = ? WHERE id = ?';
    return await db.execute(sql, [
      data.name,
      data.manager_id,
      data.description,
      id
    ]);
  },

  delete: async (id) => {
    // 若還有用戶屬於該部門，會觸發外鍵報錯
    return await db.execute('DELETE FROM departments WHERE id = ?', [id]);
  }
};

export default DeptModel;
