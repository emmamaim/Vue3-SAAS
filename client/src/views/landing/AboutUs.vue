<script setup lang="ts">
import { Motion } from '@motionone/vue';
import { useRouter, useRoute } from 'vue-router';
import type { CoreValue, Milestone } from '@/types';

// 路由
const router = useRouter();
const route = useRoute();
const goToContact = (): void => {
  router.push('/contact-us');
};

// 核心價值
const values: CoreValue[] = [
  { title: '數據驅動', desc: '不僅是管理，更透過精確的數據看板洞察人才趨勢。', icon: '📊' },
  { title: '自動化導向', desc: '消除重複性行政作業，讓 HR 專注於人才發展。', icon: '⚡' },
  { title: '極致體驗', desc: '追求如流水般順暢的操作路徑，降低學習成本。', icon: '🌊' },
];

// 發展里程碑數據 (Timeline)
const milestones: Milestone[] = [
  {
    year: '2024',
    title: '概念萌芽',
    desc: '觀察到傳統 HR 系統在數據整合上的斷層，開始構思 TalentFlow 核心架構。',
  },
  {
    year: '2025 Q1',
    title: '後端核心完工',
    desc: '完成基於 Express.js 的 RESTful API 與防禦性權限控制系統。',
  },
  {
    year: '2025 Q3',
    title: '3D 視覺化導入',
    desc: '整合數據視覺化技術，讓人才流動率、面試轉化率一目瞭然。',
  },
  {
    year: '2026',
    title: 'TalentFlow SaaS 正式發布',
    desc: '推出完整解決方案，致力於協助企業實現招募數位轉型。',
  },
];
</script>

<template>
  <div class="min-h-screen bg-white pb-32">
    <header class="relative pt-32 pb-20 overflow-hidden">
      <div
        class="absolute top-0 left-1/2 -z-10 h-150 w-150 -translate-x-1/2 rounded-full bg-blue-50/50 blur-3xl opacity-70"
      ></div>
      <div class="mx-auto max-w-4xl px-6 text-center">
        <Motion
          :key="route.path"
          :initial="{ opacity: 0, y: 30 }"
          :animate="{ opacity: 1, y: 0 }"
          :transition="{ duration: 0.8, easing: [0.16, 1, 0.3, 1] }"
        >
          <span
            class="mb-6 inline-block rounded-full bg-blue-100/50 px-4 py-1.5 text-sm font-bold text-blue-600 tracking-wider"
            >OUR MISSION</span
          >
          <h1 class="mb-8 text-5xl font-black tracking-tighter text-gray-900 sm:text-7xl">
            重新定義招募的<span class="text-blue-600">生產力</span>
          </h1>
          <p class="text-xl leading-relaxed text-gray-500 max-w-2xl mx-auto">
            TalentFlow
            不只是一套軟體，它是企業人才戰略的助推器。我們透過精準的後端邏輯，為企業搭建通往頂尖人才的橋樑。
          </p>
        </Motion>
      </div>
    </header>

    <section class="mx-auto max-w-7xl px-6 py-24">
      <div class="grid gap-20 lg:grid-cols-2 items-start">
        <Motion
          :key="route.path"
          :initial="{ opacity: 0, x: -40 }"
          :animate="{ opacity: 1, x: 0 }"
          :transition="{ duration: 0.8, delay: 0.2 }"
        >
          <h2 class="mb-8 text-4xl font-black text-gray-900 tracking-tight leading-tight">
            從開發者視角，<br />解決 HR 的真實痛點。
          </h2>
          <p class="mb-6 text-lg leading-relaxed text-gray-500">
            TalentFlow 成立於 2024 年，總部位於台灣。我們是一群熱愛 Backend
            技術與產品邏輯的開發者，致力於解決招募過程中「資訊碎片化」與「流程冗餘」的問題。
          </p>
          <p class="text-lg leading-relaxed text-gray-500">
            我們深信，好的 SaaS
            產品應該像空氣一樣自然——在後端處理掉所有的複雜性，只把最直覺、最流暢的結果呈獻給使用者。
          </p>

          <div class="mt-12 flex gap-12 border-t border-gray-100 pt-10">
            <div>
              <p class="text-3xl font-black text-blue-600">99.9%</p>
              <p class="text-sm font-bold text-gray-400 uppercase tracking-widest">系統可用性</p>
            </div>
            <div>
              <p class="text-3xl font-black text-blue-600">200+</p>
              <p class="text-sm font-bold text-gray-400 uppercase tracking-widest">邏輯測試案例</p>
            </div>
          </div>
        </Motion>

        <div
          class="relative space-y-12 before:absolute before:inset-y-0 before:left-4 before:w-0.5 before:bg-blue-100 lg:pl-10"
        >
          <Motion
            v-for="(item, index) in milestones"
            :key="route.path + index"
            :initial="{ opacity: 0, x: 30 }"
            :animate="{ opacity: 1, x: 0 }"
            :transition="{ delay: 0.4 + index * 0.15, duration: 0.6 }"
            class="relative pl-12"
          >
            <div
              class="absolute left-1.5 top-1.5 h-5 w-5 rounded-full border-4 border-white bg-blue-600 shadow-md"
            ></div>
            <span class="mb-1 block text-sm font-black tracking-widest text-blue-600 uppercase">{{
              item.year
            }}</span>
            <h4 class="mb-2 text-xl font-bold text-gray-900">{{ item.title }}</h4>
            <p class="text-gray-500 leading-relaxed">{{ item.desc }}</p>
          </Motion>
        </div>
      </div>
    </section>

    <section class="bg-gray-50/50 py-32">
      <div class="mx-auto max-w-7xl px-6">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-12">
          <Motion
            v-for="(value, index) in values"
            :key="route.path + 'val' + index"
            :initial="{ opacity: 0, y: 30 }"
            :in-view="{ opacity: 1, y: 0 }"
            :transition="{ delay: index * 0.1, duration: 0.6 }"
            class="group rounded-3xl border border-gray-100 bg-white p-10 transition-all hover:shadow-2xl hover:shadow-blue-500/5 hover:-translate-y-2"
          >
            <div class="mb-6 text-4xl group-hover:scale-110 transition-transform duration-300">
              {{ value.icon }}
            </div>
            <h3 class="mb-4 text-2xl font-bold text-gray-900">{{ value.title }}</h3>
            <p class="leading-relaxed text-gray-500">{{ value.desc }}</p>
          </Motion>
        </div>
      </div>
    </section>

    <section class="mx-auto max-w-4xl px-6 py-40 text-center">
      <Motion
        :key="route.path + 'cta'"
        :initial="{ scale: 0.95, opacity: 0 }"
        :in-view="{ scale: 1, opacity: 1 }"
        class="rounded-[3rem] bg-blue-600 p-16 text-white shadow-2xl shadow-blue-500/30"
      >
        <h2 class="mb-6 text-4xl font-black tracking-tight">準備好優化您的招募流程了嗎？</h2>
        <p class="mb-10 text-blue-100 text-lg font-medium opacity-80">
          立即體驗由專業開發團隊打造的招募黑科技。
        </p>
        <button
          @click="goToContact"
          class="rounded-2xl bg-white px-12 py-5 text-xl font-black text-blue-600 shadow-xl transition-all hover:scale-105 hover:bg-blue-50 active:scale-95"
        >
          立刻預約演示
        </button>
      </Motion>
    </section>
  </div>
</template>
