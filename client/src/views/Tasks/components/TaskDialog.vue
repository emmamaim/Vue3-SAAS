<script setup>
import { computed, ref, reactive, watch, onUnmounted } from 'vue'

// 動態計算彈窗寬度
const windowWidth = ref(window.innerWidth);
const handleResize = () => {
  windowWidth.value = window.innerWidth;
};
window.addEventListener('resize', handleResize);
const isMobile = computed(() => windowWidth.value <= 480);
const isTablet = computed(() => windowWidth.value <= 1024);
const dialogSize = computed(() => {
  if (isMobile.value) return '90%';
  if (isTablet.value) return '60%';
  return '35%';
});
onUnmounted(() => {
  window.removeEventListener('resize', handleResize);
});

const props = defineProps({
  open: { type: Boolean, default: false },
  initial: { type: Object, default: null },
  saving: { type: Boolean, default: false },
})
const emit = defineEmits(['cancel', 'submit'])

// 表單
const formRef = ref(null)
const form = reactive({
  result: 'pending',
  comments: '',
})
// 表單驗證規則
const rules = computed(() => ({
  result: [{ required: true, message: '請選擇面試結果', trigger: 'change' }],
  comments: [{ required: true, message: '請輸入面試評價內容', trigger: 'blur' }],
}))
// 監聽 open => 重置表單
watch(
  () => props.open,
  (isOpen) => {
    if (isOpen) {
      if (props.initial?.result) {
        form.result = props.initial.result || 'pending'
        form.comments = props.initial.comments || ''
      } else {
        form.result = 'pending',
          form.comments = ''
      }
      // 清除驗證紅字
      queueMicrotask(() => formRef.value?.clearValidate?.())
    }
  },
)

// 關閉視窗
function onCancel() {
  emit('cancel')
}

// 提交
async function onSubmit() {
  const valid = await formRef.value?.validate?.().catch(() => false)
  if (!valid) return
  emit('submit', {
    result: form.result,
    comments: form.comments.trim(),
  })
}
</script>

<template>
  <el-dialog :model-value="open" title="提交面試評價" :width="dialogSize" @close="onCancel" :close-on-click-modal="false"
    append-to-body>
    <div v-if="initial" class="task-info">
      <div class="info-item">
        <span class="label">面試主題：</span>
        <span class="value">{{ initial.title }}</span>
      </div>
      <div class="info-item">
        <span class="label">當前狀態：</span>
        <el-tag size="small" type="warning">待評價</el-tag>
      </div>
    </div>

    <el-divider />

    <el-form ref="formRef" :model="form" :rules="rules" label-position="top">
      <el-form-item label="面試結果" prop="result">
        <el-radio-group v-model="form.result" size="large">
          <el-radio-button value="pass">通過</el-radio-button>
          <el-radio-button value="pending">考慮</el-radio-button>
          <el-radio-button value="fail">淘汰</el-radio-button>
        </el-radio-group>
      </el-form-item>

      <el-form-item label="詳細評價" prop="comments">
        <el-input v-model="form.comments" type="textarea" :rows="5" placeholder="請輸入技術能力評估、軟實力觀察等評價內容..."
          maxlength="500" show-word-limit />
      </el-form-item>
    </el-form>

    <template #footer>
      <el-button @click="onCancel">取消</el-button>
      <el-button type="primary" :loading="saving" @click="onSubmit">
        確認提交
      </el-button>
    </template>
  </el-dialog>
</template>

<style scoped>
.task-info {
  background-color: #f8f9fa;
  padding: 12px;
  border-radius: 4px;
  font-size: 14px;
}

.info-item {
  margin-bottom: 8px;
}

.info-item:last-child {
  margin-bottom: 0;
}

.label {
  color: #606266;
  font-weight: bold;
}

.value {
  color: #303133;
}

:deep(.el-radio-group) {
  display: flex;
  width: 100%;
}

:deep(.el-radio-button) {
  flex: 1;
}

:deep(.el-radio-button__inner) {
  width: 100%;
}
</style>
