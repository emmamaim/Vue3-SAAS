<script setup>
import { ref, computed, onMounted } from 'vue';
import VChart from 'vue-echarts';

// 按需導入echart模塊
import { use } from 'echarts/core';
// ECharts 的底層渲染引擎
import { CanvasRenderer } from 'echarts/renderers';
// 折線圖
import { LineChart } from 'echarts/charts';
// 座標系 / 滑鼠懸停提示 / 圖例
import { GridComponent, TooltipComponent, LegendComponent } from 'echarts/components';
// 註冊
use([CanvasRenderer, LineChart, GridComponent, TooltipComponent, LegendComponent]);

// 外部傳入的資料(dashboard的createdTrend)
const props = defineProps({
  data: { type: Array, default: () => [] },
  title: { type: String, default: '次數' },
  color: { type: String, default: '#409EFF' }
});

// 圖表顯示
const isRendered = ref(false);

const processedData = computed(() => {
  const map = new Map();
  const today = new Date();

  // 建立最近七天的標簽
  for (let i = 6; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    const label = `${month}-${day}`;
    map.set(label, 0)
  }
  // 後端數據傳入map
  props.data.forEach((item) => {
    if (map.has(item.dateLabel)) {
      map.set(item.dateLabel, item.count)
    }
  })
  // 轉換成陣列
  return Array.from(map.entries()).map(([label, count]) => ({
    label,
    count
  }))
})
const option = computed(() => {
  // 數據預處理：拆解成兩個獨立的陣列
  const x = processedData.value.map((d) => d.label);
  const y = processedData.value.map((d) => d.count);
  return {
    // 提示框配置
    tooltip: {
      trigger: 'axis',
      backgroundColor: 'rgba(255, 255, 255, 0.9)',
      borderWidth: 0,
      shadowBlur: 10,
      shadowColor: 'rgba(0,0,0,0.1)'
    },
    // 布局調整：標籤太長時不會被切掉，會自動縮進
    grid: { left: '3%', right: '4%', top: '15%', bottom: '5%', containLabel: true },
    xAxis: {
      // 類目軸，顯示日期
      type: 'category',
      data: x,
      axisLine: { lineStyle: { color: '#DCDFE6' } },
      axisLabel: { color: '#909399' },
      boundaryGap: false,
    },
    yAxis: {
      // 數值軸，自動計算最大值與最小值
      type: 'value',
      // 強制 y 軸刻度必須是整數
      minInterval: 1,
      splitLine: { lineStyle: { type: 'dashed', color: '#EBEEF5' } },
      axisLabel: { color: '#909399' },
    },
    // 核心數據
    series: [
      {
        name: props.title,
        type: 'line',
        data: y,
        // 折線變平滑（曲線感）
        smooth: true,
        // 數據點大小
        symbolSize: 8,
        // 線條樣式
        lineStyle: { width: 3, color: '#409EFF' },
        // 點的樣式
        itemStyle: { color: '#409EFF', borderWidth: 2, borderColor: '#fff' },
        // 漸層填充區域
        areaStyle: {
          color: {
            type: 'linear', x: 0, y: 0, x2: 0, y2: 1,
            x: 0, y: 0, x2: 0, y2: 1,
            colorStops: [
              { offset: 0, color: props.color + '4D' },
              { offset: 1, color: props.color + '00' }
            ]
          }
        },
      },
    ],
  };
});

onMounted(() => {
  setTimeout(() => {
    isRendered.value = true;
  }, 100);
})
</script>


<template>
  <div class="chart-container">
    <v-chart :option="option" autoresize />
  </div>
</template>

<style scoped>
.chart-container {
  width: 100%;
  height: 300px;
}
</style>