<script setup>
import { RouterView } from 'vue-router'
import zhTw from 'element-plus/es/locale/lang/zh-tw.mjs'
</script>

<template>
  <!-- 中文支持 -->
  <el-config-provider :locale="zhTw">
    <RouterView />
  </el-config-provider>
</template>
