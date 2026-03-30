<script setup>
import { RouterView, useRoute } from 'vue-router'
import zhTw from 'element-plus/es/locale/lang/zh-tw.mjs'
import 'element-plus/theme-chalk/dark/css-vars.css'
import { onMounted } from 'vue';
import { useSystemStore } from '@/stores';
import HomeButton from '@/components/common/HomeButton.vue';

const systemStore = useSystemStore();
const route = useRoute();

onMounted(() => {
  systemStore.fetchAllOptions();
});
</script>

<template>
  <el-config-provider :locale="zhTw">
    <HomeButton v-if="route.path !== '/'" />
    <RouterView v-slot="{ Component, route: currentRoute }">
      <transition 
        name="page-flow" 
        mode="out-in"
      >
        <component :is="Component" :key="currentRoute.path" />
      </transition>
    </RouterView>
  </el-config-provider>
</template>

<style>
/* --- TalentFlow 專屬流體過度動畫 --- */

/* 進入前：輕微下沉並透明 */
.page-flow-enter-from {
  opacity: 0;
  transform: translateY(10px);
}

/* 離開後：向上飄走並透明 */
.page-flow-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

/* 過度中的動畫曲線 */
.page-flow-enter-active,
.page-flow-leave-active {
  transition: 
    opacity 0.3s ease, 
    transform 0.45s cubic-bezier(0.23, 1, 0.32, 1);
}

body {
  background-color: #ffffff;
}

#app {
  overflow-x: hidden;
  width: 100%;
}
</style>