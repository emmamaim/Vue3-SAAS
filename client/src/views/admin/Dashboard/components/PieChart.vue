<script setup lang="ts">
import { computed } from 'vue';
import VChart from 'vue-echarts';
import { use } from 'echarts/core';
import { CanvasRenderer } from 'echarts/renderers';
import { PieChart } from 'echarts/charts';
import { TooltipComponent, LegendComponent } from 'echarts/components';
import type { ComposeOption } from 'echarts/core';
import type { PieSeriesOption } from 'echarts/charts';
import type { TooltipComponentOption, LegendComponentOption } from 'echarts/components';

use([CanvasRenderer, PieChart, TooltipComponent, LegendComponent]);

// 定義 ECharts 配置項的型別組合
type ECOption = ComposeOption<
  PieSeriesOption | TooltipComponentOption | LegendComponentOption
>;

// 圓餅圖專用接口
interface PieDataItem {
  name: string;
  value: number;
  itemStyle?: {
    color: string;
  };
}

// props
interface Props {
  data?: PieDataItem[];
  emptyText?: string;
}
const props = withDefaults(defineProps<Props>(), {
  data: () => [],
  emptyText: '暫無數據',
});

const option = computed<ECOption>(() => ({
  tooltip: {
    trigger: 'item',
    formatter: '{b}: {c} ({d}%)',
  },
  legend: {
    type: 'plain',
    bottom: '0',
    left: 'center',
    itemWidth: 10,
    itemHeight: 10,
    padding: [5, 10],
    textStyle: {
      fontSize: 11,
      lineHeight: 14
    }
  },
  series: [
    {
      type: 'pie',
      center: ['50%', '35%'], 
      radius: ['30%', '55%'], 
      avoidLabelOverlap: true,
      itemStyle: {
        borderRadius: 6,
        borderColor: '#fff',
        borderWidth: 2,
      },
      label: {
        show: false,
      },
      emphasis: {
        label: {
          show: true,
          fontSize: 14,
          fontWeight: 'bold',
        },
      },
      data: props.data,
    },
  ],
}));
</script>

<template>
  <div class="pie-container">
    <el-empty v-if="data.length === 0" description="emptyText" :image-size="80" />
    <v-chart v-else :option="option" autoresize />
  </div>
</template>

<style scoped>
.pie-container {
  width: 100%;
  height: 350px;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
