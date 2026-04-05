<script setup lang="ts">
import { useRouter, RouterView } from 'vue-router';
import { ref, onMounted, onUnmounted } from 'vue';
import { Motion } from '@motionone/vue';

const router = useRouter();
const showBackToTop = ref<boolean>(false);

// --- 捲動邏輯 ---
const handleScroll = (): void => {
  showBackToTop.value = window.scrollY > 400;
};

const scrollToTop = (): void => {
  window.scrollTo({
    top: 0,
    behavior: 'smooth',
  });
};

onMounted(() => window.addEventListener('scroll', handleScroll));
onUnmounted(() => window.removeEventListener('scroll', handleScroll));

// --- 導航跳轉 ---
const goToContact = () => router.push('/contact-us');
const goToAbout = () => router.push('/about-us');
const goToHome = () => router.push('/');
</script>

<template>
  <div class="min-h-screen bg-white">
    <nav class="sticky top-0 z-50 w-full border-b border-gray-100 bg-white/80 backdrop-blur-md">
      <div class="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-8">
        <div class="flex items-center gap-2 sm:gap-3 cursor-pointer group" @click="goToHome">
          <div
            class="flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-xl bg-blue-600 shadow-lg shadow-blue-200 group-hover:scale-110 transition-transform duration-300"
          >
            <span class="text-lg sm:text-xl font-bold text-white italic">T</span>
          </div>
          <span class="text-xl sm:text-2xl font-black tracking-tighter text-gray-900"
            >TalentFlow</span
          >
        </div>

        <div class="flex items-center gap-3 sm:gap-6">
          <button
            @click="goToAbout"
            class="text-sm font-bold text-gray-600 hover:text-blue-600 transition-colors"
          >
            關於我們
          </button>
          <button
            @click="goToContact"
            class="rounded-xl sm:rounded-2xl bg-gray-900 px-4 py-2 sm:px-7 sm:py-3 text-xs sm:text-sm font-bold text-white hover:bg-blue-600 transition-all shadow-xl active:scale-95"
          >
            聯絡我們
          </button>
        </div>
      </div>
    </nav>

    <main>
      <RouterView v-slot="{ Component }">
        <transition name="page-flow" mode="out-in">
          <component :is="Component" />
        </transition>
      </RouterView>
    </main>

    <Motion
      :initial="{ opacity: 0, scale: 0.5, y: 20 }"
      :animate="showBackToTop ? { opacity: 1, scale: 1, y: 0 } : { opacity: 0, scale: 0.5, y: 20 }"
      class="fixed right-6 bottom-6 sm:right-8 sm:bottom-8 z-50"
    >
      <button
        v-show="showBackToTop"
        @click="scrollToTop"
        class="flex h-12 w-12 sm:h-14 sm:w-14 items-center justify-center rounded-2xl bg-white text-gray-900 shadow-2xl border border-gray-100 transition-all hover:bg-blue-600 hover:text-white hover:-translate-y-1 active:scale-90 group"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke-width="2.5"
          stroke="currentColor"
          class="h-6 w-6 group-hover:animate-bounce"
        >
          <path stroke-linecap="round" stroke-linejoin="round" d="M4.5 15.75l7.5-7.5 7.5 7.5" />
        </svg>
      </button>
    </Motion>

    <footer class="bg-gray-50 border-t border-gray-100 py-16">
      <div class="mx-auto max-w-7xl px-8 text-center">
        <div class="mb-6 flex justify-center">
          <div class="h-8 w-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <span class="text-white font-bold text-xs">T</span>
          </div>
        </div>
        <p class="text-sm font-medium text-gray-400">
          © 2026 TalentFlow SaaS. <br />
          致力於打造最高效、最具數據洞察力的招聘管理系統
        </p>
      </div>
    </footer>
  </div>
</template>

<style scoped>
.page-flow-enter-from {
  opacity: 0;
  transform: translateY(10px);
}
.page-flow-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}
.page-flow-enter-active,
.page-flow-leave-active {
  transition:
    opacity 0.3s ease,
    transform 0.45s cubic-bezier(0.23, 1, 0.32, 1);
}
</style>
