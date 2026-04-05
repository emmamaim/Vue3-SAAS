/** 共用的趨勢資料 (用於折線圖) */
export interface TrendData {
  dateLabel: string;
  count: number;
}

/** 共用的分佈資料 (用於圓餅圖) */
export interface DistributionData {
  name?: string;
  status?: string;
  result?: string;
  count: number;
}

/** 管理員看板數據 */
export interface AdminDashboardData {
  stats: {
    totalCandidates: number;
    activeJobs: number;
    totalTodayInterviews: number;
  };
  sourceData: DistributionData[];
  trend: TrendData[];
  updatedAt: string;
}

/** HR 看板數據 */
export interface HrDashboardData {
  stats: {
    myCandidates: number;
    myActiveJobs: number;
    myTodayInterviews: number;
  };
  statusData: DistributionData[];
  trend: TrendData[];
  upcoming: {
    date: string;
    startTime: string;
    candidateName: string;
    interviewerName: string;
    job_name: string;
  }[];
  updatedAt: string;
}

/** 面試官看板數據 */
export interface InterviewerDashboardData {
  stats: {
    pendingTasks: number;
    todayInterviews: number;
    monthlyCompleted: number;
  };
  distribution: DistributionData[];
  trend: TrendData[];
  updatedAt: string;
}
