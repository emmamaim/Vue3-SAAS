import { createRouter, createWebHistory } from 'vue-router';
import { useUserStore } from '@/stores';
import { ElMessage } from 'element-plus';

import TasksPage from '@/pages/TasksPage.vue';
import SchedulePage from '@/pages/SchedulePage.vue';

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
          path: 'tasks',
          component: TasksPage,
          meta: { requiresAuth: true, roles: ['interviewer'] },
        },
        {
          path: 'schedule',
          component: SchedulePage,
          meta: { requiresAuth: true, roles: ['interviewer', 'dept_hr', 'super_admin'] },
        },
      ],
    },
  ],
});

// 路由守衛
router.beforeEach((to, from, next) => {
  const userStore = useUserStore();
  const hasToken = !!userStore.token;
  const role = userStore.userInfo?.role;
  const requiredRoles = to.meta.roles;
  // 1.token不存在
  if (to.meta.requiresAuth && !hasToken) {
    return next('/login');
  }
  // 2.token存在的情況下禁止回登入頁
  else if (to.path === '/login' && hasToken) {
    return next('/');
  }
  // 3.登入權限不足
  else if (requiredRoles && !requiredRoles.includes(role)) {
    ElMessage.warning('權限不足，已導回首頁');
    return next('/dashboard');
  } else {
    next();
  }
});

export default router;
