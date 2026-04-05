<script setup lang="ts">
import { useRouter, useRoute } from 'vue-router';
import { Motion } from '@motionone/vue';
import { useUserStore } from '@/stores/modules/users';

// 基礎配置
const router = useRouter();
const route = useRoute();
const userStore = useUserStore();

// 回首頁
const handleBackToHome = async (): Promise<void> => {
  if (userStore.isLoggedIn) {
    try {
      await userStore.logout();
    } catch {
      userStore.clearLocalData();
    }
  }
  router.push('/');
};
</script>

<template>
  <Motion
    v-if="route.path !== '/'"
    :initial="{ opacity: 0, x: 20 }"
    :animate="{ opacity: 1, x: 0 }"
    class="fixed right-6 bottom-24 sm:right-8 sm:bottom-28 z-100"
  >
    <button
      @click="handleBackToHome"
      class="group relative flex items-center rounded-2xl bg-white/60 p-1.5 backdrop-blur-xl border border-white/40 shadow-2xl transition-all duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] hover:bg-white/95 hover:shadow-blue-500/20 active:scale-95"
    >
      <div
        class="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-white shadow-lg transition-all duration-500 group-hover:rotate-360"
        :class="userStore.isLoggedIn ? 'bg-red-500' : 'bg-blue-600'"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2.5"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
          <polyline points="9 22 9 12 15 12 15 22" />
        </svg>
      </div>

      <div
        class="max-w-0 opacity-0 overflow-hidden transition-all duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] group-hover:max-w-xs group-hover:opacity-100"
      >
        <div class="flex flex-col items-start px-4 leading-tight whitespace-nowrap">
          <span
            class="text-[10px] font-bold uppercase tracking-[0.2em]"
            :class="userStore.isLoggedIn ? 'text-red-500' : 'text-blue-600'"
          >
            {{ userStore.isLoggedIn ? 'Logout' : 'Return' }}
          </span>
          <span class="text-sm font-black text-gray-800">
            {{ userStore.isLoggedIn ? '登出並回首頁' : '回首頁' }}
          </span>
        </div>
      </div>

      <span v-if="userStore.isLoggedIn" class="absolute -top-1 -left-1 flex h-4 w-4">
        <span
          class="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"
        ></span>
        <span
          class="relative inline-flex rounded-full h-4 w-4 bg-red-500 border-2 border-white"
        ></span>
      </span>

      <div class="absolute inset-0 rounded-2xl border border-white/20 pointer-events-none"></div>
    </button>
  </Motion>
</template>

<style scoped>
.group:hover {
  padding-right: 1.25rem;
}
</style>
