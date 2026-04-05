import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

// 1. 引入根組件
import App from './App.vue'
import router from './router'

// 2. 引入 UI 框架
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'

// 3. 建立應用程式實體
const app = createApp(App)

// 4. 掛載插件
app.use(createPinia())
app.use(router)
app.use(ElementPlus)

// 5. 掛載到 DOM
app.mount('#app')