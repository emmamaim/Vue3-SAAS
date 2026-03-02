<script setup>
import { computed, ref, reactive, watch } from 'vue'
// 接收父組件TasksPage傳來的props
const props = defineProps({
  open: { type: Boolean, default: false },
  mode: { type: String, default: 'create' },
  initial: { type: Object, default: null },
  saving: { type: Boolean, default: false },
})
// emit通知父組件 取消 / 儲存
const emit = defineEmits(['cancel', 'submit'])

// 表單實例
const formRef = ref(null)
// 表單資料
const form = reactive({
  title: '',
  status: 'todo',
  priority: 'medium',
  dueDate: '',
  description: '',
})
// 表單驗證規則
const rules = computed(() => ({
  title: [{ required: true, message: '需要輸入標題', trigger: 'blur' }],
}))
// 監聽open=>打開彈窗，將initial填入表單
watch(
  () => props.open,
  (v) => {
    if (!v) return
    const t = props.initial
    form.title = t?.title ?? ''
    form.status = t?.status ?? 'todo'
    form.priority = t?.priority ?? 'medium'
    form.dueDate = t?.dueDate ? String(t.dueDate).slice(0, 10) : ''
    form.description = t?.description ?? ''
    // 等畫面和表單都更新完後再清除驗證紅字
    queueMicrotask(() => formRef.value?.clearValidate?.())
  },
)

// 關閉視窗點擊取消或'x'
function onCancel() {
  emit('cancel')
}

async function onSubmit() {
  await formRef.value?.validate?.()
  emit('submit', {
    title: form.title.trim(),
    status: form.status,
    priority: form.priority,
    dueDate: form.dueDate ? new Date(form.dueDate).toISOString() : null,
    description: form.description,
  })
}
</script>
<template>
  <el-dialog
    :model-value="open"
    :title="mode === 'create' ? '新增任務' : '編輯任務'"
    width="520px"
    @close="onCancel"
  >
    <!-- 表單區 -->
    <el-form ref="formRef" :model="form" :rules="rules" label-width="90px" status-icon>
      <!-- 任務標題 -->
      <el-form-item label="標題" prop="title">
        <el-input v-model="form.title" placeholder="例如：設計圖片" />
      </el-form-item>
      <!-- 任務狀態選擇 -->
      <el-form-item label="狀態" prop="status">
        <el-select v-model="form.status" style="width: 100%">
          <el-option label="待辦" value="todo" />
          <el-option label="進行中" value="doing" />
          <el-option label="已完成" value="done" />
        </el-select>
      </el-form-item>
      <!-- 任務優先順序選擇 -->
      <el-form-item label="優先順序" prop="priority">
        <el-select v-model="form.priority" style="width: 100%">
          <el-option label="低" value="low" />
          <el-option label="中" value="medium" />
          <el-option label="高" value="high" />
        </el-select>
      </el-form-item>
      <!-- 任務到日期 -->
      <el-form-item label="到期日" prop="dueDate">
        <el-date-picker
          v-model="form.dueDate"
          type="date"
          value-format="YYYY-MM-DD"
          style="width: 100%"
          placeholder="請選擇日期"
        />
      </el-form-item>
      <!-- 任務說明 -->
      <el-form-item label="說明" prop="description">
        <el-input v-model="form.description" type="textarea" :rows="3" placeholder="選填" />
      </el-form-item>
    </el-form>
    <!-- 底部按鈕區：取消 或 儲存按鈕 -->
    <template #footer>
      <el-button @click="onCancel">取消</el-button>
      <el-button type="primary" :loading="saving" @click="onSubmit">儲存</el-button>
    </template>
  </el-dialog>
</template>
