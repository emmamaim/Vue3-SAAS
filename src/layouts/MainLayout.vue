<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'

// 路由物件
const route = useRoute()
// 切換路由後自動更新 -> el-menu高亮
const activePath = computed(() => route.path)
// 定義切換路由後顯示的文字
const title = computed(() => {
  const map = {
    '/dashboard': '儀表板',
    '/tasks': '任務看板',
    '/schedule': '行事曆',
  }
  // 考慮fallback -> 防止加新路由時候標題變空白
  return map[route.path] ?? 'WorkHub'
})
</script>

<template>
  <el-container class="app-shell">
    <!-- 左方 aside -->
    <el-aside width="220px" class="app-aside">
      <div class="brand">工作管理平台</div>
      <el-menu :default-active="activePath" class="app-menu" router>
        <el-menu-item index="/dashboard">儀表板</el-menu-item>
        <el-menu-item index="/tasks">任務看板</el-menu-item>
        <el-menu-item index="/schedule">行事曆</el-menu-item>
      </el-menu>
    </el-aside>
    <!-- 右方 header & main -->
    <el-container>
      <el-header class="app-header">
        <div class="header-left">
          {{ title }}
        </div>
        <div class="header-right">
          <el-button size="small">使用者</el-button>
        </div>
      </el-header>
      <el-main class="app-main">
        <router-view />
      </el-main>
    </el-container>
  </el-container>
</template>

<style scoped>
.app-shell {
  /* 100%視窗高度 */
  min-height: 100vh;
}
.app-aside {
  /* 加右邊框->分隔aside和內容區 */
  border-right: 1px solid var(--el-border-color);
  background: #fff;
}
.brand {
  height: 56px;
  display: flex;
  align-items: center;
  padding: 0 16px;
  font-weight: 700;
  font-size: large;
}
.app-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: #fff;
  /* 加底邊框->分隔header和main(router-view) */
  border-bottom: 1px solid var(--el-border-color);
}
.app-main {
  background: #f5f7fa;
}
</style>
