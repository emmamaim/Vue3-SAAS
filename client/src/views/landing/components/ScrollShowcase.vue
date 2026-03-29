<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import { Motion } from '@motionone/vue';

// --- 圖片引入 ---
import dashboardMockup from '@/assets/images/dashboard_mockup.png';
import analyticsMockup from '@/assets/images/bg_img1.png';

const currentScreenIndex = ref(0);

const screens = [
  { 
    pc: dashboardMockup, 
    title: '人才招募看板', 
    subtitle: 'ATS Recruitment',
    desc: '直觀的拖拽式看板，讓每一位候選人的進度都一目了然。後端自動化邏輯確保數據即時同步，告別繁瑣的表格維護。',
    tags: ['即時同步', '拖拽管理', '權限控管'],
    icon: '👤' 
  },
  { 
    pc: analyticsMockup, 
    title: '數據分析報告', 
    subtitle: 'Data Analytics',
    desc: '深度解析招聘漏斗，從履歷投遞到最終錄取的轉化率精確追蹤。透過視覺化圖表，助您做出最正確的人才決策。',
    tags: ['漏斗分析', '自定義報表', '導出功能'],
    icon: '📊' 
  },
];

let timer;
onMounted(() => {
  timer = setInterval(() => {
    currentScreenIndex.value = (currentScreenIndex.value + 1) % screens.length;
  }, 5000);
});

onUnmounted(() => {
  clearInterval(timer);
});
</script>

<template>
  <section class="py-32 bg-gray-50/50">
    <div class="mx-auto max-w-7xl px-6">
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
        
        <div class="lg:col-span-5 space-y-8">
          <Motion
            :key="'text-' + currentScreenIndex"
            :initial="{ opacity: 0, y: 20 }"
            :animate="{ opacity: 1, y: 0 }"
            :transition="{ duration: 0.6, easing: 'ease-out' }"
          >
            <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-xs font-bold uppercase tracking-widest mb-4">
              <span class="relative flex h-2 w-2">
                <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                <span class="relative inline-flex rounded-full h-2 w-2 bg-blue-600"></span>
              </span>
              {{ screens[currentScreenIndex].subtitle }}
            </div>
            
            <h2 class="text-5xl font-black text-gray-900 leading-tight mb-6">
              {{ screens[currentScreenIndex].title }}
            </h2>
            
            <p class="text-lg text-gray-500 leading-relaxed mb-8">
              {{ screens[currentScreenIndex].desc }}
            </p>

            <div class="flex flex-wrap gap-3">
              <span 
                v-for="tag in screens[currentScreenIndex].tags" 
                :key="tag"
                class="px-4 py-2 rounded-xl bg-white border border-gray-200 text-sm font-medium text-gray-600 shadow-sm"
              >
                # {{ tag }}
              </span>
            </div>
          </Motion>
        </div>

        <div class="lg:col-span-7">
          <div class="relative overflow-hidden rounded-3xl border border-gray-200 bg-white p-2 shadow-4xl" style="perspective: 2000px">
            <div class="relative aspect-16/10 overflow-hidden rounded-2xl bg-gray-100">
              <img 
                :src="screens[currentScreenIndex].pc" 
                class="h-full w-full object-cover transition-transform duration-700 hover:scale-105" 
              />
              
              <Motion
                :key="'fold-' + currentScreenIndex"
                :initial="{ rotateY: 0, opacity: 1 }"
                :animate="{ rotateY: -110, opacity: 0 }"
                :transition="{ duration: 1.2, easing: [0.16, 1, 0.3, 1] }"
                :style="{ transformOrigin: 'left center' }"
                class="absolute inset-0 z-10 bg-white/95 backdrop-blur-md flex flex-col justify-center px-16 border-l-8 border-blue-600"
              >
                <div class="text-8xl mb-6">{{ screens[currentScreenIndex].icon }}</div>
                <h3 class="text-4xl font-black text-gray-900 tracking-tighter">
                  Exploring<br/>{{ screens[currentScreenIndex].title }}...
                </h3>
              </Motion>
            </div>
          </div>
        </div>

      </div>
    </div>
  </section>
</template>

<style scoped>
.shadow-4xl {
  box-shadow: 0 50px 100px -20px rgba(0, 0, 0, 0.12), 0 30px 60px -30px rgba(0, 0, 0, 0.18);
}
</style>