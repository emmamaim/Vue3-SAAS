import db from '../config/db.js';

// 人才來源與職位類別 統一配置
export const getSystemInitData = async (req, res) => {
  try {
    const [depts] = await db.execute('SELECT id, name FROM departments');
    const [sources] = await db.execute('SELECT id, name FROM sources');
    const [categories] = await db.execute(
      'SELECT id, name FROM job_categories'
    );

    // 返回大物件 => Pinia
    res.json({
      departments: depts,
      sources: sources,
      job_categories: categories
    });
  } catch (error) {
    res.status(500).json({ message: '獲取系統配置失敗' });
  }
};

// 根據職位類別獲取具體職位
export const getJobsByCategory = async (req, res) => {
  const { categoryId } = req.params;
  try {
    const [jobs] = await db.execute(
      'SELECT id, job_name FROM jobs WHERE category_id = ? ORDER BY id',
      [categoryId]
    );
    res.json({ data: jobs });
  } catch (error) {
    res.status(500).json({ message: '獲取職位列表失敗' });
  }
};
