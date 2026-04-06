<script setup lang="ts">
import { ref, type ComponentPublicInstance } from 'vue';
import { Motion } from '@motionone/vue';
import type { Feature, TechItem } from '@/types/landing';

import PricingSection from '@/views/landing/components/PricingSection.vue';
import FaqSection from '@/views/landing/components/FaqSection.vue';
import ScrollShowcase from '@/views/landing/components/ScrollShowcase.vue';
import TestAccountSection from '@/views/landing/components/TestAccountSection.vue';

// --- 圖片引入 ---
import bgImg1 from '@/assets/images/bg_img1.png';
import cardImg1 from '@/assets/images/card_img1.png';
import cardImg2 from '@/assets/images/card_img2.png';
import cardImg3 from '@/assets/images/card_img3.png';
import router from '@/router';

// 體驗按鈕導航到測試賬號區塊
const testAccountRef = ref<ComponentPublicInstance | null>(null);
const scrollToTest = () => {
  if (testAccountRef.value) {
    const element = testAccountRef.value.$el || testAccountRef.value;
    const offset = 80;
    const top = element.getBoundingClientRect().top + window.pageYOffset - offset;
    window.scrollTo({ top, behavior: 'smooth' });
  }
};

const features: Feature[] = [
  { title: '智能候選人 ATS', desc: '全自動化篩選簡歷，不再錯過優秀人才。', img: cardImg1 },
  { title: '面試自動排程', desc: '一鍵整合行事曆，免去確認時間。', img: cardImg2 },
  { title: '自動化工作流', desc: '自定義招聘階段，讓流程像流水般順暢。', img: cardImg3 },
];

const techStack: TechItem[] = [
  { name: 'Vue 3', category: 'Frontend' },
  { name: 'Express.js', category: 'Backend' },
  { name: 'MongoDB', category: 'Database' },
  { name: 'Tailwind v4', category: 'Styling' },
];

const goMonitor = () => {
  router.push('/live-monitor');
};
</script>

