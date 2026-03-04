<script setup>
import { useUserStore } from '@/stores'
import { User, Lock } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import { ref } from 'vue'
import { useRouter } from 'vue-router'

// 建立store / router實例
const userStore = useUserStore()
const router = useRouter()
const form = ref()

// 表單數據對象
const formModel = ref({
    username: '',
    password: '',
})

// 數據規則綁定
const rules = {
    username: [
        { required: true, message: '請輸入用戶名', trigger: 'blur' },
        {
            min: 5,
            max: 10,
            message: '用戶名必須是5-10位的字符',
            trigger: 'blur',
        },
    ],
    password: [
        { required: true, message: '請輸入密碼', trigger: 'blur' },
        {
            pattern: /^\S{6,15}$/,
            message: '密碼必須是6-15位的非空字符',
            trigger: 'blur'
        }
    ],
}

// 登入 按鈕點擊 預校驗
const login = async () => {
    if (!form.value) return
    try {
        await form.value.validate()
        await userStore.login(formModel.value)
        ElMessage.success('登入成功')
        router.push('/')
    } catch {
        //攔截器處理錯誤信息
    }
}
</script>

<template>
    <el-row class="login-page">
        <el-col :span="12" class="bg"></el-col>
        <el-col :span="6" :offset="3" class="form">
            <el-form :model="formModel" :rules="rules" ref="form" size="large" autocomplete="off">
                <el-form-item>
                    <h1>登入</h1>
                </el-form-item>
                <el-form-item prop="username">
                    <el-input v-model="formModel.username" :prefix-icon="User" placeholder="請輸入用戶名"></el-input>
                </el-form-item>
                <el-form-item prop="password">
                    <el-input v-model="formModel.password" :prefix-icon="Lock" type="password"
                        placeholder="請輸入密碼"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button class="button" type="primary" @click="login">登入</el-button>
                </el-form-item>
            </el-form>
        </el-col>
    </el-row>
</template>

<style scoped>
.login-page {
    height: 100vh;
    background-color: #fff;
}

.login-page .bg {
    background:
        url('@/assets/images/logo.png') no-repeat 60% center / 240px auto,
        url('@/assets/images/login_bg.jpg') no-repeat center / cover;
    border-radius: 0 20px 20px 0;
}

.login-page .form {
    display: flex;
    flex-direction: column;
    justify-content: center;
    user-select: none;
}

.login-page .form .title {
    margin: 0 auto;
}

.login-page .form .button {
    width: 100%;
}

.login-page .form .flex {
    width: 100%;
    display: flex;
    justify-content: space-between;
}
</style>