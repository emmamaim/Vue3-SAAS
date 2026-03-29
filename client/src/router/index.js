import { createRouter, createWebHistory } from 'vue-router';
import { useUserStore } from '@/stores';
import { ElMessage } from 'element-plus';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    // 遊客區
    {
      path: '/',
      component: () => import('@/layout/MainLayout.vue'),
      children: [
        {
          path: '',
          name: 'Home',
          component: () => import('@/views/landing/HomePage.vue'),
        },
        {
          path: 'about-us',
          name: 'AboutUs',
          component: () => import('@/views/landing/AboutUs.vue'),
        },
        {
          path: 'contact-us',
          name: 'ContactUs',
          component: () => import('@/views/landing/ContactUs.vue'),
        },
      ],
    },
    // 產品展示區
    {
      path: '/login',
      component: () => import('@/views/admin/Login/LoginPage.vue'),
    },
    {
      path: '/admin',
      component: () => import('@/layout/AdminLayout.vue'),
      redirect: '/admin/dashboard',
      meta: { requiresAuth: true },
      children: [
        {
          path: 'dashboard',
          component: () => import('@/views/admin/Dashboard/IndexPage.vue'),
        },
        {
          path: 'users',
          component: () => import('@/views/admin/Users/UserManagement.vue'),
          meta: { requiresAuth: true, roles: ['super_admin'] },
        },
        {
          path: 'system',
          name: 'SystemSettings',
          component: () => import('@/views/admin/System/SystemSettings.vue'),
          meta: {
            requiresAuth: true,
            roles: ['super_admin'],
            title: '系統基礎配置',
          },
        },
        {
          path: 'candidates',
          component: () => import('@/views/admin/Candidates/CandidateManagement.vue'),
          meta: {
            requiresAuth: true,
            roles: ['super_admin', 'dept_hr'],
          },
        },
        {
          path: 'bookings',
          name: 'Bookings',
          component: () => import('@/views/admin/Bookings/BookingPage.vue'),
          meta: {
            requiresAuth: true,
            roles: ['super_admin', 'dept_hr', 'interviewer'],
            title: '行事曆管理',
          },
        },
        {
          path: 'tasks',
          name: 'Tasks',
          component: () => import('@/views/admin/Tasks/TasksPage.vue'),
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

  // 遊客
  const publicPaths = ['/', '/about-us', '/contact-us'];
  if (publicPaths.includes(to.path)) {
    return next();
  }
  // 產品區
  if (to.path === '/login') {
    // 已登入 => 回首頁
    if (isLoggedIn) return next('/admin/dashboard');
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
      return next('/admin/dashboard');
    }
    next();
  } catch (error) {
    next('/login');
  }
});

export default router;
