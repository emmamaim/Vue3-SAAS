<script setup>
import { useUserStore } from '@/stores';
import { User, Lock } from '@element-plus/icons-vue';
import { ElMessage } from 'element-plus';
import { ref } from 'vue';
import { useRouter } from 'vue-router';

// 建立store / router實例
const userStore = useUserStore();
const router = useRouter();
const form = ref();

// 表單數據對象
const formModel = ref({
  username: '',
  password: '',
});
// 數據規則綁定
const rules = {
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

// 登入 按鈕點擊 預校驗
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
    router.push('/dashboard');
  } catch (error) {
    const msg = error.response?.data?.message || '登入失敗，請檢查帳號密碼';
    ElMessage.error(msg);
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
          <img src="@/assets/images/logo.png" alt="logo" />
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
            <el-button class="login-btn" type="primary" @click="login"> 登入系統 </el-button>
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
}

:deep(.el-input__wrapper) {
  border-radius: 8px;
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
    display: block;
    text-align: center;
    margin-bottom: 24px;
  }
  .mobile-logo-box img {
    width: 180px;
    height: auto;
  }
  .form-title {
    text-align: center;
    font-size: 20px;
    margin-bottom: 24px;
    color: #606266;
  }
}
</style>
