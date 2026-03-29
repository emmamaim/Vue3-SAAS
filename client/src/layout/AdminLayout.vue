<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useUserStore } from '@/stores';
import {
  Menu as IconMenu,
  Calendar,
  DataBoard,
  Expand,
  Fold,
  UserFilled,
  ArrowDown,
  SwitchButton,
  List,
  User,
  Setting,
  Avatar,
  Sunny,
  Moon,
} from '@element-plus/icons-vue';
// 引入 VueUse 的主題工具
import { useDark, useToggle } from '@vueuse/core';
import { ElMessageBox, ElMessage } from 'element-plus';

const userStore = useUserStore();
const router = useRouter();
const route = useRoute();
const isCollapse = ref(false);

// 主題切換
const isDark = useDark();
const toggleDark = useToggle(isDark);

// 判斷是否為手機模式
const checkMobile = () => {
  if (window.innerWidth <= 768) {
    isCollapse.value = true;
  }
};

// 切換路由後自動更新 -> el-menu高亮
const activePath = computed(() => route.path);

// 動態標題
const title = computed(() => {
  const map = {
    '/dashboard': '儀表板',
    '/system': '系統配置',
    '/users': '用戶管理',
    '/candidates': '應徵者管理',
    '/tasks': '任務管理',
    '/bookings': '行事曆',
  };
  // 考慮fallback -> 防止加新路由時候標題變空白
  return map[route.path] ?? 'WorkHub';
});

// 登出
const handleLogout = async () => {
  try {
    await ElMessageBox.confirm('您確定要退出系統嗎？', '提示', {
      confirmButtonText: '確定',
      cancelButtonText: '取消',
      type: 'warning',
    });
    await userStore.logout();
    ElMessage.success('已安全退出');
    // 清除狀態後跳轉
    router.push('/login');
  } catch (error) {
    if (error !== 'cancel') {
      console.error('Logout failed:', error);
    }
  }
};

onMounted(() => {
  checkMobile();
  window.addEventListener('resize', checkMobile);
});

onUnmounted(() => {
  window.removeEventListener('resize', checkMobile);
});
</script>

<template>
  <el-container class="app-shell">
    <el-aside :width="isCollapse ? '64px' : '220px'" class="app-aside">
      <div class="brand">
        <el-icon size="24px"><IconMenu /></el-icon>
        <span v-if="!isCollapse">工作管理平台</span>
      </div>

      <el-menu
        :default-active="activePath"
        class="app-menu"
        :collapse="isCollapse"
        :collapse-transition="false"
        router
      >
        <el-menu-item index="/admin/dashboard">
          <el-icon>
            <DataBoard />
          </el-icon>

          <template #title>儀表板</template>
        </el-menu-item>

        <el-menu-item v-if="userStore.userInfo?.role === 'super_admin'" index="/admin/system">
          <el-icon>
            <Setting />
          </el-icon>

          <template #title>系統配置</template>
        </el-menu-item>

        <el-menu-item v-if="userStore.userInfo?.role === 'super_admin'" index="/admin/users">
          <el-icon>
            <User />
          </el-icon>

          <template #title>用戶管理</template>
        </el-menu-item>

        <el-menu-item
          v-if="['super_admin', 'dept_hr'].includes(userStore.userInfo?.role)"
          index="/admin/candidates"
        >
          <el-icon>
            <Avatar />
          </el-icon>

          <template #title>應徵者管理</template>
        </el-menu-item>

        <el-menu-item v-if="userStore.userInfo?.role === 'interviewer'" index="/admin/tasks">
          <el-icon>
            <List />
          </el-icon>

          <template #title>任務管理</template>
        </el-menu-item>

        <el-menu-item
          v-if="['super_admin', 'dept_hr', 'interviewer'].includes(userStore.userInfo?.role)"
          index="/admin/bookings"
        >
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
          <el-button
            circle
            :icon="isDark ? Sunny : Moon"
            @click="toggleDark()"
            class="theme-toggle-btn"
          />
          <el-divider direction="vertical" class="header-divider" />
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
                  <el-icon> <SwitchButton /> </el-icon>退出登入
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
  background-color: var(--el-bg-color);
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
  background: var(--el-bg-color);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 20px;
  border-bottom: 1px solid var(--el-border-color-light);
}

.header-left {
  display: flex;
  align-items: center;
  gap: 20px;
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
  background: var(--el-bg-color-page);
  padding: 8px;
}

/* 手機端 */
@media (max-width: 768px) {
  .app-main {
    padding: 5px;
  }
  .collapse-btn {
    display: none !important;
  }
  .app-aside {
    background-color: var(--el-bg-color) !important;
    width: 60px !important;
  }
  .brand span {
    display: none;
  }
  .header-left {
    padding-left: 5px;
  }
}
</style>
