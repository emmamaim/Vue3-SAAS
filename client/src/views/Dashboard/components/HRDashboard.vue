<script setup>
import { ref, onMounted, computed } from 'vue';
import { getHrDashboard } from '@/api/dashboard';
import TrendChart from './TrendChart.vue';
import PieChart from './PieChart.vue';
import { useRouter } from 'vue-router';
import { useUserStore } from '@/stores';

const userStore = useUserStore();
const router = useRouter();
const loading = ref(false);

// 數據
const dashboardData = ref({
  stats: { myCandidates: 0, myActiveJobs: 0, myTodayInterviews: 0 },
  trend: [],
  statusData: [],
  upcoming: [],
});

// 定義標簽顔色和標簽内容
const statusConfig = {
  pending: { label: '待處理', color: '#909399' },
  screening: { label: '篩選中', color: '#409EFF' },
  interviewing: { label: '面試中', color: '#E6A23C' },
  offer: { label: '已發錄取', color: '#67C23A' },
  hired: { label: '已入職', color: '#303133' },
  rejected: { label: '不合適', color: '#F56C6C' },
};

// 獲取數據
const fetchData = async () => {
  loading.value = true;
  try {
    const res = await getHrDashboard();
    dashboardData.value = res.data || dashboardData.value;
  } catch (error) {
    console.error('HR Dashboard Fetch Error:', error);
  } finally {
    loading.value = false;
  }
};

// 轉換數據 => PieChart
const formattedPieData = computed(() => {
  return dashboardData.value.statusData.map((item) => {
    const config = statusConfig[item.status] || { label: item.status, color: '#DCDFE6' };
    return {
      name: config.label,
      value: item.count,
      itemStyle: {
        color: config.color,
      },
    };
  });
});

const isToday = (dateStr) => {
  return dateStr === new Date().toISOString().slice(0, 10);
};

// 參數跳轉
const goToCandidates = () => {
  router.push({
    path:'/candidates',
    query:{
        hrId:userStore.userInfo.id,
    }});
};

onMounted(fetchData);
</script>

<template>
  <div class="dashboard-page" v-loading="loading">
    <el-row :gutter="16" class="kpi-row">
      <el-col :xs="24" :sm="12" :md="8" class="mb-16">
        <el-card class="kpi-card shadow-sm clickable-card" @click="goToCandidates">
          <div class="kpi-label">負責應徵者</div>
          <div class="kpi-value" style="color: #409eff">{{ dashboardData.stats.myCandidates }}</div>
        </el-card>
      </el-col>
      <el-col :xs="12" :sm="12" :md="8" class="mb-16">
        <el-card class="kpi-card shadow-sm">
          <div class="kpi-label">活躍職位數</div>
          <div class="kpi-value" style="color: #67c23a">{{ dashboardData.stats.myActiveJobs }}</div>
        </el-card>
      </el-col>
      <el-col :xs="12" :sm="24" :md="8" class="mb-16">
        <el-card class="kpi-card shadow-sm">
          <div class="kpi-label">今日安排面試</div>
          <div class="kpi-value" style="color: #e6a23c">
            {{ dashboardData.stats.myTodayInterviews }}
          </div>
        </el-card>
      </el-col>
    </el-row>

    <el-row :gutter="16">
      <el-col :xs="24" :md="10">
        <el-card class="equal-card">
          <template #header><div class="section-title">人才面試趨勢</div></template>
          <TrendChart
            v-if="!loading && dashboardData.trend.length > 0"
            :data="dashboardData.trend"
            title="面試場次"
            color="#409EFF"
          />
          <el-empty v-else-if="!loading" description="暫無趨勢數據" :image-size="60" />
        </el-card>
      </el-col>

      <el-col :xs="24" :sm="12" :md="6">
        <el-card class="equal-card">
          <template #header><div class="section-title">人才庫狀態</div></template>
          <PieChart v-if="!loading && formattedPieData.length > 0" :data="formattedPieData" />
          <el-empty v-else-if="!loading" description="暫無狀態數據" :image-size="60" />
        </el-card>
      </el-col>

      <el-col :xs="24" :sm="12" :md="8">
        <el-card class="equal-card">
          <template #header>
            <div class="section-title">待進行面試監控</div>
          </template>
          <div class="timeline-wrapper">
            <el-empty
              v-if="dashboardData.upcoming.length === 0"
              description="暫無待進行面試"
              :image-size="60"
            />
            <el-timeline v-else>
              <el-timeline-item
                v-for="(item, index) in dashboardData.upcoming"
                :key="index"
                :timestamp="`${item.date} ${item.startTime.slice(0, 5)}`"
                :type="isToday(item.date) ? 'primary' : ''"
              >
                <div class="interview-item">
                  <div class="target">
                    <span class="candidate">{{ item.candidateName }}</span>
                    <span class="job">應徵 {{ item.job_name }}</span>
                  </div>
                  <div class="assignment">
                    <el-tag size="small" effect="light" type="info">
                      面試官：{{ item.interviewerName }}
                    </el-tag>
                  </div>
                </div>
              </el-timeline-item>
            </el-timeline>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<style scoped>
.dashboard-page {
  padding: 12px;
}
.mb-16 {
  margin-bottom: 16px;
}
.kpi-card {
  text-align: center;
  border-radius: 8px;
}
.kpi-label {
  font-size: 13px;
  color: #909399;
  margin-bottom: 4px;
}
.kpi-value {
  font-size: 24px;
  font-weight: bold;
}
.clickable-card {
  cursor: pointer;
  transition: 0.3s;
}
.clickable-card:hover {
  transform: translateY(-4px);
  border-color: #409eff;
}
.equal-card {
  height: 420px;
  margin-bottom: 16px;
  border-radius: 8px;
}
.section-title {
  font-weight: bold;
  font-size: 15px;
}

/* 時間線內部樣式 */
.timeline-wrapper {
  height: 340px;
  overflow-y: auto;
  padding-right: 8px;
}
.interview-item {
  display: flex;
  flex-direction: column;
  gap: 6px;
}
.target {
  display: flex;
  align-items: baseline;
  gap: 8px;
}
.candidate {
  font-weight: bold;
  color: #303133;
  font-size: 14px;
}
.job {
  font-size: 12px;
  color: #909399;
}
.assignment {
  margin-top: 2px;
}

/* 滾動條優化 */
.timeline-wrapper::-webkit-scrollbar {
  width: 4px;
}
.timeline-wrapper::-webkit-scrollbar-thumb {
  background: #e4e7ed;
  border-radius: 4px;
}
</style>
