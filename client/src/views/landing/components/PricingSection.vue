<script setup>
import { Motion } from '@motionone/vue';
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();

const goLogin = () => {
  router.push('/login');
};
const goToContact = () => router.push('/contact-us');

const isYearly = ref(true);
const plans = [
  {
    name: '基礎版 (Free)',
    price: 0,
    desc: '適合正在尋找首位人才的新創個人',
    features: ['50 份人才簡歷儲存', '基礎 Kanban 管理', '單一管理員帳號', '電子郵件支援'],
    button: '免費開始',
    highlight: false,
    action: goLogin,
  },
  {
    name: '專業版 (Pro)',
    price: 2900,
    desc: '針對快速成長企業的自動化方案',
    features: [
      '無限人才簡歷儲存',
      'AI 簡歷自動篩選',
      '5 位團隊協作帳號',
      '自定義面試工作流',
      'API 數據導出',
    ],
    button: '立即升級',
    highlight: true,
    action: goToContact,
  },
  {
    name: '企業版 (Enterprise)',
    price: '客製化',
    desc: '為大型集團量身打造的私有化部署',
    features: [
      '專屬資料庫隔離',
      'SSO 單一登入整合',
      '不限帳號數量',
      '24/7 專屬技術顧問',
      'SLA 服務保證',
    ],
    button: '聯繫銷售',
    highlight: false,
    action: goToContact,
  },
];
</script>

<template>
  <section id="pricing" class="py-32 bg-white relative overflow-hidden">
    <div
      class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 -z-10 h-150 w-200 rounded-full bg-blue-50/50 blur-[120px]"
    ></div>

    <div class="mx-auto max-w-7xl px-6">
      <div class="text-center mb-20">
        <h2 class="text-4xl font-black tracking-tight text-gray-900 sm:text-5xl mb-6">
          透明且靈活的方案
        </h2>
        <p class="text-lg text-gray-500 mb-10">
          無論是剛起步的個人工作室，還是跨國集團，TalentFlow 都有適合您的配置。
        </p>

        <div class="flex items-center justify-center gap-4">
          <span :class="!isYearly ? 'text-gray-900 font-bold' : 'text-gray-400'">月繳</span>
          <button
            @click="isYearly = !isYearly"
            class="relative h-8 w-14 rounded-full bg-gray-200 p-1 transition-colors duration-300"
            :class="{ 'bg-blue-600': isYearly }"
          >
            <div
              class="h-6 w-6 rounded-full bg-white shadow-md transition-transform duration-300"
              :class="{ 'translate-x-6': isYearly }"
            ></div>
          </button>
          <span :class="isYearly ? 'text-gray-900 font-bold' : 'text-gray-400'"
            >年繳 <span class="text-blue-600 text-xs font-black uppercase ml-1">省 20%</span></span
          >
        </div>
      </div>

      <div class="grid grid-cols-1 gap-12 md:px-12 lg:px-0 lg:grid-cols-3 lg:gap-8 lg:items-center">
        <Motion
          v-for="(plan, index) in plans"
          :key="index"
          :initial="{ opacity: 0, y: 30 }"
          :in-view="{ opacity: 1, y: 0 }"
          :transition="{ delay: index * 0.1, duration: 0.6 }"
          class="relative flex flex-col"
        >
          <div
            class="relative flex flex-col h-full rounded-3xl p-8 transition-all duration-300"
            :class="[
              plan.highlight
                ? 'bg-gray-900 text-white shadow-2xl z-10 border-4 border-blue-500/20 lg:scale-110'
                : 'bg-white text-gray-900 border border-gray-100 shadow-xl lg:hover:scale-105 lg:hover:shadow-gray-200',
            ]"
          >
            <div
              v-if="plan.highlight"
              class="absolute -top-5 left-1/2 -translate-x-1/2 rounded-full bg-blue-600 px-4 py-1 text-xs font-black uppercase tracking-widest text-white"
            >
              最受歡迎
            </div>

            <div class="mb-8">
              <h3 class="text-xl font-bold mb-2">{{ plan.name }}</h3>
              <div class="flex items-baseline gap-1">
                <span class="text-4xl font-black leading-none">
                  {{
                    typeof plan.price === 'number'
                      ? isYearly
                        ? `NT$ ${Math.round(plan.price * 0.8)}`
                        : `NT$ ${plan.price}`
                      : plan.price
                  }}
                </span>
                <span v-if="typeof plan.price === 'number'" class="text-sm opacity-60">/ 月</span>
              </div>
              <p class="mt-4 text-sm opacity-70">{{ plan.desc }}</p>
            </div>

            <ul class="mb-10 flex-1 space-y-4">
              <li
                v-for="feature in plan.features"
                :key="feature"
                class="flex items-center gap-3 text-sm"
              >
                <span
                  class="flex h-5 w-5 items-center justify-center rounded-full bg-blue-500/20 text-blue-500 text-xs font-bold"
                  >✓</span
                >
                {{ feature }}
              </li>
            </ul>

            <button
              @click="plan.action()"
              class="w-full rounded-2xl py-4 text-sm font-black transition-all active:scale-95"
              :class="[
                plan.highlight
                  ? 'bg-blue-600 text-white hover:bg-blue-500 shadow-lg shadow-blue-600/30'
                  : 'bg-gray-100 text-gray-900 hover:bg-gray-200',
              ]"
            >
              {{ plan.button }}
            </button>
          </div>
        </Motion>
      </div>
    </div>
  </section>
</template>
