import db from '../config/db.js';

const DashboardModel = {
  // 管理員
  getAdminSummary: async () => {
    // KPI: 總人才、活躍職位、今日面試總量
    const statsSql = `
      SELECT
        (SELECT COUNT(*) FROM candidates) as totalCandidates,
        (SELECT COUNT(*) FROM jobs) as activeJobs,
        (SELECT COUNT(*) FROM interviews WHERE date = CURDATE()) as totalTodayInterviews
      `;
    // 應徵者來源分佈
    const sourceSql = `
      SELECT s.name, COUNT(c.id) as count
      FROM candidates c
      JOIN sources s ON c.source_id = s.id
      GROUP BY s.name
      `;
    // 近七日全站面試量
    const trendSql = `
      SELECT DATE_FORMAT(date, '%m-%d') as dateLabel, COUNT(*) as count
        FROM interviews
        WHERE date BETWEEN DATE_SUB(CURDATE(), INTERVAL 6 DAY) AND CURDATE()
        GROUP BY date
        ORDER BY date ASC
    `;
    try {
      const [[stats]] = await db.execute(statsSql);
      const [sourceData] = await db.execute(sourceSql);
      const [trend] = await db.execute(trendSql);

      return {
        stats,
        sourceData,
        trend
      };
    } catch (error) {
      throw error;
    }
  },

  // HR
  getHrSummary: async (hrId) => {
    // KPI: 部門總應徵者、部門職位數、部門今日面試量
    const statSql = `
      SELECT 
        (SELECT COUNT(*) FROM candidates WHERE hr_id = ?) as myCandidates,
        (SELECT COUNT(DISTINCT job_id) FROM candidates WHERE hr_id = ?)  as myActiveJobs,
        (SELECT COUNT(*) FROM interviews WHERE hr_id = ? AND date = CURDATE()) as myTodayInterviews
      `;
    // 應徵者狀態分佈
    const statusSql = `
      SELECT status, COUNT(*) as count
      FROM candidates WHERE hr_id = ?
      GROUP BY status
      `;
    // 負責的面試趨勢
    const trendSql = `
      SELECT DATE_FORMAT(date, '%m-%d') as dateLabel, COUNT(*) as count
      FROM interviews WHERE hr_id = ? AND date BETWEEN DATE_SUB(CURDATE(), INTERVAL 6 DAY) AND CURDATE()
      GROUP BY date ORDER BY date ASC
      `;
    // 時間線顯示
    const upcomingSql = `
      SELECT 
        i.date, 
        i.startTime, 
        c.name as candidateName, 
        u.real_name as interviewerName,
        j.job_name
      FROM interviews i
      JOIN candidates c ON i.candidate_id = c.id
      JOIN users u ON i.interviewer_id = u.id
      JOIN jobs j ON c.job_id = j.id
      WHERE i.hr_id = ? AND i.date >= CURDATE() AND i.status = 'scheduled'
      ORDER BY i.date ASC, i.startTime ASC
      LIMIT 5
      `;
    try {
      const [[stats]] = await db.execute(statSql, [hrId, hrId, hrId]);
      const [statusData] = await db.execute(statusSql, [hrId]);
      const [trend] = await db.execute(trendSql, [hrId]);
      const [upcoming] = await db.execute(upcomingSql, [hrId]);
      return {
        stats,
        statusData,
        trend,
        upcoming
      };
    } catch (error) {
      throw error;
    }
  },

  // 面試官
  getInterviewerSummary: async (userId) => {
    // 待處理任務/今日面試/本月已完成面試
    const statsSql = `
      SELECT 
        (SELECT COUNT(*) FROM tasks WHERE user_id = ? AND status = 'todo') as pendingTasks,
        (SELECT COUNT(*) FROM interviews WHERE interviewer_id = ? AND date = CURDATE()) as todayInterviews,
        (SELECT COUNT(*) FROM interviews 
         WHERE interviewer_id = ? 
         AND status = 'completed' 
         AND MONTH(date) = MONTH(CURDATE()) 
         AND YEAR(date) = YEAR(CURDATE())) as monthlyCompleted
    `;
    // 已完成面試的結果比例
    const distributionSql = `
      SELECT result, COUNT(*) as count 
      FROM interviews 
      WHERE interviewer_id = ? AND status = 'completed'
      GROUP BY result
    `;
    // 近七日面試趨勢
    const trendSql = `
      SELECT 
        DATE_FORMAT(date, '%m-%d') as dateLabel, 
        COUNT(*) as count
      FROM interviews
      WHERE interviewer_id = ? 
        AND date BETWEEN DATE_SUB(CURDATE(), INTERVAL 6 DAY) AND CURDATE()
      GROUP BY date
      ORDER BY date ASC
    `;
    try {
      const [[stats]] = await db.execute(statsSql, [userId, userId, userId]);
      const [distribution] = await db.execute(distributionSql, [userId]);
      const [trend] = await db.execute(trendSql, [userId]);

      return {
        stats,
        distribution,
        trend
      };
    } catch (error) {
      throw error;
    }
  }
};

export default DashboardModel;
