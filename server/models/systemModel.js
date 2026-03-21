import db from '../config/db.js';

const SystemModel = {
  // 系統初始化數據
  async getSystemOptions() {
    const [depts] = await db.execute('SELECT id, name FROM departments');
    const [sources] = await db.execute('SELECT id, name FROM sources');
    const [categories] = await db.execute(
      'SELECT id, name FROM job_categories'
    );
    const [jobs] = await db.execute(
      'SELECT id, job_name as name, category_id FROM jobs ORDER BY id'
    );
    return {
      departments: depts,
      sources: sources,
      job_categories: categories,
      jobs: jobs
    };
  },
  // 部門管理
  async getDepartments() {
    const sql = `
      SELECT d.*, u.real_name as manager_name 
      FROM departments d 
      LEFT JOIN users u ON d.manager_id = u.id 
      ORDER BY d.id ASC`;
    const [rows] = await db.execute(sql);
    return rows;
  },
  async updateDepartment(id, data) {
    const { name, manager_id, description } = data;
    const sql = `UPDATE departments SET name=?, manager_id=?, description=? WHERE id=?`;
    return await db.execute(sql, [name, manager_id || null, description, id]);
  },
  async addDepartment(data) {
    const { name, manager_id, description } = data;
    const sql = `INSERT INTO departments (name, manager_id, description) VALUES (?, ?, ?)`;
    return await db.execute(sql, [name, manager_id || null, description]);
  },
  // 人才來源
  async getSources() {
    const [rows] = await db.execute('SELECT * FROM sources ORDER BY id ASC');
    return rows;
  },
  async addSource(name, type) {
    return await db.execute('INSERT INTO sources (name, type) VALUES (?, ?)', [
      name,
      type || 'External'
    ]);
  },
  async updateSource(id, name, type) {
    return await db.execute('UPDATE sources SET name=?, type=? WHERE id=?', [
      name,
      type,
      id
    ]);
  },
  // 職位類別
  async getCategories() {
    const [rows] = await db.execute(
      'SELECT * FROM job_categories ORDER BY id ASC'
    );
    return rows;
  },
  async addCategory(name) {
    return await db.execute('INSERT INTO job_categories (name) VALUES (?)', [
      name
    ]);
  },
  async updateCategory(id, name) {
    return await db.execute('UPDATE job_categories SET name=? WHERE id=?', [
      name,
      id
    ]);
  },
  // 職位管理
  async getJobs() {
    const sql = `
      SELECT j.*, jc.name as category_name 
      FROM jobs j 
      JOIN job_categories jc ON j.category_id = jc.id 
      ORDER BY j.id DESC`;
    const [rows] = await db.execute(sql);
    return rows;
  },
  async addJob(data) {
    const { category_id, job_name, description } = data;
    return await db.execute(
      'INSERT INTO jobs (category_id, job_name, description) VALUES (?, ?, ?)',
      [category_id, job_name, description]
    );
  },
  async updateJob(id, data) {
    const { category_id, job_name, description } = data;
    const sql = `UPDATE jobs SET category_id=?, job_name=?, description=? WHERE id=?`;
    return await db.execute(sql, [category_id, job_name, description, id]);
  },

  // 刪除安全性檢查（外鍵約束）
  async checkUsage(table, id) {
    // 檢查表格是否合法
    const ALLOWED_TABLES = ['departments', 'jobs', 'job_categories', 'sources'];
    if (!ALLOWED_TABLES.includes(table)) return null;
    const checks = {
      // 部門
      departments: [
        {
          sql: 'SELECT id FROM users WHERE dept_id = ? LIMIT 1',
          msg: '該部門下尚有用戶存在'
        },
        {
          sql: 'SELECT id FROM candidates WHERE dept_id = ? LIMIT 1',
          msg: '該部門下已有應徵者資料'
        }
      ],
      // 職位
      jobs: [
        {
          sql: 'SELECT id FROM candidates WHERE job_id = ? LIMIT 1',
          msg: '該職位已有應徵者投遞，不可刪除'
        }
      ],
      // 職位類別
      job_categories: [
        {
          sql: 'SELECT id FROM jobs WHERE category_id = ? LIMIT 1',
          msg: '該類別下尚有職位，請先處理職位'
        }
      ],
      // 人才來源
      sources: [
        {
          sql: 'SELECT id FROM candidates WHERE source_id = ? LIMIT 1',
          msg: '已有應徵者標記為此來源'
        }
      ]
    };
    const tableChecks = checks[table];
    if (!tableChecks) return null;

    for (const check of tableChecks) {
      const [rows] = await db.execute(check.sql, [id]);
      if (rows.length > 0) {
        return check.msg;
      }
    }
    return null;
  },
  // 通用刪除功能
  async deleteRecord(table, id) {
    return await db.execute(`DELETE FROM ${table} WHERE id = ?`, [id]);
  }
};

export default SystemModel;
