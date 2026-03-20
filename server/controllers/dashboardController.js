import DashboardModel from '../models/dashboardModel.js';

// 管理員
export const getAdminDashboard = async (req, res) => {
  try {
    const { role } = req.user;
    // 權限二次檢查
    if (role !== 'super_admin') {
      return res.status(403).json({
        success: false,
        message: '權限不足，僅限管理員訪問此數據'
      });
    }
    const data = await DashboardModel.getAdminSummary();
    res.json({
      success: true,
      data: {
        stats: data.stats,
        sourceData: data.sourceData,
        trend: data.trend,
        updatedAt: new Date()
      }
    });
  } catch (error) {
    console.error('Get Admin Dashboard Error:', error);
    res.status(500).json({
      success: false,
      message: '獲取管理員儀表板數據失敗'
    });
  }
};

// HR
export const getHrDashboard = async (req, res) => {
  try {
    const { id: hrId, role } = req.user;
    // 權限二次檢查
    if (role !== 'dept_hr') {
      return res.status(403).json({
        success: false,
        message: '權限不足，僅限 HR 訪問此數據'
      });
    }
    const data = await DashboardModel.getHrSummary(hrId);
    res.json({
      success: true,
      data: {
        stats: data.stats,
        statusData: data.statusData,
        trend: data.trend,
        upcoming: data.upcoming,
        updatedAt: new Date()
      }
    });
  } catch (error) {
    console.error('Get HR Dashboard Error:', error);
    res.status(500).json({
      success: false,
      message: '獲取 HR 儀表板數據失敗'
    });
  }
};

// 面試官
export const getInterviewerDashboard = async (req, res) => {
  try {
    const { id: userId, role } = req.user;
    // 權限二次檢查
    if (role !== 'interviewer') {
      return res.status(403).json({
        success: false,
        message: '權限不足，僅限面試官訪問此數據'
      });
    }
    const data = await DashboardModel.getInterviewerSummary(userId);
    res.json({
      success: true,
      data: {
        stats: data.stats,
        distribution: data.distribution,
        trend: data.trend,
        updatedAt: new Date()
      }
    });
  } catch (error) {
    console.error('Get Interviewer Dashboard Error:', error);
    res.status(500).json({
      success: false,
      message: '獲取面試官儀表板數據失敗'
    });
  }
};
