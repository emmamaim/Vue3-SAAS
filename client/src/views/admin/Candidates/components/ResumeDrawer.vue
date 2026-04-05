<script setup lang="ts">
import { computed, onUnmounted, ref } from 'vue';
import { fileHost } from '@/utils/request';

// 響應式佈局
const windowWidth = ref(window.innerWidth);
const handleResize = () => {
  windowWidth.value = window.innerWidth;
};
window.addEventListener('resize', handleResize);
const isMobile = computed(() => windowWidth.value <= 480);
const isTablet = computed(() => windowWidth.value <= 1024);
const drawerSize = computed(() => {
  if (isMobile.value) return '100%';
  if (isTablet.value) return '80%';
  return '50%';
});
onUnmounted(() => {
  window.removeEventListener('resize', handleResize);
});

// props
interface Props {
  modelValue: boolean;
  url?: string | null;
}
const props = withDefaults(defineProps<Props>(), {
  modelValue: false,
  url: '',
});

// emit
const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void;
}>();

// --- 檔案處理邏輯 ---
// 拼接完整的檔案路徑
const fullUrl = computed(() => {
  if (!props.url) return '';
  // http 開頭則不拼接，否則拼接伺服器位址
  if (props.url.startsWith('http')) return props.url;
  const path = props.url.startsWith('/') ? props.url : `/${props.url}`;
  return `${fileHost}${path}`;
});

// 判斷PDF
const isPDF = computed(() => {
  return props.url?.toLowerCase().endsWith('.pdf');
});

// 處理 Word 下載
const downloadFile = () => {
  if (!fullUrl.value) return;
  const link = document.createElement('a');
  link.href = fullUrl.value;
  link.setAttribute('download', '');
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

const handleClose = () => {
  emit('update:modelValue', false);
};
</script>

<template>
  <el-drawer
    :model-value="modelValue"
    @update:model-value="handleClose"
    title="履歷預覽"
    :size="drawerSize"
    destroy-on-close
  >
    <div v-if="url" class="resume-container">
      <iframe v-if="isPDF" :src="fullUrl" width="100%" height="100%" frameborder="0"></iframe>

      <div v-else class="no-preview">
        <el-result
          icon="info"
          title="該格式不支援線上預覽"
          sub-title="Word 檔案需下載後使用 Office 軟體查看"
        >
          <template #extra>
            <el-button type="primary" @click="downloadFile">立即下載檔案</el-button>
          </template>
        </el-result>
      </div>
    </div>
    <el-empty v-else description="暫無履歷檔案" />
  </el-drawer>
</template>

<style scoped>
.resume-container {
  height: 100%;
  display: flex;
  flex-direction: column;
  /* 針對IOS優化 */
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
}

.no-preview {
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #f5f7fa;
  border-radius: 8px;
}

iframe {
  border-radius: 4px;
  border: 1px solid #dcdfe6;
}
</style>
