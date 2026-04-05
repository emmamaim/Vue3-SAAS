<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { getHrDashboard } from '@/api/dashboard';
import TrendChart from './TrendChart.vue';
import PieChart from './PieChart.vue';
import { useRouter } from 'vue-router';
import { useUserStore } from '@/stores';
import type { HrDashboardData } from '@/types';

// 基礎配置
const userStore = useUserStore();
const router = useRouter();
const loading = ref(false);

// 數據
const dashboardData = ref<HrDashboardData>({
  stats: { myCandidates: 0, myActiveJobs: 0, myTodayInterviews: 0 },
  trend: [],
  statusData: [],
  upcoming: [],
  updatedAt: '',
});

// 定義標簽顔色和標簽内容
const statusConfig: Record<string, { label: string; color: string }> = {
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
    const statusKey = item.status || 'unknown';
    const config = statusConfig[statusKey] || { label: statusKey, color: '#DCDFE6' };
    return {
      name: config.label,
      value: item.count,
      itemStyle: {
        color: config.color,
      },
    };
  });
});

const isToday = (dateStr: string) => {
  return dateStr === new Date().toISOString().slice(0, 10);
};

// 參數跳轉
const goToCandidates = () => {
  const hrId = userStore.userInfo?.id;
  if (!hrId) return;
  router.push({
    path: '/admin/candidates',
    query: {
      hrId: hrId,
    },
  });
};

onMounted(fetchData);
</script>

<template>
  <div class="db-container" v-loading="loading">
    <el-row :gutter="16">
      <el-col :xs="24" :sm="12" :md="8" class="db-mb">
        <el-card class="db-kpi-card db-clickable shadow-sm" @click="goToCandidates">
          <div class="db-kpi-label">負責應徵者</div>
          <div class="db-kpi-value" style="color: var(--el-color-primary)">
            {{ dashboardData.stats.myCandidates }}
          </div>
        </el-card>
      </el-col>

      <el-col :xs="12" :sm="12" :md="8" class="db-mb">
        <el-card class="db-kpi-card shadow-sm">
          <div class="db-kpi-label">活躍職位數</div>
          <div class="db-kpi-value" style="color: var(--el-color-success)">
            {{ dashboardData.stats.myActiveJobs }}
          </div>
        </el-card>
      </el-col>

      <el-col :xs="12" :sm="24" :md="8" class="db-mb">
        <el-card class="db-kpi-card shadow-sm">
          <div class="db-kpi-label">今日安排面試</div>
          <div class="db-kpi-value" style="color: var(--el-color-warning)">
            {{ dashboardData.stats.myTodayInterviews }}
          </div>
        </el-card>
      </el-col>
    </el-row>

    <el-row :gutter="16">
      <el-col :xs="24" :md="10" class="db-mb">
        <el-card class="db-chart-card shadow-sm">
          <template #header>
            <div class="db-section-title">人才面試趨勢</div>
          </template>
          <TrendChart
            v-if="!loading && dashboardData.trend.length > 0"
            :data="dashboardData.trend"
            title="面試場次"
            color="#409EFF"
          />
          <el-empty v-else-if="!loading" description="暫無趨勢數據" :image-size="60" />
        </el-card>
      </el-col>

      <el-col :xs="24" :sm="12" :md="6" class="db-mb">
        <el-card class="db-chart-card shadow-sm">
          <template #header>
            <div class="db-section-title">人才庫狀態</div>
          </template>
          <PieChart v-if="!loading && formattedPieData.length > 0" :data="formattedPieData" />
          <el-empty v-else-if="!loading" description="暫無狀態數據" :image-size="60" />
        </el-card>
      </el-col>

      <el-col :xs="24" :sm="12" :md="8" class="db-mb">
        <el-card class="db-chart-card shadow-sm">
          <template #header>
            <div class="db-section-title">待進行面試</div>
          </template>
          <div class="db-timeline-wrapper">
            <el-empty
              v-if="dashboardData.upcoming.length === 0"
              description="暫無待進行面試"
              :image-size="60"
            />
            <el-timeline v-else class="db-timeline">
              <el-timeline-item
                v-for="(item, index) in dashboardData.upcoming"
                :key="index"
                :timestamp="`${item.date} ${item.startTime.slice(0, 5)}`"
                :type="isToday(item.date) ? 'primary' : ''"
              >
                <div class="db-interview-item">
                  <div class="db-interview-target">
                    <span class="db-interview-candidate">{{ item.candidateName }}</span>
                    <span class="db-interview-job">應徵 {{ item.job_name }}</span>
                  </div>
                  <div class="db-interview-assignment">
                    <el-tag size="small" effect="plain" type="info">
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
@import '@/assets/dashboard.css';
</style>
