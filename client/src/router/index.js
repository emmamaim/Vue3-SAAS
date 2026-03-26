import { createRouter, createWebHistory } from 'vue-router';
import { useUserStore } from '@/stores';
import { ElMessage } from 'element-plus';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/login',
      component: () => import('@/views/Login/LoginPage.vue'),
    },
    {
      path: '/',
      component: () => import('@/views/Layout/MainLayout.vue'),
      redirect: '/dashboard',
      children: [
        // 普通用戶
        {
          path: 'dashboard',
          component: () => import('@/views/Dashboard/IndexPage.vue'),
          meta: { requiresAuth: true },
        },
        // 管理員
        {
          path: 'users',
          component: () => import('@/views/Users/UserManagement.vue'),
          meta: { requiresAuth: true, roles: ['super_admin'] },
        },
        {
          path: 'system',
          name: 'SystemSettings',
          component: () => import('@/views/System/SystemSettings.vue'),
          meta: {
            requiresAuth: true,
            roles: ['super_admin'],
            title: '系統基礎配置',
          },
        },
        // 允許管理員與HR進入
        {
          path: 'candidates',
          component: () => import('@/views/Candidates/CandidateManagement.vue'),
          meta: {
            requiresAuth: true,
            roles: ['super_admin', 'dept_hr'],
          },
        },
        {
          path: 'bookings',
          name: 'Bookings',
          component: () => import('@/views/Bookings/BookingPage.vue'),
          meta: {
            requiresAuth: true,
            roles: ['super_admin', 'dept_hr', 'interviewer'],
            title: '行事曆管理',
          },
        },
        // 面試官專用頁面
        {
          path: 'tasks',
          name: 'Tasks',
          component: () => import('@/views/Tasks/TasksPage.vue'),
          meta: { requiresAuth: true, roles: ['interviewer'] },
        },
      ],
    },
  ],
});

// 路由守衛
router.beforeEach(async (to, from, next) => {
  const userStore = useUserStore();
  const { isLoggedIn } = userStore;

  if (to.path === '/login') {
    // 已登入 => 回首頁
    if (isLoggedIn) return next('/');
    // 未登入去登入頁 => 放行
    return next();
  }
  // 未登入 => 去其他頁面 => 回登入頁
  if (!isLoggedIn) {
    return next('/login');
  }
  // 3.確認cookie有效
  try {
    await userStore.getUserInfo();
    const userRole = userStore.userInfo?.role;
    const requiredRoles = to.meta.roles;
    if (requiredRoles && !requiredRoles.includes(userRole)) {
      ElMessage.warning('權限不足，已導回首頁');
      return next('/dashboard');
    }
    next();
  } catch (error) {
    next('/login');
  }
});

export default router;
