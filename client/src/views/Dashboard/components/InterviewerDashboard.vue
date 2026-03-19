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
    <div class="dashboard-page" v-loading="loading">
        <el-row :gutter="16" class="kpi-row">
            <el-col :xs="24" :sm="12" :md="8" class="mb-16">
                <el-card class="kpi-card shadow-sm clickable-card" @click="goToTask">
                    <div class="kpi-label">待評價任務</div>
                    <div class="kpi-value" style="color: #E6A23C">{{ dashboardData.stats.pendingTasks }}</div>
                </el-card>
            </el-col>
            <el-col :xs="12" :sm="12" :md="8" class="mb-16">
                <el-card class="kpi-card shadow-sm clickable-card" @click="goToBooking">
                    <div class="kpi-label">今日面試</div>
                    <div class="kpi-value" style="color: #409EFF">{{ dashboardData.stats.todayInterviews }}</div>
                </el-card>
            </el-col>
            <el-col :xs="12" :sm="24" :md="8" class="mb-16">
                <el-card class="kpi-card shadow-sm">
                    <div class="kpi-label">本月已完成</div>
                    <div class="kpi-value" style="color: #67C23A">{{ dashboardData.stats.monthlyCompleted }}</div>
                </el-card>
            </el-col>
        </el-row>

        <el-row :gutter="16" class="bottom-row">
            <!-- 折線圖 -->
            <el-col :xs="24" :md="10">
                <el-card class="equal-card">
                    <template #header>
                        <div class="section-title">近七日面試趨勢</div>
                    </template>
                    <TrendChart :data="dashboardData.trend" title="面試人數" />
                </el-card>
            </el-col>

            <!-- 圓餅圖 -->
            <el-col :xs="24" :sm="12" :md="6">
                <el-card class="equal-card">
                    <template #header>
                        <div class="section-title">面試結果分佈</div>
                    </template>
                    <PieChart :data="formmtedPieData" />
                </el-card>
            </el-col>

            <!-- 時間線 -->
            <el-col :xs="24" :sm="12" :md="8">
                <el-card class="equal-card">
                    <template #header>
                        <div class="section-title">近日面試行程</div>
                    </template>
                    <div class="timeline-wrapper">
                        <el-empty v-if="bookingStore.upcoming.length === 0" description="暫無未來行程" :image-size="60" />
                        <el-timeline v-else>
                            <el-timeline-item v-for="b in bookingStore.upcoming" :key="b.id"
                                :timestamp="`${b.date} ${b.startTime}`" :type="isToday(b.date) ? 'primary' : ''">
                                <div class="booking-item">
                                    <span class="candidate-name">{{ b.title }}</span>
                                    <el-tag size="small" effect="plain" class="ml-2">{{ b.type || '面試' }}</el-tag>
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

.kpi-row {
    margin-bottom: 0;
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
    font-size: 22px;
    font-weight: bold;
}

.clickable-card {
    cursor: pointer;
    transition: all 0.3s;
}

.clickable-card:hover {
    transform: translateY(-4px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    border-color: #409EFF;
}

/* --- 響應式高度處理 --- */
/* 預設：電腦版等高 */
.equal-card {
    height: 400px;
    margin-bottom: 16px;
    border-radius: 8px;
}

.timeline-wrapper {
    height: 320px;
    overflow-y: auto;
}

/* 手機版微調  */
@media (max-width: 767px) {
    .equal-card {
        height: auto;
        min-height: 300px;
        margin-bottom: 12px;
    }

    .timeline-wrapper {
        height: 250px;
    }

    .kpi-value {
        font-size: 20px;
    }

    .clickable-card:hover {
        transform: none;
    }
}

.section-title {
    font-weight: bold;
    font-size: 15px;
}

/* 滾動條優化 */
.timeline-wrapper::-webkit-scrollbar {
    width: 4px;
}

.timeline-wrapper::-webkit-scrollbar-thumb {
    background-color: #e4e7ed;
    border-radius: 10px;
}
</style>