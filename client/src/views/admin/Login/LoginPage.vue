<script setup lang="ts">
import { useUserStore } from '@/stores';
import { User, Lock } from '@element-plus/icons-vue';
import { ElMessage, type FormInstance, type FormRules } from 'element-plus';
import { ref, onMounted, onUnmounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';

const userStore = useUserStore();
const router = useRouter();
const route = useRoute();
const form = ref<FormInstance>();

const formModel = ref({
  username: '',
  password: '',
});

// 登入按鈕呼吸動畫
const isButtonBreathing = ref(false);
// ✨ 新增：用來儲存定時器，以便銷毀
let typingTimer: number | null = null;

// 打字效果
const typeEffect = (targetKey: 'username' | 'password', fullText: string, delay = 100) => {
  return new Promise<void>((resolve) => {
    let i = 0;
    formModel.value[targetKey] = '';
    typingTimer = window.setInterval(() => {
      formModel.value[targetKey] += fullText[i];
      i++;
      if (i >= fullText.length) {
        if (typingTimer) clearInterval(typingTimer);
        resolve();
      }
    }, delay);
  });
};

onMounted(async () => {
  const autoUser = route.query.autoUser as string;
  const autoPass = route.query.autoPass as string;
  if (autoUser && autoPass) {
    ElMessage.info('正在為您準備測試環境...');

    // 執行打字效果
    await typeEffect('username', autoUser, 70);
    await new Promise((r) => setTimeout(r, 300));
    await typeEffect('password', autoPass, 70);

    // 打字完成，激活按鈕呼吸特效
    isButtonBreathing.value = true;
    ElMessage.success('準備就緒，請登入');
  }
});

onUnmounted(() => {
  if (typingTimer) clearInterval(typingTimer);
});

const rules: FormRules = {
  username: [
    { required: true, message: '請輸入用戶名', trigger: 'blur' },
    {
      min: 3,
      max: 20,
      message: '用戶名必須是3-20位的字符',
      trigger: 'blur',
    },
  ],
  password: [
    { required: true, message: '請輸入密碼', trigger: 'blur' },
    {
      pattern: /^\S{6,15}$/,
      message: '密碼必須是6-15位的非空字符',
      trigger: 'blur',
    },
  ],
};

// 登入
const login = async () => {
  if (!form.value) return;
  try {
    await form.value.validate();
  } catch {
    return;
  }
  try {
    await userStore.login(formModel.value);
    ElMessage.success('登入成功');
    setTimeout(() => {
      router.push('/admin/dashboard');
    }, 200);
  } catch (error: unknown) {
    if (error instanceof Error) {
      ElMessage.error(error.message);
    } else if (typeof error === 'string') {
      ElMessage.error(error);
    } else {
      ElMessage.error('發生未知錯誤，請稍後再試');
    }
    console.error('詳細錯誤資訊:', error);
  }
};
</script>

<template>
  <div class="login-wrapper">
    <div class="side-bg">
      <div class="overlay"></div>
      <div class="bg-content">
        <img src="@/assets/images/logo.png" alt="logo" class="bg-logo" />
        <p class="bg-text">專業的人才管理系統</p>
      </div>
    </div>

    <div class="form-section">
      <div class="login-card">
        <div class="mobile-logo-box">
          <img src="@/assets/images/logo_login.png" alt="logo" />
        </div>

        <h2 class="form-title">歡迎登入</h2>

        <el-form :model="formModel" :rules="rules" ref="form" size="large" autocomplete="off">
          <el-form-item prop="username">
            <el-input v-model="formModel.username" :prefix-icon="User" placeholder="請輸入用戶名" />
          </el-form-item>
          <el-form-item prop="password">
            <el-input
              v-model="formModel.password"
              :prefix-icon="Lock"
              type="password"
              show-password
              placeholder="請輸入密碼"
            />
          </el-form-item>
          <el-form-item>
            <el-button
              class="login-btn"
              :class="{ 'btn-breath': isButtonBreathing }"
              type="primary"
              @click="login"
            >
              登入系統
            </el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
  </div>
</template>

<style scoped>
.login-wrapper {
  height: 100vh;
  display: flex;
  background-color: #f0f2f5;
}

.side-bg {
  flex: 1.2;
  position: relative;
  background: url('@/assets/images/login_bg.jpg') no-repeat center / cover;
  display: flex;
  align-items: center;
  justify-content: center;
}

.overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(135deg, rgba(64, 158, 255, 0.2) 0%, rgba(0, 0, 0, 0.4) 100%);
}

.bg-content {
  position: relative;
  z-index: 1;
  text-align: center;
}

.bg-logo {
  width: 280px;
}

.bg-text {
  color: #fff;
  font-size: 1.4rem;
  margin-top: 16px;
  letter-spacing: 4px;
  font-weight: 300;
  opacity: 0.9;
}

/* --- 表單區 --- */
.form-section {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #fff;
}

.login-card {
  width: 100%;
  max-width: 380px;
  padding: 40px;
}

.form-title {
  font-size: 24px;
  font-weight: 500;
  color: #303133;
  margin-bottom: 32px;
  letter-spacing: 1px;
}

.mobile-logo-box {
  display: none;
}

.login-btn {
  width: 100%;
  height: 50px;
  font-size: 16px;
  border-radius: 8px;
  margin-top: 12px;
  transition: all 0.3s ease;
}

:deep(.el-input__wrapper) {
  border-radius: 8px;
}

/* 登入按鈕呼吸動畫 */
@keyframes breath-animation {
  0% {
    box-shadow: 0 0 0 0 rgba(64, 158, 255, 0.6);
    transform: scale(1);
  }
  50% {
    box-shadow: 0 0 15px 4px rgba(64, 158, 255, 0.4);
    transform: scale(1.02);
  }
  100% {
    box-shadow: 0 0 0 0 rgba(64, 158, 255, 0);
    transform: scale(1);
  }
}
.btn-breath {
  animation: breath-animation 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
  border-color: #a0cfff !important;
}

/* 手機端優化 */
@media (max-width: 767px) {
  .side-bg {
    position: absolute;
    inset: 0;
  }
  .bg-content {
    display: none;
  }
  .form-section {
    background: transparent;
    width: 100%;
    z-index: 10;
    padding: 20px;
  }
  .login-card {
    background: rgba(255, 255, 255, 0.9);
    backdrop-filter: blur(10px);
    border-radius: 24px;
    padding: 48px 32px;
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
  }
  .mobile-logo-box {
    display: flex;
    justify-content: center;
    text-align: center;
  }
  .mobile-logo-box img {
    width: 110px;
    height: auto;
    margin-bottom: 20px;
  }
  .form-title {
    text-align: center;
    font-size: 20px;
    margin-bottom: 24px;
    color: #606266;
  }
}
</style>
