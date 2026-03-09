<script setup>
import { RouterView } from 'vue-router'
import zhTw from 'element-plus/es/locale/lang/zh-tw.mjs'
// 初始化系統選項數據（部門、職位、來源等）
import { onMounted } from 'vue';
import { useSystemStore } from '@/stores';
const systemStore = useSystemStore();
onMounted(() => {
  systemStore.fetchAllOptions();
});
</script>

<template>
  <!-- 中文支持 -->
  <el-config-provider :locale="zhTw">
    <RouterView />
  </el-config-provider>
</template>
