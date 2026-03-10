<script setup>
import { useUserStore } from '@/stores';
import AdminDashboard from './components/AdminDashboard.vue';
import HRDashboard from './components/HRDashboard.vue';
import InterviewerDashboard from './components/InterviewerDashboard.vue';

const userStore = useUserStore();
const role = userStore.userInfo?.role;
</script>

<template>
    <div class="dashboard-container">
        <AdminDashboard v-if="role === 'super_admin'" />
        <HRDashboard v-else-if="role === 'hr'" />
        <InterviewerDashboard v-else-if="role === 'interviewer'" />
    </div>
</template>