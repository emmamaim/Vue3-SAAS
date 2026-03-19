<script setup>
import { computed } from 'vue';
import VChart from 'vue-echarts';
import { use } from 'echarts/core'
import { CanvasRenderer } from 'echarts/renderers';
import { PieChart } from 'echarts/charts';
import { TooltipComponent, LegendComponent } from 'echarts/components';

use([CanvasRenderer, PieChart, TooltipComponent, LegendComponent]);

const props = defineProps({
    data: {
        type: Array,
        default: () => []
    },
    emptyText: {
        type: String,
        default: '暫無數據'
    }
})

const option = computed(() => ({
    tooltip: {
        trigger: 'item',
        formatter: '{b}:{c}({d}%)'
    },
    legend: {
        bottom: '0',
        left: 'center',
        itemWidth: 10,
        itemHeight: 10
    },
    series: [
        {
            type: 'pie',
            radius: ['40%', '70%'],
            avoidLabelOverlap: false,
            itemStyle: {
                borderRadius: 8,
                borderColor: '#fff',
                borderWidth: 2
            },
            label: {
                show: false,
                position: 'center'
            },
            emphasis: {
                label: {
                    show: true,
                    fontSize: 16,
                    fontWeight: 'bold'
                }
            },
            labelLine: {
                show: false
            },
            data: props.data
        }
    ]
}))

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
    height: 300px;
    display: flex;
    align-items: center;
    justify-content: center;
}
</style>