<script setup lang="ts">
import { computed } from 'vue';
import { useUserStore } from '@/stores';
import AdminDashboard from './components/AdminDashboard.vue';
import HRDashboard from './components/HRDashboard.vue';
import InterviewerDashboard from './components/InterviewerDashboard.vue';

// role 分流
const userStore = useUserStore();
const role = computed<string | undefined>(() => userStore.userInfo?.role);

const isAdmin = computed(() => role.value === 'super_admin');
const isHR = computed(() => role.value === 'dept_hr');
const isInterviewer = computed(() => role.value === 'interviewer');
</script>

<template>
  <div class="dashboard-container">
    <AdminDashboard v-if="isAdmin" />
    <HRDashboard v-else-if="isHR" />
    <InterviewerDashboard v-else-if="isInterviewer" />
  </div>
</template>
