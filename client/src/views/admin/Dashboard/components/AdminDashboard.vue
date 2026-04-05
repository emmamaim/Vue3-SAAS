<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { getAdminDashboard } from '@/api/dashboard';
import TrendChart from './TrendChart.vue';
import PieChart from './PieChart.vue';
import { useRouter } from 'vue-router';
import type { AdminDashboardData } from '@/types';

// 路由
const router = useRouter();

// 載入狀態
const loading = ref<boolean>(false);

// 定義標簽顔色
const sourceColorMap: Record<string, string> = {
  '104 人力銀行': '#409EFF',
  LinkedIn: '#0077B5',
  CakeResume: '#EEAD0E',
  'Yourator 數位人才媒合': '#67C23A',
  員工內部推薦: '#F56C6C',
  '公司官網/主動投遞': '#909399',
  '獵頭顧問 (Headhunter)': '#606266',
};

// 使用介面定義初始值
const dashboardData = ref<AdminDashboardData>({
  stats: {
    totalCandidates: 0,
    activeJobs: 0,
    totalTodayInterviews: 0,
  },
  trend: [],
  sourceData: [],
  updatedAt: '',
});

const fetchData = async () => {
  loading.value = true;
  try {
    const res = await getAdminDashboard();
    if (res.data) {
      dashboardData.value = res.data;
    }
  } catch (error) {
    console.error('Fetch Admin Data Error:', error);
  } finally {
    loading.value = false;
  }
};

// 轉換數據 => PieChart
const formattedSourceData = computed(() => {
  return dashboardData.value.sourceData.map((item) => ({
    name: item.name || item.status || '未知',
    value: item.count,
    itemStyle: {
      color: sourceColorMap[item.name || ''] || '#DCDFE6',
    },
  }));
});

// 路由跳轉
const goToCandidates = () => {
  router.push('/admin/candidates');
};

onMounted(fetchData);
</script>

<template>
  <div class="db-container" v-loading="loading">
    <el-row :gutter="16">
      <el-col :xs="24" :sm="12" :md="8" class="db-mb">
        <el-card class="db-kpi-card db-clickable shadow-sm" @click="goToCandidates">
          <div class="db-kpi-label">全站應徵者總數</div>
          <div class="db-kpi-value" style="color: var(--el-color-primary)">
            {{ dashboardData.stats.totalCandidates }}
          </div>
        </el-card>
      </el-col>

      <el-col :xs="12" :sm="12" :md="8" class="db-mb">
        <el-card class="db-kpi-card shadow-sm">
          <div class="db-kpi-label">活躍招聘職位</div>
          <div class="db-kpi-value" style="color: var(--el-color-success)">
            {{ dashboardData.stats.activeJobs }}
          </div>
        </el-card>
      </el-col>

      <el-col :xs="12" :sm="24" :md="8" class="db-mb">
        <el-card class="db-kpi-card shadow-sm">
          <div class="db-kpi-label">今日全站面試</div>
          <div class="db-kpi-value" style="color: var(--el-color-warning)">
            {{ dashboardData.stats.totalTodayInterviews }}
          </div>
        </el-card>
      </el-col>
    </el-row>

    <el-row :gutter="16">
      <el-col :xs="24" :md="14">
        <el-card class="db-chart-card shadow-sm">
          <template #header>
            <div class="db-section-title">全站面試活躍趨勢 (近七日)</div>
          </template>
          <TrendChart :data="dashboardData.trend" title="面試場次" color="#67C23A" />
        </el-card>
      </el-col>

      <el-col :xs="24" :md="10">
        <el-card class="db-chart-card shadow-sm">
          <template #header>
            <div class="db-section-title">人才來源渠道分佈</div>
          </template>
          <PieChart :data="formattedSourceData" emptyText="暫無來源數據" />
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<style scoped>
@import '@/assets/dashboard.css';
</style>
