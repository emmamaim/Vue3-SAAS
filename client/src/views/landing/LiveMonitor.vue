<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed } from 'vue';
import type { EChartsOption } from 'echarts';
import type { IoTData } from '@/types';
import BaseChart from './components/BaseChart.vue';

// 響應式數據
const tempHistory = ref<number[]>([]);
const currentTemp = ref<number>(0);
const isConnected = ref<boolean>(false);

// 存放 WebSocket 連線實體 的容器
let socket: WebSocket | null = null;

// --- 1. 折線圖 (Trend) ---
const lineOption = computed<EChartsOption>(() => ({
  title: { text: '產線溫度趨勢' },
  // 提示框
  tooltip: { trigger: 'axis' },
  // 邊距
  grid: {
    left: '3%',
    right: '4%',
    bottom: '3%',
    // 把座標軸的文字算進邊距
    containLabel: true,
  },
  xAxis: {
    type: 'category',
    // 索引轉成數字
    data: tempHistory.value.map((_, i) => i + 1),
  },
  yAxis: { type: 'value', min: 20, max: 40 },
  series: [
    {
      data: tempHistory.value,
      type: 'line',
      smooth: true,
      // 折線下方面積圖
      areaStyle: { opacity: 0.1 },
      // 線條和點的顏色
      itemStyle: { color: '#409EFF' },
    },
  ],
}));

// --- 2. 儀表盤 (Gauge) ---
const gaugeOption = computed<EChartsOption>(() => ({
  series: [
    {
      type: 'gauge',
      min: 20,
      max: 40,
      // 調整刻度數字的位置
      axisLabel: {
        // 數字離圓環的距離
        distance: 25,
        color: '#999',
        fontSize: 12,
      },
      // 進度條
      progress: { show: true, width: 18 },
      // 底色軌跡
      axisLine: { lineStyle: { width: 18 } },
      // 刻度與分隔線
      // 小分隔線
      axisTick: { show: false },
      // 大分隔線
      splitLine: { length: 15, lineStyle: { width: 2, color: '#eee' } },
      // 數字顯示區
      detail: {
        valueAnimation: true,
        formatter: '{value}°C',
        fontSize: 20,
        // 微調數字的位置，防止被指針
        offsetCenter: [0, '70%'],
      },
      data: [{ value: currentTemp.value }],
    },
  ],
}));

// --- 3. 柱狀圖 (Min/Max Stats) ---
const barOption = computed<EChartsOption>(() => {
  const min = tempHistory.value.length ? Math.min(...tempHistory.value) : 0;
  const max = tempHistory.value.length ? Math.max(...tempHistory.value) : 0;
  return {
    title: { text: '極值統計' },
    xAxis: { type: 'category', data: ['最低', '當前', '最高'] },
    yAxis: {
      type: 'value',
      min: 20,
      max: 40,
      // 背景的水平參考線
      splitLine: { show: true, lineStyle: { type: 'dashed' } },
    },
    series: [
      {
        data: [
          { value: min, itemStyle: { color: '#67C23A' } },
          { value: currentTemp.value, itemStyle: { color: '#409EFF' } },
          { value: max, itemStyle: { color: '#F56C6C' } },
        ],
        type: 'bar',
        // 柱子的粗細
        barWidth: '40%',
        animationDuration: 300,
        // 柱子頂部直接印出數字
        label: { show: true, position: 'top', formatter: '{c}°C' },
      },
    ],
  };
});

// 存放高溫紀錄
const alertLogs = ref<IoTData[]>([]);

// 設定告警門檻（例如超過 33 度就記錄）
const ALERT_THRESHOLD = 33;

const host = window.location.hostname;

// WebSocket連線
onMounted(() => {
  // 建立連線實例
  socket = new WebSocket(`wss://${host}/api/ws`);

  // 接通
  socket.onopen = () => {
    isConnected.value = true;
    console.log('ws connected!');
  };

  // 後端推送數據
  socket.onmessage = (event: MessageEvent) => {
    const data: IoTData = JSON.parse(event.data);
    // 轉成純數字
    const val = parseFloat(data.value);
    // 更新當前最新溫度
    currentTemp.value = val;
    // 累積歷史
    tempHistory.value.push(val);
    // 保持顯示最近 8 筆
    if (tempHistory.value.length > 8) {
      tempHistory.value.shift();
    }
    if (val > ALERT_THRESHOLD) {
      // 記錄異常數據
      alertLogs.value.unshift(data);
      // 保留最近的 5 筆異常紀錄
      if (alertLogs.value.length > 5) {
        alertLogs.value.pop();
      }
    }
  };

  socket.onclose = () => {
    isConnected.value = false;
  };
});

onUnmounted(() => {
  socket?.close();
});
</script>

<template>
  <div class="monitor-page p-4 sm:p-6 bg-slate-50 min-h-screen text-slate-800">
    <div class="max-w-7xl mx-auto">
      
      <header class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 class="text-3xl font-extrabold tracking-tight text-slate-900">
            產線實時監控系統
          </h1>
          <p class="text-slate-500 mt-1 text-sm italic font-medium">Real-time Industrial IoT Dashboard</p>
        </div>
        
        <div class="flex items-center gap-3">
          <span class="relative flex h-3 w-3" v-if="isConnected">
            <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
            <span class="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
          </span>
          <el-tag :type="isConnected ? 'success' : 'danger'" effect="dark" class="rounded-full px-4">
            {{ isConnected ? '系統連線中' : '連線中斷' }}
          </el-tag>
        </div>
      </header>

      <div class="grid grid-cols-1 md:grid-cols-12 gap-6 mb-6">
        <div class="md:col-span-5">
          <el-card class="h-full border-none shadow-sm rounded-xl" header="當前核心溫度">
            <div class="flex items-center justify-center py-4">
              <BaseChart :option="gaugeOption" height="320px" />
            </div>
          </el-card>
        </div>
        
        <div class="md:col-span-7">
          <el-card class="h-full border-none shadow-sm rounded-xl" header="溫度極值分佈">
            <div class="flex items-center justify-center min-h-320px">
              <BaseChart v-if="tempHistory.length > 7" :option="barOption" height="320px" />
              <el-empty v-else description="等待數據傳入中..." :image-size="80" />
            </div>
          </el-card>
        </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div class="lg:col-span-8">
          <el-card class="border-none shadow-sm rounded-xl" header="溫度變化趨勢 (最近 8 筆)">
            <BaseChart :option="lineOption" height="400px" />
          </el-card>
        </div>

        <div class="lg:col-span-4">
          <el-card class="border-none shadow-sm rounded-xl h-full" header="⚠️ 高溫異常日誌">
            <div class="overflow-hidden">
              <el-table :data="alertLogs" size="small" :show-header="true">
                <el-table-column prop="time" label="時間" align="center" />
                <el-table-column prop="value" label="溫度" align="center">
                  <template #default="scope">
                    <span class="text-red-600 font-bold font-mono">{{ scope.row.value }}°C</span>
                  </template>
                </el-table-column>
                <el-table-column label="狀態" align="center">
                  <template #default>
                    <span class="inline-flex items-center rounded-md bg-red-50 px-2 py-1 text-xs font-medium text-red-700 ring-1 ring-inset ring-red-600/10">高溫</span>
                  </template>
                </el-table-column>
              </el-table>
              <div v-if="alertLogs.length === 0" class="text-center py-10 text-slate-400 text-sm">
                目前尚無異常紀錄
              </div>
            </div>
          </el-card>
        </div>
      </div>

    </div>
  </div>
</template>
