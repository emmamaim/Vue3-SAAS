import DashboardModel from "../models/dashboardModel.js";

export const getAdminDashboard = async (req, res) => {
  try {
    const { role } = req.user;
    // 權限二次檢查
    if (role !== "super_admin") {
      return res.status(403).json({
        success: false,
        message: "權限不足，僅限管理員訪問此數據",
      });
    }
    const data = await DashboardModel.getAdminSummary();
    res.json({
      success: true,
      data: {
        stats: data.stats,
        sourceData: data.sourceData,
        trend: data.trend,
        updatedAt: new Date(),
      },
    });
  } catch (error) {
    console.error("Get Admin Dashboard Error:", error);
    res.status(500).json({
      success: false,
      message: "獲取管理員儀表板數據失敗",
    });
  }
};

export const getInterviewerDashboard = async (req, res) => {
  try {
    const { id: userId, role } = req.user;
    // 權限二次檢查
    if (role !== "interviewer") {
      return res.status(403).json({
        success: false,
        message: "權限不足，僅限面試官訪問此數據",
      });
    }
    const data = await DashboardModel.getInterviewerSummary(userId);
    res.json({
      success: true,
      data: {
        stats: data.stats,
        distribution: data.distribution,
        trend: data.trend,
        updatedAt: new Date(),
      },
    });
  } catch (error) {
    console.error("Get Interviewer Dashboard Error:", error);
    res.status(500).json({
      success: false,
      message: "獲取面試官儀表板數據失敗",
    });
  }
};
