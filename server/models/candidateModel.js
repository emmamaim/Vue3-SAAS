import db from "../config/db.js";

const CandidateModel = {
  // 查詢應徵者列表（多表關聯查詢）
  getAll: async ({
    page,
    pageSize,
    keyword,
    dept_id,
    source_id,
    status,
    category_id,
    hr_id,
  }) => {
    const limit = parseInt(pageSize) || 10;
    const offset = (parseInt(page) - 1) * limit;
    let params = [];
    // 基礎sql：JOIN 所有的名稱表
    let sql = `
      SELECT c.*, 
             d.name as dept_name, 
             s.name as source_name, 
             jc.name as category_name,
             j.job_name as position_name,
             u.real_name as hr_name
      FROM candidates c
      LEFT JOIN departments d ON c.dept_id = d.id
      LEFT JOIN sources s ON c.source_id = s.id
      LEFT JOIN job_categories jc ON c.category_id = jc.id
      LEFT JOIN jobs j ON c.job_id = j.id
      LEFT JOIN users u ON c.hr_id = u.id
      WHERE c.is_active = 1
    `;
    // 動態篩選
    if (keyword && keyword.trim() !== "") {
      sql += " AND (c.name LIKE ? OR c.email LIKE ? OR c.phone LIKE ?)";
      params.push(`%${keyword}%`, `%${keyword}%`, `%${keyword}%`);
    }
    if (dept_id && dept_id !== "") {
      sql += " AND c.dept_id = ?";
      params.push(dept_id);
    }
    if (source_id && source_id !== "") {
      sql += " AND c.source_id = ?";
      params.push(source_id);
    }
    if (category_id && category_id !== "") {
      sql += " AND c.category_id = ?";
      params.push(category_id);
    }
    if (status && status !== "") {
      sql += " AND c.status = ?";
      params.push(status);
    }
    if (hr_id && hr_id !== "") {
      sql += " AND c.hr_id = ?";
      params.push(hr_id);
    }
    // 獲取總數 (使用子查詢包裹主查詢)
    const [countResult] = await db.execute(
      `SELECT COUNT(*) as total FROM (${sql}) as temp`,
      params,
    );
    // 排序和分頁
    let finalSql = sql + " ORDER BY c.createAt DESC LIMIT ? OFFSET ?";
    let finalParams = [...params, String(pageSize), String(offset)];
    // 執行查詢
    const [rows] = await db.execute(finalSql, finalParams);
    return {
      list: rows,
      total: countResult[0].total,
    };
  },
  // 查詢單筆應徵者資料：基本資訊和面試歷史
  getFullInfo: async (id) => {
    // 1.獲取應徵者基本資料
    const [rows] = await db.execute(
      `
      SELECT c.*, d.name as dept_name, s.name as source_name, j.job_name as position_name
      FROM candidates c
      LEFT JOIN departments d ON c.dept_id = d.id
      LEFT JOIN sources s ON c.source_id = s.id
      LEFT JOIN jobs j ON c.job_id = j.id
      WHERE c.id = ? AND c.is_active = 1`,
      [id],
    );
    if (rows.length === 0) return null;
    const [interviews] = await db.execute(
      `
      SELECT i.*, u.real_name as interviewer_name
      FROM interviews i 
      LEFT JOIN users u ON i.interviewer_id = u.id
      WHERE i.candidate_id = ?
      ORDER BY i.interview_round DESC
      `,
      [id],
    );
    return { ...rows[0], interviews };
  },
  // 新增應徵者
  create: async (data) => {
    const {
      id,
      name,
      email,
      phone,
      category_id,
      job_id,
      dept_id,
      source_id,
      hr_id,
      resume_url,
    } = data;
    // 1.檢查是否重複投遞（郵箱）
    const [existing] = await db.execute(
      "SELECT id FROM candidates WHERE email = ? AND is_active = 1 LIMIT 1",
      [email],
    );
    const sql = `
      INSERT INTO candidates 
      (id, name, email, phone, category_id, job_id, dept_id, source_id, hr_id, resume_url, status, is_active) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'screening', 1)
    `;
    await db.execute(sql, [
      id,
      name,
      email,
      phone,
      category_id,
      job_id,
      dept_id,
      source_id,
      hr_id || null,
      resume_url || null,
    ]);
    // 2.重複投遞標記
    return { id, isRepeated: existing.length > 0 };
  },
  // 更新應徵者資料
  update: async (id, data) => {
    const {
      name,
      email,
      phone,
      category_id,
      job_id,
      dept_id,
      source_id,
      hr_id,
      resume_url,
      status,
    } = data;
    const sql = `
    UPDATE candidates SET
      name = ?, email = ?, phone = ?, category_id= ?, 
      job_id = ?, dept_id = ?, source_id = ?, 
      hr_id = ?, resume_url = ?, status = ?
    WHERE id = ?
    `;
    const [result] = await db.execute(sql, [
      name,
      email,
      phone,
      category_id,
      job_id,
      dept_id,
      source_id,
      hr_id,
      resume_url,
      status,
      id,
    ]);
    return result.affectedRows > 0;
  },
  // 封存應徵者（軟刪除）
  archive: async (id) => {
    const sql = "UPDATE candidates SET is_active = 0 WHERE id = ?";
    const [result] = await db.execute(sql, [id]);
    return result.affectedRows > 0;
  },
};

export default CandidateModel;