<template>
  <div class="bg-white selection:bg-blue-100 selection:text-blue-700">
    <section class="relative overflow-hidden px-6 pt-32 pb-24 lg:pt-52 lg:pb-36">
      <div
        class="absolute -top-40 -left-40 z-0 h-150 w-150 rounded-full bg-blue-400/20 blur-3xl animate-slow-spin"
      ></div>

      <div class="mx-auto max-w-7xl">
        <div class="grid items-center gap-16 lg:grid-cols-2 lg:gap-8">
          <Motion
            :initial="{ opacity: 0, x: -40 }"
            :animate="{ opacity: 1, x: 0 }"
            :transition="{ duration: 0.8, delay: 0.2, easing: [0.16, 1, 0.3, 1] }"
            class="z-10"
          >
            <h1
              class="text-6xl font-black tracking-tighter text-gray-900 sm:text-8xl lg:leading-[1.05]"
            >
              讓人才招募像<br />
              <span class="relative inline-block text-blue-600">
                流水
                <Motion
                  :initial="{ scaleX: 0 }"
                  :animate="{ scaleX: 1 }"
                  :transition="{ delay: 1, duration: 0.8, easing: 'ease-out' }"
                  class="absolute bottom-3 left-0 h-4 w-full origin-left bg-blue-100/60 -z-10 rounded-sm"
                />
              </span>
              一樣順暢
            </h1>
            <p class="mt-10 max-w-xl text-xl leading-relaxed text-gray-500">
              TalentFlow 重新定義 HR
              工作流。透過精確的後端邏輯與數據視覺化，將繁瑣的招聘流程轉化為極致的增長動力。
            </p>
            <button
              class="btn-shimmer btn-3d relative mt-14 rounded-2xl bg-blue-600 px-10 py-5 text-lg font-bold text-white transition-all active:scale-95"
              @click="scrollToTest"
            >
              <span class="relative z-10">開始免費體驗</span>
            </button>
          </Motion>

          <Motion
            :initial="{ opacity: 0, scale: 0.85, rotate: 5 }"
            :animate="{ opacity: 1, scale: 1, rotate: 0 }"
            :transition="{ duration: 1.2, easing: [0.16, 1, 0.3, 1] }"
            class="relative z-10 flex justify-center"
          >
            <img :src="bgImg1" alt="Hero" class="w-full max-w-150 animate-ultra-float" />
          </Motion>
        </div>
      </div>
    </section>

    <section class="py-32 bg-gray-50/50">
      <div class="mx-auto max-w-7xl px-6">
        <h2 class="text-center text-4xl font-extrabold text-gray-900 mb-24">
          全方位自動化招聘模組
        </h2>
        <div class="grid grid-cols-1 gap-10 md:grid-cols-3">
          <Motion
            v-for="(feature, index) in features"
            :key="index"
            :initial="{ opacity: 0, y: 50, rotateX: 15 }"
            :in-view="{ opacity: 1, y: 0, rotateX: 0 }"
            :transition="{
              duration: 0.8,
              delay: index * 0.15,
              easing: 'ease-out',
            }"
            class="group rounded-3xl border border-gray-100 bg-white p-10 shadow-xl transition-[box-shadow,background-color] duration-500"
          >
            <div class="transition-transform duration-500 group-hover:-translate-y-3">
              <div class="mb-10 h-24 w-24 rounded-3xl bg-blue-50/50 p-3 shadow-inner">
                <img
                  :src="feature.img"
                  class="h-full w-full object-contain transform group-hover:scale-110 transition-transform duration-500"
                />
              </div>
              <h3 class="mb-5 text-2xl font-bold text-gray-900">{{ feature.title }}</h3>
              <p class="text-gray-500">{{ feature.desc }}</p>
            </div>
          </Motion>
        </div>
      </div>
    </section>

    <section class="bg-gray-950 py-32 text-white">
      <div class="mx-auto max-w-7xl px-6 flex flex-col lg:flex-row gap-20 items-center">
        <div class="lg:w-1/2 space-y-8">
          <h2 class="text-4xl font-black tracking-tight leading-tight">
            穩定是我們的<br />第一優先順位
          </h2>
          <p class="text-lg text-gray-400">
            作為後端導向的開發團隊，我們對代碼質量有著偏執的要求，確保 TalentFlow
            在高併發情境下依然穩定。
          </p>
          <div class="grid grid-cols-2 gap-4">
            <div
              v-for="tech in techStack"
              :key="tech.name"
              class="p-4 rounded-xl border border-white/10 bg-white/5"
            >
              <p class="text-xs text-blue-500 font-bold mb-1 uppercase tracking-widest">
                {{ tech.category }}
              </p>
              <p class="font-bold">{{ tech.name }}</p>
            </div>
          </div>
        </div>
        <div class="lg:w-1/2 relative group w-full">
          <div
            class="absolute inset-0 bg-blue-600/20 blur-3xl opacity-0 group-hover:opacity-100 transition-opacity"
          ></div>
          <div class="relative rounded-2xl border border-white/10 bg-gray-900 p-8 shadow-2xl">
            <pre
              class="text-xs text-blue-400/80 font-mono leading-relaxed overflow-x-auto"
            ><code>// Defensive Candidate Archiving
