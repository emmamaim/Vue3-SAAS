<script setup>
import { Motion } from '@motionone/vue';

const faqs = [
  {
    q: 'TalentFlow 如何確保數據安全？',
    a: '我們採用企業級加密標準 (AES-256) 儲存敏感數據，並支援 SOC 2 Type II 合規。您的數據受到偏執狂級別的保護。',
  },
  {
    q: '可以自定義招聘流程嗎？',
    a: '絕對可以。我們的後端邏輯高度模組化，您可以為不同職位設計完全不同的面試階段和自動化觸發器。',
  },
  {
    q: '支援哪些第三方工具整合？',
    a: '目前整合了 Google Workspace, Slack, Zoom, 以及主要的招聘平台 (LinkedIn, Indeed) 的 API，讓數據像流水般順暢。',
  },
  {
    q: '專業版 (Pro) 的 AI 篩選如何運作？',
    a: 'AI 透過自然語言處理 (NLP) 深度解析簡歷，根據您自定義的技能和經驗指標進行打分，而非簡單的關鍵字匹配。',
  },
  {
    q: ' Enterprise 版的部署時間？',
    a: '這取決於您的基礎設施復雜度。我們的專屬顧問會從數據搬遷到系統集成全程協助，通常在 2-4 週內完成。',
  },
  {
    q: '年繳方案可以中途更換嗎？',
    a: '可以隨時升級。降級則會在當前服務週期結束後生效。我們採取靈活的訂閱模式，不設陷阱條款。',
  },
];
</script>

<template>
  <section id="faq" class="py-32 bg-gray-50/50 relative overflow-hidden">
    <div
      class="absolute -bottom-40 -left-40 z-0 h-150 w-150 rounded-full bg-blue-100/30 blur-[130px]"
    ></div>

    <div class="mx-auto max-w-7xl px-6 relative z-10">
      <div class="text-center mb-24">
        <h2 class="text-4xl font-black tracking-tight text-gray-900 sm:text-5xl mb-6">
          您想知道的，<span class="text-blue-600">我們都有答案</span>
        </h2>
        <p class="text-lg text-gray-500">深入了解 TalentFlow 的技術細節、商業條款與服務承諾。</p>
      </div>

      <div class="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
        <Motion
          v-for="(faq, index) in faqs"
          :key="faq.q"
          :initial="{ opacity: 0, scale: 0.9, y: 30 }"
          :in-view="{ opacity: 1, scale: 1, y: 0 }"
          :transition="{ delay: index * 0.12, duration: 0.6 }"
          class="group relative flex flex-col rounded-3xl bg-white p-9 shadow-xl border border-gray-100 transition-all duration-300 hover:shadow-gray-200 hover:-translate-y-2 overflow-hidden"
        >
          <div
            class="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700"
          >
            <div
              class="absolute inset-0 z-0 after:absolute after:inset-0 after:rounded-3xl after:border-2 after:border-blue-600 after:content-[''] after:animate-flow-light"
            ></div>
          </div>

          <div class="relative z-10 flex-1">
            <div
              class="mb-6 flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50/50 text-blue-600 shadow-inner group-hover:scale-110 transition-transform duration-500"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="2.5"
                stroke="currentColor"
                class="h-6 w-6"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z"
                />
              </svg>
            </div>

            <h3
              class="mb-5 text-xl font-bold tracking-tight text-gray-900 group-hover:text-blue-700 transition-colors"
            >
              {{ faq.q }}
            </h3>
            <p class="text-sm leading-relaxed text-gray-500 opacity-90">
              {{ faq.a }}
            </p>
          </div>
        </Motion>
      </div>
    </div>
  </section>
</template>

<style scoped>
/* 這裡定義流動光源的關鍵幀動畫 */
@keyframes flow-light {
  0% {
    clip-path: inset(0 100% 100% 0); /* 起點：左上角 */
  }
  25% {
    clip-path: inset(0 0 100% 0); /* 到右上角 */
  }
  50% {
    clip-path: inset(0 0 0 0); /* 到右下角 */
  }
  75% {
    clip-path: inset(100% 0 0 0); /* 到左下角 */
  }
  100% {
    clip-path: inset(100% 100% 0 0); /* 回到左上角 */
  }
}

.animate-flow-light {
  animation: flow-light 1.8s linear infinite;
}
</style>
