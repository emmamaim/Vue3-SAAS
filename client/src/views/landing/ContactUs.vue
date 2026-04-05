<script setup lang="ts">
import { ref } from 'vue';
import { Motion } from '@motionone/vue';
import type { ContactForm } from '@/types';

const form = ref<ContactForm>({
  name: '',
  email: '',
  company: '',
  message: '',
});

const isSubmitting = ref<boolean>(false);
const submitted = ref<boolean>(false);

const handleSubmit = async (): Promise<void> => {
  isSubmitting.value = true;
  if (!form.value.name || !form.value.email) {
    alert('請填寫姓名與電子郵件');
    return;
  }
  try {
    // 模擬後端 API 請求
    await new Promise((resolve) => setTimeout(resolve, 1500));
    submitted.value = true;
  } catch (error) {
    console.error('Submission Error:', error);
  } finally {
    isSubmitting.value = false;
  }
};
</script>

<template>
  <div class="min-h-screen bg-gray-50/50 pt-32 pb-24">
    <div class="mx-auto max-w-7xl px-6">
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-16">
        <div class="lg:col-span-5">
          <Motion
            :initial="{ opacity: 0, x: -30 }"
            :animate="{ opacity: 1, x: 0 }"
            :transition="{ duration: 0.8 }"
          >
            <h1 class="text-5xl font-black tracking-tighter text-gray-900 mb-8 leading-tight">
              開始您的<br /><span class="text-blue-600">人才數位轉型</span>
            </h1>
            <p class="text-lg text-gray-500 leading-relaxed mb-12">
              無論您是想了解產品演示，還是對後端架構有技術交流的興趣，我們都期待與您對話。
            </p>

            <div class="space-y-8">
              <div class="flex items-center gap-6 group">
                <div
                  class="h-14 w-14 flex items-center justify-center rounded-2xl bg-white shadow-lg group-hover:bg-blue-600 group-hover:text-white transition-all duration-300"
                >
                  <span class="text-2xl">📧</span>
                </div>
                <div>
                  <p class="text-sm font-bold text-gray-400 uppercase tracking-widest">
                    Email Address
                  </p>
                  <p class="text-lg font-bold text-gray-900">emmamaitw@gmail.com</p>
                </div>
              </div>

              <div class="flex items-center gap-6 group">
                <div
                  class="h-14 w-14 flex items-center justify-center rounded-2xl bg-white shadow-lg group-hover:bg-blue-600 group-hover:text-white transition-all duration-300"
                >
                  <span class="text-2xl">🔗</span>
                </div>
                <div>
                  <p class="text-sm font-bold text-gray-400 uppercase tracking-widest">
                    Follow Emma
                  </p>
                  <div class="flex gap-4 mt-1">
                    <a
                      href="https://github.com/emmamaim"
                      target="_blank"
                      class="text-gray-900 font-bold hover:text-blue-600 underline decoration-blue-200 underline-offset-4"
                      >GitHub</a
                    >
                    <a
                      href="#"
                      class="text-gray-900 font-bold hover:text-blue-600 underline decoration-blue-200 underline-offset-4"
                      >LinkedIn</a
                    >
                  </div>
                </div>
              </div>
            </div>

            <div
              class="mt-16 p-8 rounded-3xl bg-blue-600 text-white shadow-2xl shadow-blue-200 relative overflow-hidden"
            >
              <div class="relative z-10">
                <p class="text-2xl font-bold mb-2">想直接看 Demo？</p>
                <p class="opacity-80">我們的後端系統已準備好為您展示高併發下的數據處理能力。</p>
              </div>
              <div class="absolute -right-8 -bottom-8 text-9xl opacity-10 rotate-12">🚀</div>
            </div>
          </Motion>
        </div>

        <div class="lg:col-span-7">
          <Motion
            :initial="{ opacity: 0, y: 40 }"
            :animate="{ opacity: 1, y: 0 }"
            :transition="{ duration: 0.8, delay: 0.2 }"
            class="bg-white rounded-[2.5rem] p-10 md:p-14 shadow-2xl shadow-gray-200/50 border border-gray-100"
          >
            <div v-if="!submitted">
              <div class="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                <div class="space-y-3">
                  <label class="text-sm font-black text-gray-900 uppercase tracking-wider ml-1"
                    >姓名</label
                  >
                  <input
                    v-model="form.name"
                    type="text"
                    placeholder="Emma Mai"
                    class="w-full rounded-2xl border-gray-100 bg-gray-50 px-6 py-4 focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all outline-hidden text-gray-900 font-medium"
                  />
                </div>
                <div class="space-y-3">
                  <label class="text-sm font-black text-gray-900 uppercase tracking-wider ml-1"
                    >電子郵件</label
                  >
                  <input
                    v-model="form.email"
                    type="email"
                    placeholder="example@talentflow.com"
                    class="w-full rounded-2xl border-gray-100 bg-gray-50 px-6 py-4 focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all outline-hidden text-gray-900 font-medium"
                  />
                </div>
              </div>

              <div class="space-y-3 mb-8">
                <label class="text-sm font-black text-gray-900 uppercase tracking-wider ml-1"
                  >所屬公司 / 組織</label
                >
                <input
                  v-model="form.company"
                  type="text"
                  placeholder="TalentFlow SaaS"
                  class="w-full rounded-2xl border-gray-100 bg-gray-50 px-6 py-4 focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all outline-hidden text-gray-900 font-medium"
                />
              </div>

              <div class="space-y-3 mb-10">
                <label class="text-sm font-black text-gray-900 uppercase tracking-wider ml-1"
                  >您的訊息</label
                >
                <textarea
                  v-model="form.message"
                  rows="5"
                  placeholder="告訴我們您的需求..."
                  class="w-full rounded-2xl border-gray-100 bg-gray-50 px-6 py-4 focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all outline-hidden text-gray-900 font-medium resize-none"
                ></textarea>
              </div>

              <button
                @click="handleSubmit"
                :disabled="isSubmitting"
                class="w-full rounded-2xl bg-gray-900 py-5 text-lg font-black text-white shadow-xl hover:bg-blue-600 transition-all hover:-translate-y-1 active:scale-95 flex items-center justify-center gap-3 disabled:opacity-50"
              >
                <span
                  v-if="isSubmitting"
                  class="h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white"
                ></span>
                {{ isSubmitting ? '正在安全傳輸中...' : '送出需求訊息' }}
              </button>

              <p
                class="mt-6 text-center text-xs text-gray-400 font-medium flex items-center justify-center gap-2"
              >
                <span class="text-green-500">🔒</span> 所有數據均通過 SSL 加密處理，確保商業隱私
              </p>
            </div>

            <div v-else class="py-20 text-center">
              <Motion
                :initial="{ scale: 0.5, opacity: 0 }"
                :animate="{ scale: 1, opacity: 1 }"
                class="mb-8 inline-block text-7xl"
                >🎉</Motion
              >
              <h3 class="text-3xl font-black text-gray-900 mb-4">訊息已成功傳達！</h3>
              <p class="text-gray-500 text-lg mb-10">Emma 會在 24 小時內親自回覆您的郵件。</p>
              <button @click="submitted = false" class="text-blue-600 font-bold hover:underline">
                再次發送訊息
              </button>
            </div>
          </Motion>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* 讓 Input 在 Focus 時有更柔和的發光感 */
input:focus,
textarea:focus {
  box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.1);
}
</style>