async function archiveCandidate(id) {
  const result = await db.candidates.updateOne(
    { _id: id },
    { $set: { status: 'archived', updatedAt: new Date() } }
  );
  console.log(`Candidate ${id} secured.`);
}</code></pre>
          </div>
        </div>
        <div class="pt-1">
          <button
            @click="goMonitor"
            class="relative group px-10 py-4 bg-gray-900 text-white font-bold rounded-xl overflow-hidden transition-all duration-300 shadow-[0_0_15px_rgba(37,99,235,0.3)] hover:shadow-[0_0_30px_rgba(37,99,235,0.6)]"
          >
            <div
              class="absolute inset-0 bg-gradient-to-r from-blue-700 to-blue-500 opacity-80 group-hover:opacity-100 transition-opacity"
            ></div>

            <div
              class="absolute -inset-full top-0 block h-full w-1/2 -skew-x-12 bg-gradient-to-r from-transparent to-white/20 opacity-40 group-hover:animate-shine"
            ></div>

            <span class="relative z-10 flex items-center gap-2">
              <span>體驗 Live-Monitor</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-5 w-5 group-hover:translate-x-1.5 transition-transform"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M13 7l5 5m0 0l-5 5m5-5H6"
                />
              </svg>
            </span>
          </button>
        </div>
      </div>
    </section>

    <div class="bg-gray-50/30">
      <ScrollShowcase id="showcase-section" />
      <TestAccountSection id="test-accounts-section" ref="testAccountRef" />
    </div>

    <PricingSection id="pricing-section" />
    <FaqSection id="faq-section" />
  </div>
</template>

<style scoped>
h1 {
  will-change: transform, opacity;
  backface-visibility: hidden;
  -webkit-font-smoothing: antialiased;
}

/* 背景光暈緩慢旋轉動畫 */
@keyframes slowSpin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

/* 漂浮動畫 */
@keyframes ultrafloat {
  0%,
  100% {
    transform: translateY(0) scale(1) translateZ(0);
    filter: drop-shadow(0 15px 15px rgba(59, 130, 246, 0.3));
  }
  33% {
    transform: translateY(-20px) scale(1.02) rotate(0.5deg) translateZ(0);
    filter: drop-shadow(0 40px 30px rgba(59, 130, 246, 0.2));
  }
  66% {
    transform: translateY(-10px) scale(0.98) rotate(-0.5deg) translateZ(0);
    filter: drop-shadow(0 60px 50px rgba(59, 130, 246, 0.15));
  }
}
.animate-ultra-float {
  animation: ultraFloat 10s ease-in-out infinite;
  will-change: transform, filter;
}
.animate-slow-spin {
  animation: slowSpin 30s linear infinite;
}
.btn-3d,
.group,
img {
  will-change: transform, opacity;
  backface-visibility: hidden;
}

/* 按鈕閃光動畫 */
@keyframes shimmer {
  0% {
    transform: translateX(-100%) skewX(-15deg);
  }
  100% {
    transform: translateX(200%) skewX(-15deg);
  }
}
.btn-shimmer {
  position: relative;
  overflow: hidden;
}
.btn-shimmer::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 40%;
  height: 100%;
  background: linear-gradient(to right, transparent, rgba(255, 255, 255, 0.5), transparent);
  z-index: 1;
  animation: shimmer 3s infinite;
  pointer-events: none;
}
.btn-shimmer:hover::after {
  animation-duration: 1.5s;
}

/* 3D 按鈕效果 */
.btn-3d {
  box-shadow:
    0 20px 25px -5px rgba(0, 0, 0, 0.1),
    0 10px 10px -5px rgba(0, 0, 0, 0.04),
    inset 0 -4px 0 rgba(0, 0, 0, 0.2),
    inset 0 2px 0 rgba(255, 255, 255, 0.3);
  background: linear-gradient(180deg, #3b82f6 0%, #4cecec 100%);
  border: 1px solid rgba(255, 255, 255, 0.1);
}
.btn-3d:hover {
  background-color: #2563eb;
  box-shadow:
    0 25px 30px -5px rgba(0, 0, 0, 0.15),
    inset 0 -4px 0 rgba(0, 0, 0, 0.25),
    inset 0 2px 0 rgba(255, 255, 255, 0.4);
  transform: translateY(-2px);
}
.btn-3d:active {
  box-shadow:
    0 5px 10px rgba(0, 0, 0, 0.1),
    inset 0 2px 4px rgba(0, 0, 0, 0.2);
  transform: translateY(2px);
}
</style>
