import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router';
import { useUserStore } from '@/stores';
import { ElMessage } from 'element-plus';

// RouteMeta 介面
declare module 'vue-router' {
  interface RouteMeta {
    requiresAuth?: boolean;
    roles?: string[];
    title?: string;
  }
}

const routes: RouteRecordRaw[] = [
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
    name: 'Login',
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
        name: 'Dashboard',
        component: () => import('@/views/admin/Dashboard/IndexPage.vue'),
      },
      {
        path: 'users',
        name: 'UserManagement',
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
        name: 'CandidateManagement',
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
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

// 路由守衛
router.beforeEach(async (to, from, next) => {
  const userStore = useUserStore();

  // 1. 遊客路徑判斷 (利用 meta 或是路徑)
  const publicPaths = ['/', '/about-us', '/contact-us'];
  if (publicPaths.includes(to.path)) {
    return next();
  }

  // 2. 登入頁面攔截
  if (to.path === '/login') {
    if (userStore.isLoggedIn) return next('/admin/dashboard');
    return next();
  }

  // 3. 身份驗證攔截
  if (to.meta.requiresAuth && !userStore.isLoggedIn) {
    return next('/login');
  }

  // 4. 確認使用者資訊與權限
  try {
    if (userStore.isLoggedIn && !userStore.userInfo?.id) {
      await userStore.getUserInfo();
    }

    const userRole = userStore.userInfo?.role;
    const requiredRoles = to.meta.roles;

    // 權限檢查邏輯
    if (requiredRoles && userRole && !requiredRoles.includes(userRole)) {
      ElMessage.warning('權限不足，已導回首頁');
      // 避免無限循環：如果要去的目標已經是 dashboard 就直接放行，否則導回
      return to.path === '/admin/dashboard' ? next() : next('/admin/dashboard');
    }
    
    next();
  } catch (error) {
    console.log(error);
    userStore.clearLocalData();
    next('/login');
  }
});

export default router;
