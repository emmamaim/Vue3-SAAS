import { fileURLToPath, URL } from 'node:url';
import { defineConfig, loadEnv } from 'vite';
import vue from '@vitejs/plugin-vue';
import vueDevTools from 'vite-plugin-vue-devtools';
import process from 'node:process';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd());
  console.log('當前模式:', mode);
  console.log('代理目標:', env.VITE_API_TARGET);
  
  return {
    plugins: [vue(), vueDevTools()],
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url)),
      },
    },
    server: {
      proxy: {
        [env.VITE_API_BASE_URL]: {
          target: env.VITE_API_TARGET,
          changeOrigin: true,
          cookieDomainRewrite: 'localhost',
        },
      },
    },
  };
});
