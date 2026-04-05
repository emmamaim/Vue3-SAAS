<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import { Motion } from '@motionone/vue';
import type { ScreenFeature } from '@/types';

// --- 圖片引入 ---
import loginImg from '@/assets/images/loginPage.png';
import dashboardImg from '@/assets/images/dashboard.png';
import settingsImg from '@/assets/images/settings.png';
import candidatesImg from '@/assets/images/candidates.png';
import calendarImg from '@/assets/images/calendar.png';

const currentScreenIndex = ref<number>(0);

// --- 根據圖片內容撰寫的行銷文案 ---
const screens: ScreenFeature[] = [
  {
    pc: loginImg,
    title: '安全便捷的存取門戶',
    subtitle: 'Secure Access',
    desc: 'TalentFlow 採用業界標準的 JWT 認證機制與 Cookie 安全策略，確保您的招募數據受到嚴密保護。直觀的登入介面，開啟高效招募的第一步。',
    tags: ['JWT 認證', 'HttpOnly Cookie', '防禦性設計'],
    icon: '🔐',
  },
  {
    pc: dashboardImg,
    title: '招募數據決策中心',
    subtitle: 'ATS Dashboard',
    desc: '全方位的招募儀表板，將繁瑣的候選人數據轉化為即時視覺化圖表。從招聘漏斗到履歷投遞趨勢，所有關鍵指標一目了然。',
    tags: ['招聘漏斗', '數據視覺化', '即時指標'],
    icon: '📊',
  },
  {
    pc: candidatesImg,
    title: '智慧候選人管理ATS',
    subtitle: 'Candidate Management',
    desc: '結構化的候選人列表，支持強大的篩選與排序功能。後端 MongoDB 的高效查詢設計，確保即使面對海量履歷，管理依然順暢無阻。',
    tags: ['結構化數據', '高效查詢', '履歷篩選'],
    icon: '👤',
  },
  {
    pc: calendarImg,
    title: '智能面試排程系統',
    subtitle: 'Interview Calendar',
    desc: '整合面試官與候選人的時間，一鍵自動排程。直觀的行事曆介面，告別繁瑣的時間確認郵件，顯著提升招募團隊協作效率。',
    tags: ['排程自動化', '拖拽互動', '團隊協作'],
    icon: '📅',
  },
  {
    pc: settingsImg,
    title: '靈活的企業個性化設置',
    subtitle: 'Enterprise Settings',
    desc: '從基礎企業資訊到自定義招募階段，皆可輕鬆配置。模組化的後端設置邏輯，滿足不同規模企業的個性化招募流程需求。',
    tags: ['模組化配置', '權限設定', '流程自定義'],
    icon: '⚙️',
  },
];

// 計時器邏輯
let timer: ReturnType<typeof setInterval> | undefined;
const startRotation = (): void => {
  timer = setInterval(() => {
    currentScreenIndex.value = (currentScreenIndex.value + 1) % screens.length;
  }, 5000);
};
const stopRotation = (): void => {
  if (timer) clearInterval(timer);
};
onMounted(() => {
  startRotation();
});
onUnmounted(() => {
  stopRotation();
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
            <div
              class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-xs font-bold uppercase tracking-widest mb-4"
            >
              <span class="relative flex h-2 w-2">
                <span
                  class="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"
                ></span>
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
          <div
            class="relative overflow-hidden rounded-3xl border border-gray-200 bg-white p-2 shadow-4xl"
            style="perspective: 2000px"
          >
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
                  Exploring<br />{{ screens[currentScreenIndex].title }}...
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
  box-shadow:
    0 50px 100px -20px rgba(0, 0, 0, 0.12),
    0 30px 60px -30px rgba(0, 0, 0, 0.18);
}
</style>
