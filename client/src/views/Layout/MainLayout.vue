<script setup>
import { ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useUserStore } from '@/stores'
import { Menu as IconMenu, Calendar, DataBoard, Expand, Fold, UserFilled, ArrowDown, SwitchButton, List, User } from '@element-plus/icons-vue'

// 建立store / router / route 實例
const userStore = useUserStore()
const router = useRouter()
const route = useRoute()
//sidebar 收縮
const isCollapse = ref(false)
console.log('當前用戶角色:', userStore.userInfo?.role)
// 切換路由後自動更新 -> el-menu高亮
const activePath = computed(() => route.path)
// 動態標題
const title = computed(() => {
  const map = {
    '/dashboard': '儀表板',
    '/users': '用戶管理',
    '/candidates': '應徵者管理',
    '/tasks': '任務管理',
    '/bookings': '行事曆',
  }
  // 考慮fallback -> 防止加新路由時候標題變空白
  return map[route.path] ?? 'WorkHub'
})

// 登出
const handleLogout = () => {
  userStore.logout()
  router.push('/login')
}
</script>

<template>
  <el-container class="app-shell">
    <el-aside :width="isCollapse ? '64px' : '220px'" class="app-aside">
      <div class="brand">
        <el-icon v-if="isCollapse" size="24px">
          <IconMenu />
        </el-icon>
        <span v-else>工作管理平台</span>
      </div>

      <el-menu :default-active="activePath" class="app-menu" :collapse="isCollapse" :collapse-transition="false" router>
        <el-menu-item v-if="userStore.userInfo?.role === 'super_admin'" index="/users">
          <el-icon>
            <User />
          </el-icon>
          <template #title>用戶管理</template>
        </el-menu-item>
        <el-menu-item index="/dashboard">
          <el-icon>
            <DataBoard />
          </el-icon>
          <template #title>儀表板</template>
        </el-menu-item>
        <el-menu-item v-if="['super_admin', 'dept_hr'].includes(userStore.userInfo?.role)" index="/candidates">
          <el-icon>
            <User />
          </el-icon>
          <template #title>應徵者管理</template>
        </el-menu-item>
        <el-menu-item v-if="userStore.userInfo?.role === 'interviewer'" index="/tasks">
          <el-icon>
            <List />
          </el-icon>
          <template #title>任務管理</template>
        </el-menu-item>
        <el-menu-item v-if="['super_admin', 'dept_hr', 'interviewer'].includes(userStore.userInfo?.role)"
          index="/bookings">
          <el-icon>
            <Calendar />
          </el-icon>
          <template #title>面試行程</template>
        </el-menu-item>
      </el-menu>
    </el-aside>

    <el-container>
      <el-header class="app-header">
        <div class="header-left">
          <el-icon class="collapse-btn" @click="isCollapse = !isCollapse">
            <Expand v-if="isCollapse" />
            <Fold v-else />
          </el-icon>
          <span class="breadcrumb-text">{{ title }}</span>
        </div>

        <div class="header-right">
          <el-dropdown>
            <span class="user-info">
              <el-avatar :size="32" :icon="UserFilled" />
              <span class="username">{{ userStore.userInfo?.username || '使用者' }}</span>
              <el-icon>
                <ArrowDown />
              </el-icon>
            </span>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item @click="handleLogout">
                  <el-icon>
                    <SwitchButton />
                  </el-icon>退出登入
                </el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
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
  height: 100vh;
}

.app-aside {
  background-color: #fff;
  border-right: 1px solid var(--el-border-color-light);
  transition: width 0.3s;
  display: flex;
  flex-direction: column;
  overflow-x: hidden;
}

.brand {
  height: 60px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-weight: bold;
  font-size: 18px;
  color: var(--el-color-primary);
  border-bottom: 1px solid var(--el-border-color-extra-light);
  overflow: hidden;
  white-space: nowrap;
}

.app-menu {
  border-right: none;
}

:deep(.el-menu-item) {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 !important;
}

.el-menu-item .el-icon {
  margin-right: 12px;
  transition: margin 0.3s;
  font-size: 18px;
}

:deep(.el-menu--collapse .el-menu-item) {
  justify-content: center;
}

:deep(.el-menu--collapse .el-menu-item .el-icon) {
  margin-right: 0;
}

:deep(.el-menu-item span) {
  transition: opacity 0.3s;
}

.app-header {
  background: #fff;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 20px;
  border-bottom: 1px solid var(--el-border-color-light);
}

.header-left {
  display: flex;
  align-items: center;
  gap: 15px;
}

.collapse-btn {
  font-size: 20px;
  cursor: pointer;
  color: #606266;
}

.breadcrumb-text {
  font-size: 14px;
  color: #606266;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  outline: none;
}

.username {
  font-size: 14px;
}

.app-main {
  background: #f0f2f5;
  padding: 20px;
}
</style>