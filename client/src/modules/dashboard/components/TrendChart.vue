<script setup>
import { computed } from 'vue'
import VChart from 'vue-echarts'

// 按需導入echart模塊
import { use } from 'echarts'
// ECharts 的底層渲染引擎
import { CanvasRenderer } from 'echarts/renderers'
// 折線圖
import { LineChart } from 'echarts/charts'
// 座標系 / 滑鼠懸停提示 / 圖例
import { GridComponent, TooltipComponent, LegendComponent } from 'echarts/components'
// 註冊組件
use([CanvasRenderer, LineChart, GridComponent, TooltipComponent, LegendComponent])

// 外部傳入的資料(dashboard的createdTrend)
const props = defineProps({
  data: { type: Array, default: () => [] },
  title: { type: String, default: '' },
})

const option = computed(() => {
  // 數據預處理：拆解成兩個獨立的陣列
  const x = props.data.map((d) => d.date)
  const y = props.data.map((d) => d.count)
  return {
    // 提示框配置
    // 當滑鼠碰到 座標軸 時顯示提示框
    tooltip: { trigger: 'axis' },
    // 布局調整
    // 確保標籤太長時不會被切掉，會自動縮進
    grid: { left: 24, right: 16, top: 24, bottom: 24, containLabel: true },
    // X 軸（橫軸）
    xAxis: {
      // 類目軸，顯示日期
      type: 'category',
      data: x,
      // 格式化標籤：'2024-05-01' => '05-01'
      axisLabel: { formatter: (v) => v.slice(5) },
    },
    // Y 軸（縱軸）
    yAxis: {
      // 數值軸，自動計算最大值與最小值
      type: 'value',
      // 強制 y 軸刻度必須是整數
      minInterval: 1,
    },
    // 核心數據
    series: [
      {
        name: props.title || 'Created',
        type: 'line',
        data: y,
        // 折線變平滑（曲線感）
        smooth: true,
        // 數據點大小
        symbolSize: 6,
      },
    ],
  }
})

// 空白處理
const isEmpty = computed(() => {
  return !props.data || props.data.length === 0
})
</script>

<template>
  <div
    style="min-height: 250px; height: 100%; width: 100%; display: flex; align-items: center; justify-content: center"
  >
    <el-empty v-if="isEmpty" description="無任務" />
    <v-chart v-else :option="option" autoresize/>
  </div>
</template>
