<script setup>
import { Motion } from '@motionone/vue';
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const quickLogin = (user, pass) => {
  router.push({
    path: '/login',
    query: { 
      autoUser: user, 
      autoPass: pass 
    }
  });
};

const accounts = [
  {
    role: '管理員',
    user: 'adminTest1',
    pass: '123456',
    desc: '全系統最高權限，可管理團隊與系統設定。',
    color: 'border-red-500',
  },
  {
    role: 'HR 專員',
    user: 'hrTest1',
    pass: '123456',
    desc: '專注招聘流程，發布職位與管理候選人。',
    color: 'border-blue-500',
  },
  {
    role: '面試官',
    user: 'interviewerTest1',
    pass: '123456',
    desc: '查看面試排程，填寫候選人評價。',
    color: 'border-green-500',
  },
];

const copiedField = ref('');

const copyToClipboard = (text, fieldId) => {
  navigator.clipboard.writeText(text).then(() => {
    copiedField.value = fieldId;
    setTimeout(() => {
      copiedField.value = '';
    }, 2000); // 2秒後重置
  });
};
</script>

<template>
  <section id="test-accounts" class="py-32 bg-gray-950 text-white relative overflow-hidden">
    <div class="absolute inset-0 opacity-10">
      <div
        class="absolute top-0 left-0 w-full h-full bg-[url('@/assets/images/bg_img1.png')] bg-cover opacity-10 blur-sm"
      ></div>
    </div>

    <div class="mx-auto max-w-7xl px-6 relative z-10">
      <div class="text-center mb-24">
        <h2 class="text-4xl font-black tracking-tight sm:text-5xl mb-6">
          零門檻體驗，<span class="text-blue-500">立即登入</span>
        </h2>
        <p class="text-lg text-gray-400 max-w-2xl mx-auto">
          我們準備了三種不同角色的測試帳號，建議分別登入，親身體驗 TalentFlow
          嚴謹的權限管理與工作流差異。
        </p>
      </div>

      <div class="grid grid-cols-1 gap-8 md:grid-cols-3">
        <Motion
          v-for="(acc, index) in accounts"
          :key="acc.role"
          :initial="{ opacity: 0, y: 30 }"
          :in-view="{ opacity: 1, y: 0 }"
          :transition="{ delay: index * 0.15, duration: 0.6 }"
          class="relative flex flex-col rounded-3xl bg-gray-900/80 p-9 border border-white/10 shadow-2xl transition-all duration-300 hover:border-blue-500/50 hover:-translate-y-2"
        >
          <div
            :class="[
              'absolute -top-4 left-9 rounded-full px-4 py-1 text-xs font-black uppercase tracking-widest bg-gray-900 border',
              acc.color,
            ]"
          >
            {{ acc.role }}
          </div>

          <p class="text-sm text-gray-400 mt-4 mb-8 flex-1">{{ acc.desc }}</p>

          <div class="space-y-4 mb-10">
            <div v-for="field in ['user', 'pass']" :key="field" class="relative group">
              <label class="text-xs text-gray-500 font-mono uppercase tracking-widest mb-1 block">{{
                field === 'user' ? '帳號' : '密碼'
              }}</label>
              <div
                class="relative bg-black/30 rounded-xl px-5 py-3.5 font-mono text-sm border border-white/5 group-hover:border-white/20 transition-colors"
              >
                {{ acc[field] }}
                <button
                  @click="copyToClipboard(acc[field], `${acc.role}-${field}`)"
                  class="absolute right-3 top-1/2 -translate-y-1/2 flex h-8 w-8 items-center justify-center rounded-lg bg-gray-800 text-gray-400 hover:bg-blue-600 hover:text-white transition-allactive:scale-95"
                  title="複製"
                >
                  <svg
                    v-if="copiedField !== `${acc.role}-${field}`"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke-width="2"
                    stroke="currentColor"
                    class="h-4 w-4"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      d="M15.75 17.25v3.375c0 .621-.504 1.125-1.125 1.125h-9.75a1.125 1.125 0 01-1.125-1.125V7.875c0-.621.504-1.125 1.125-1.125H6.75a9.06 9.06 0 011.501-4.474.75.75 0 011.116-.102 4.5 4.5 0 011.51 3.426 7.5 7.5 0 006 1.512zm0 0h3.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-3.375m0 0V16.5m0 0a1.125 1.125 0 011.125-1.125h2.25m-3.375 0h00.008v.008H12v-.008z"
                    />
                  </svg>
                  <svg
                    v-else
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke-width="3"
                    stroke="currentColor"
                    class="h-4 w-4 text-white animate-pulse"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      d="M4.5 12.75l6 6 9-13.5"
                    />
                  </svg>
                </button>
              </div>
            </div>
          </div>

          <button
            @click="quickLogin(acc.user, acc.pass)"
            class="w-full rounded-2xl bg-blue-600 py-4 text-sm font-black text-white shadow-lg shadow-blue-600/20 hover:bg-blue-500 transition-all active:scale-95"
          >
            立即登入體驗
          </button>
        </Motion>
      </div>
    </div>
  </section>
</template>
