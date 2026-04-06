<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch } from 'vue';
import * as echarts from 'echarts';
import type { EChartsOption } from 'echarts';

// props
interface Props {
  option: EChartsOption;
  height?: string;
}
const props = withDefaults(defineProps<Props>(), {
  height: '300px',
});

// 存放圖表的容器
const chartRef = ref<HTMLElement | null>(null);

// 控制圖表的內容
let chartInstance: echarts.ECharts | null = null;

const handleResize = () => {
  chartInstance?.resize();
};

// 初始化
onMounted(() => {
  if (chartRef.value) {
    chartInstance = echarts.init(chartRef.value);
    chartInstance.setOption(props.option);
    // 響應式縮放
    window.addEventListener('resize', handleResize);
  }
});
onUnmounted(() => {
  window.removeEventListener('resize', handleResize);
  // 銷毀 ECharts 實例
  chartInstance?.dispose();
  chartInstance = null;
});

// 深度監聽數據變化
watch(
  () => props.option,
  (newOpt) => {
    chartInstance?.setOption(newOpt, { notMerge: false });
  },
  { deep: true },
);
</script>

<template>
  <div ref="chartRef" :style="{ width: '100%', height: props.height }"></div>
</template>
