<script setup>
import { ref, onMounted, computed } from 'vue'
import { getInterviewerDashboard } from '@/api/dashboard'
import { useBookingStore } from '@/stores'
import TrendChart from './TrendChart.vue'
import PieChart from './PieChart.vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const bookingStore = useBookingStore()

const loading = ref(false)
const dashboardData = ref({
    stats: { pendingTasks: 0, todayInterviews: 0, monthlyCompleted: 0 },
    trend: [],
    distribution: []
})

// 定義標簽顔色和標簽内容
const resultConfig = {
    'pass': { label: '通過', color: '#67C23A' },
    'fail': { label: '不通過', color: '#F56C6C' },
    'pending': { label: '待定', color: '#909399' },
}

// 獲取面試官數據
const fetchData = async () => {
    loading.value = true
    try {
        const dashboardTask = getInterviewerDashboard().then(res => {
            dashboardData.value = res.data || dashboardData.value
        })
        const bookingTask = bookingStore.fetchAll()
        await Promise.all([dashboardTask, bookingTask])
    } finally {
        loading.value = false
    }
}

// 轉換數據 => PieChart
const formmtedPieData = computed(() => {
    return dashboardData.value.distribution.map(item => {
        const cfg = resultConfig[item.result] || { label: item.result, color: '#DCDFE6' }
        return {
            name: cfg.label,
            value: item.count,
            itemStyle: {
                color: cfg.color
            }
        }
    })
})

const isToday = (dateStr) => {
    return dateStr === new Date().toISOString().slice(0, 10)
}

const goToBooking = () => {
    router.push('/bookings')
}

const goToTask = () => {
    router.push('/tasks')
}

onMounted(fetchData)
</script>

<template>
  <div class="db-container" v-loading="loading">
    <el-row :gutter="16">
      <el-col :xs="24" :sm="12" :md="8" class="db-mb">
        <el-card class="db-kpi-card db-clickable shadow-sm" @click="goToTask">
          <div class="db-kpi-label">待評價任務</div>
          <div class="db-kpi-value" style="color: var(--el-color-warning)">
            {{ dashboardData.stats.pendingTasks }}
          </div>
        </el-card>
      </el-col>
      
      <el-col :xs="12" :sm="12" :md="8" class="db-mb">
        <el-card class="db-kpi-card db-clickable shadow-sm" @click="goToBooking">
          <div class="db-kpi-label">今日面試</div>
          <div class="db-kpi-value" style="color: var(--el-color-primary)">
            {{ dashboardData.stats.todayInterviews }}
          </div>
        </el-card>
      </el-col>
      
      <el-col :xs="12" :sm="24" :md="8" class="db-mb">
        <el-card class="db-kpi-card shadow-sm">
          <div class="db-kpi-label">本月已完成</div>
          <div class="db-kpi-value" style="color: var(--el-color-success)">
            {{ dashboardData.stats.monthlyCompleted }}
          </div>
        </el-card>
      </el-col>
    </el-row>

    <el-row :gutter="16">
      <el-col :xs="24" :md="10" class="db-mb">
        <el-card class="db-chart-card shadow-sm">
          <template #header>
            <div class="db-section-title">近七日面試趨勢</div>
          </template>
          <TrendChart 
            :data="dashboardData.trend" 
            title="面試人數" 
            color="#409EFF" 
          />
        </el-card>
      </el-col>

      <el-col :xs="24" :sm="12" :md="6" class="db-mb">
        <el-card class="db-chart-card shadow-sm">
          <template #header>
            <div class="db-section-title">面試結果分佈</div>
          </template>
          <PieChart :data="formmtedPieData" />
        </el-card>
      </el-col>

      <el-col :xs="24" :sm="12" :md="8" class="db-mb">
        <el-card class="db-chart-card shadow-sm">
          <template #header>
            <div class="db-section-title">近日面試行程</div>
          </template>
          <div class="db-timeline-wrapper">
            <el-empty 
              v-if="bookingStore.upcoming.length === 0" 
              description="暫無未來行程" 
              :image-size="60" 
            />
            <el-timeline v-else>
              <el-timeline-item 
                v-for="b in bookingStore.upcoming" 
                :key="b.id"
                :timestamp="`${b.date} ${b.startTime}`" 
                :type="isToday(b.date) ? 'primary' : ''"
              >
                <div class="db-interview-item">
                  <div class="db-interview-target">
                    <span class="db-interview-candidate">{{ b.title }}</span>
                    <el-tag size="small" effect="plain" type="info">{{ b.type || '面試' }}</el-tag>
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