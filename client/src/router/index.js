import { createRouter, createWebHistory } from 'vue-router'
import MainLayout from '@/layouts/MainLayout.vue'
import DashboardPage from '@/pages/DashboardPage.vue'
import TasksPage from '@/pages/TasksPage.vue'
import SchedulePage from '@/pages/SchedulePage.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      component: MainLayout,
      redirect: '/dashboard',
      children: [
        { path: 'dashboard', component: DashboardPage },
        { path: 'tasks', component: TasksPage },
        { path: 'schedule', component: SchedulePage },
      ],
    },
  ],
})

export default router
