<script setup>
import { computed, onMounted } from 'vue'
import { useTasksStore, useScheduleStore } from '@/stores'
import TrendChart from '@/modules/dashboard/components/TrendChart.vue'

// 導入使用store
const tasksStore = useTasksStore()
const scheduleStore = useScheduleStore()

// 載入頁面時候：呼叫api->讀取localstorage->存進store->更新畫面
onMounted(() => {
  tasksStore.fetchAll()
  scheduleStore.fetchAll()
})

// KPI 計算
// 總任務 / 待辦任務 / 已完成任務 / 逾期任務
const totalTasks = computed(() => tasksStore.items.length)
const doingTasks = computed(() => tasksStore.items.filter((t) => t.status === 'doing').length)
const doneTasks = computed(() => tasksStore.items.filter((t) => t.status === 'done').length)
const overdueTasks = computed(() => tasksStore.overdueCount)

// 近七天資料趨勢
const createdTrend = computed(() => {
  // 建立map物件： 日期 -> 當天任務數
  const map = new Map()
  const today = new Date()
  // 建立近七天的 key
  for (let i = 6; i >= 0; i--) {
    // 複製一個今天的日期對象
    const d = new Date(today)
    // 將日期往前推 i 天
    d.setDate(today.getDate() - i)
    const key = d.toISOString().slice(0, 10)
    // 預設值給 0 (補洞)
    map.set(key, 0)
  }

  // 統計建立數
  tasksStore.items.forEach((t) => {
    const date = t.createdAt?.slice(0, 10)
    if (map.has(date)) {
      map.set(date, map.get(date) + 1)
    }
  })

  // 圖表：map物件 -> 陣列 -> （有標籤）物件
  // 例如：{ "2026-02-25" => 5 } -> [ ["2026-02-25", 5] ] -> [ { date: "2026-02-25", count: 5 } ]
  return Array.from(map.entries()).map(([date, count]) => ({
    date,
    count,
  }))
})

// 近期行程
const upcomingBookings = computed(() => scheduleStore.upcoming ?? [])
</script>

<template>
  <div class="dashboard-page">
    <!-- KPI區塊 -->
    <el-row :gutter="16" class="kpi-row">
      <el-col :span="6">
        <el-card class="kpi-card">
          <div class="kpi-label">任務總數</div>
          <div class="kpi-value">{{ totalTasks }}</div>
        </el-card>
      </el-col>

      <el-col :span="6">
        <el-card class="kpi-card">
          <div class="kpi-label">進行中</div>
          <div class="kpi-value">{{ doingTasks }}</div>
        </el-card>
      </el-col>

      <el-col :span="6">
        <el-card class="kpi-card">
          <div class="kpi-label">已完成</div>
          <div class="kpi-value">{{ doneTasks }}</div>
        </el-card>
      </el-col>

      <el-col :span="6">
        <el-card class="kpi-card">
          <div class="kpi-label">逾期未完成</div>
          <div class="kpi-value">{{ overdueTasks }}</div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 下方區塊 -->
    <el-row :gutter="16" class="bottom-row">
      <!-- 趨勢圖 -->
      <el-col :xs="24" :sm="24" :md="14" :lg="14" class="bottom-col">
        <el-card class="equal-card">
          <div class="section-title">近七天任務趨勢圖</div>

          <div class="chart-wrapper">
            <TrendChart :data="createdTrend" title="建立數量" />
          </div>

          <div class="chart-hint">...</div>
        </el-card>
      </el-col>

      <!-- 時間線 -->
      <el-col :xs="24" :sm="24" :md="10" :lg="10" class="bottom-col">
        <el-card class="equal-card">
          <div class="section-title">近日行程</div>

          <div class="timeline-wrapper">
            <el-empty v-if="upcomingBookings.length === 0" description="暫無未來行程" />

            <el-timeline v-else>
              <el-timeline-item
                v-for="b in upcomingBookings"
                :key="b.id"
                :timestamp="`${b.date} ${b.startTime}-${b.endTime}`"
              >
                <div class="booking-title">{{ b.title }}</div>
                <div class="booking-status">狀態：{{ b.status }}</div>
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
  display: flex;
  flex-direction: column;
  gap: 16px;
}

/* =====================
   KPI
===================== */

.kpi-row {
  margin-bottom: 8px;
}

.kpi-card {
  text-align: center;
  transition: box-shadow 0.2s ease;
}

.kpi-card:hover {
  box-shadow: 0 8px 18px rgba(0, 0, 0, 0.06);
}

.kpi-label {
  font-size: 13px;
  color: #606266;
  opacity: 0.85;
}

.kpi-value {
  font-size: 28px;
  font-weight: 700;
  margin-top: 6px;
  line-height: 1.1;
}

/* =====================
   下半部等高
===================== */

.bottom-row {
  margin-top: 12px;
  display: flex;
  align-items: stretch;
}

.bottom-col {
  display: flex;
}

.equal-card {
  flex: 1;
  display: flex;
  flex-direction: column;
  height: 400px;
}

.equal-card :deep(.el-card__body) {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-height: 0;
}

.section-title {
  font-weight: 600;
  margin-bottom: 12px;
}

.chart-wrapper {
  flex: 1;
  min-height: 0;
}

.chart-hint {
  font-size: 12px;
  color: #909399;
  margin-top: 8px;
}

.timeline-wrapper {
  flex: 1;
  min-height: 0;
  overflow-y: auto;
}

.booking-title {
  font-weight: 600;
  line-height: 1.3;
}

.booking-status {
  font-size: 12px;
  color: #909399;
  margin-top: 2px;
}

/* =====================
   RWD
===================== */

@media (max-width: 1200px) {
  .kpi-row :deep(.el-col) {
    flex: 0 0 50%;
    max-width: 50%;
  }
}

@media (max-width: 768px) {
  .kpi-row :deep(.el-col) {
    flex: 0 0 100%;
    max-width: 100%;
  }

  .bottom-row :deep(.el-col) + :deep(.el-col) {
    margin-top: 12px;
  }
}
</style>
