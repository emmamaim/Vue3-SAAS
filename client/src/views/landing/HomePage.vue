<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import { Motion } from '@motionone/vue';
import PricingSection from '@/views/landing/components/PricingSection.vue';
import FaqSection from '@/views/landing/components/FaqSection.vue';
import ScrollShowcase from '@/views/landing/components/ScrollShowcase.vue';
import TestAccountSection from '@/views/landing/components/TestAccountSection.vue';

// --- 圖片引入 ---
import bgImg1 from '@/assets/images/bg_img1.png';
import cardImg1 from '@/assets/images/card_img1.png';
import cardImg2 from '@/assets/images/card_img2.png';
import cardImg3 from '@/assets/images/card_img3.png';
import { useRouter } from 'vue-router';

const router = useRouter();
const goLogin = () => router.push('/login');

// --- 視差與漂浮控制 ---
const heroRef = ref(null);
const tilt = ref({ x: 0, y: 0 });

const handleMouseMove = (e) => {
  const { clientX, clientY } = e;
  const { innerWidth, innerHeight } = window;
  tilt.value.x = (clientX / innerWidth - 0.5) * 18;
  tilt.value.y = (clientY / innerHeight - 0.5) * 12;
};

onMounted(() => {
  window.addEventListener('mousemove', handleMouseMove);
});
onUnmounted(() => {
  window.removeEventListener('mousemove', handleMouseMove);
});

const features = [
  { title: '智能候選人 ATS', desc: '全自動化篩選簡歷，不再錯過優秀人才。', img: cardImg1 },
  { title: '面試自動排程', desc: '一鍵整合行事曆，免去確認時間。', img: cardImg2 },
  { title: '自動化工作流', desc: '自定義招聘階段，讓流程像流水般順暢。', img: cardImg3 },
];

const techStack = [
  { name: 'Vue 3', category: 'Frontend' },
  { name: 'Express.js', category: 'Backend' },
  { name: 'MongoDB', category: 'Database' },
  { name: 'Tailwind v4', category: 'Styling' },
];
</script>

<template>
  <div class="bg-white selection:bg-blue-100 selection:text-blue-700">
    <section ref="heroRef" class="relative overflow-hidden px-6 pt-32 pb-24 lg:pt-52 lg:pb-36">
      <div
        class="absolute -top-40 -left-40 z-0 h-150 w-150 rounded-full bg-blue-400/20 blur-3xl"
      ></div>
      <div class="mx-auto max-w-7xl">
        <div class="grid items-center gap-16 lg:grid-cols-2 lg:gap-8">
          <Motion
            :initial="{ opacity: 0, x: -40 }"
            :animate="{ opacity: 1, x: 0 }"
            :transition="{ duration: 0.8 }"
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
                  :transition="{ delay: 0.8, duration: 0.6 }"
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
              class="mt-14 rounded-2xl bg-blue-600 px-10 py-5 text-lg font-bold text-white shadow-2xl transition-all hover:bg-blue-700 hover:scale-105 active:scale-95"
              @click="goLogin"
            >
              開始免費體驗
            </button>
          </Motion>
          <Motion
            :initial="{ opacity: 0, scale: 0.85, rotate: 5 }"
            :animate="{ opacity: 1, scale: 1, rotate: 0 }"
            :transition="{ duration: 1.2, type: 'spring', damping: 15 }"
            :style="{ transform: `translate(${tilt.x}px, ${tilt.y}px)` }"
          >
            <img :src="bgImg1" alt="Hero" class="relative z-10 animate-float drop-shadow-2xl" />
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
            :transition="{ duration: 0.8, delay: index * 0.2 }"
            class="group rounded-3xl border border-gray-100 bg-white p-10 shadow-xl transition-all hover:-translate-y-2"
          >
            <div class="mb-10 h-24 w-24 rounded-3xl bg-blue-50/50 p-3 shadow-inner">
              <img
                :src="feature.img"
                class="h-full w-full object-contain transform group-hover:scale-110 transition-transform duration-500"
              />
            </div>
            <h3 class="mb-5 text-2xl font-bold text-gray-900">{{ feature.title }}</h3>
            <p class="text-gray-500">{{ feature.desc }}</p>
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
      </div>
    </section>

    <div class="bg-gray-50/30">
      <ScrollShowcase id="showcase-section" />

      <TestAccountSection id="test-accounts-section" />
    </div>

    <PricingSection id="pricing-section" />

    <FaqSection id="faq-section" />
  </div>
</template>

<style scoped>
@keyframes float {
  0%,
  100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-12px);
  }
}
.animate-float {
  animation: float 4.5s ease-in-out infinite;
}
.shadow-4xl {
  box-shadow:
    0 50px 100px -20px rgba(0, 0, 0, 0.12),
    0 30px 60px -30px rgba(0, 0, 0, 0.18);
}
.shadow-6xl {
  box-shadow:
    0 70px 140px -30px rgba(0, 0, 0, 0.25),
    0 40px 80px -40px rgba(0, 0, 0, 0.3);
}
</style>
