<script setup>
import { computed, reactive, ref, watch } from 'vue'
// 接收父組件schedulePage傳來的props
const props = defineProps({
  open: { type: Boolean, default: false },
  mode: { type: String, default: 'create' },
  initial: { type: Object, default: null },
  saving: { type: Boolean, default: false },
  conflictMsg: { type: String, default: '' },
  tasks: { type: Array, default: () => [] },
})
// emit通知父組件 取消 / 儲存
const emit = defineEmits(['cancel', 'submit'])

// 加一個使用者是否手動調整結束時間的標識
const endTouched = ref(false)
// 防止程式自動改endTime把endTouched標記為true，導致無法自動調整endTime
const autoSettingEnd = ref(false)

// 表單實例
const formRef = ref(null)
// 表單資料
const form = reactive({
  title: '',
  date: '',
  startTime: '',
  endTime: '',
  status: 'confirmed',
  relatedTaskId: null,
})
// 表單驗證規則
const rules = computed(() => ({
  title: [{ required: true, message: '需要輸入標題', trigger: 'blur' }],
  date: [{ required: true, message: '需要輸入日期', trigger: 'change' }],
  startTime: [{ required: true, message: '需要輸入開始時間', trigger: 'change' }],
  endTime: [
    { required: true, message: '需要輸入結束時間', trigger: 'change' },
    // 自定義校驗器 (Validator)
    {
      validator: (_, value, cb) => {
        if (!form.startTime || !value) return cb()
        if (value <= form.startTime) return cb(new Error('結束時間必須晚於開始時間'))
        cb()
      },
      trigger: 'change',
    },
  ],
}))

// watch(open)=>打開彈窗，將initial填入表單
watch(
  // 監聽目標(open)
  () => props.open,
  // v是open的新值
  (v) => {
    if (!v) return
    const b = props.initial
    form.title = b?.title ?? ''
    form.date = b?.date ?? new Date().toISOString().slice(0, 10)
    form.startTime = b?.startTime ?? '10:00'
    form.endTime = b?.endTime ?? '11:00'
    form.status = b?.status ?? 'confirmed'
    form.relatedTaskId = b?.relatedTaskId ?? null
    endTouched.value = false
    // 等畫面和表單都更新完後再清除驗證紅字
    // queueMicrotask 能更早地處理掉狀態，讓視覺效果更乾淨(與nextTick相比)
    queueMicrotask(() => formRef.value?.clearValidate?.())
  },
)

// 通知父組件關閉彈窗
function onCancel() {
  emit('cancel')
}

// 驗證表單再送出資料給父組件
async function onSubmit() {
  try {
    await formRef.value?.validate?.()
  } catch {
    return
  }
  emit('submit', {
    title: form.title.trim(),
    date: form.date,
    startTime: form.startTime,
    endTime: form.endTime,
    status: form.status,
    relatedTaskId: form.relatedTaskId || null,
  })
}

// 附加功能：當選擇開始時間 => 自動調整結束時間
function toMinutes(hhmm) {
  if (!hhmm) return null
  const [h, m] = hhmm.split(':').map(Number)
  if (Number.isNaN(h) || Number.isNaN(m)) {
    return null
  }
  return h * 60 + m
}
function toHHmm(min) {
  // 取得小時數 => 補0確保字串長度至少為 2
  const h = String(Math.floor(min / 60)).padStart(2, '0')
  // 取得分鐘數 => 補0確保字串長度至少為 2
  const m = String(min % 60).padStart(2, '0')
  return `${h}:${m}`
}
// 限制結束時間
const END_MIN = toMinutes('8:30')
const END_MAX = toMinutes('20:30')
// 監聽endTime => 改動endTime就標記為true
watch(
  () => form.endTime,
  () => {
    if (autoSettingEnd.value) return
    endTouched.value = true
  },
)
// 監聽startTime => 自動把endTime + 60分鐘
watch(
  () => form.startTime,
  (newStart) => {
    // 沒有選擇開始時間或已經手動調整過結束時間，就不自動調整結束時間
    const s = toMinutes(newStart)
    if (s === null) return
    if (endTouched.value) return
    let next = s + 60
    // 限制在可選範圍內
    if (next < END_MIN) next = END_MIN
    if (next > END_MAX) next = END_MAX
    autoSettingEnd.value = true
    form.endTime = toHHmm(next)
    // 把旗标在本轮更新后再关掉，避免在同一轮更新中被误判为用户调整结束时间
    queueMicrotask(() => (autoSettingEnd.value = false))
  },
)
</script>
<template>
  <el-dialog
    :model-value="open"
    :title="mode === 'create' ? '新增行程' : '編輯行程'"
    width="560px"
    @close="onCancel"
  >
    <!-- 衝突訊息 -->
    <el-alert
      :title="conflictMsg"
      type="error"
      v-if="conflictMsg"
      :closable="false"
      show-icon
      style="margin-bottom: 12px"
    />
    <!-- 表單區 -->
    <el-form ref="formRef" :model="form" label-width="100px" :rules="rules" status-icon>
      <!-- 標題 -->
      <el-form-item label="標題" prop="title">
        <el-input v-model="form.title" placeholder="例如：客戶簡報" />
      </el-form-item>
      <!-- 日期 -->
      <el-form-item label="日期" prop="date">
        <el-date-picker
          v-model="form.date"
          type="date"
          value-format="YYYY-MM-DD"
          placeholder="請選擇日期"
          style="width: 100%"
        />
      </el-form-item>
      <!-- 開始時間 -->
      <el-form-item label="開始時間" prop="startTime">
        <el-time-select
          v-model="form.startTime"
          start="08:00"
          step="00:30"
          end="20:00"
          placeholder="請選擇開始時間"
          style="width: 100%"
        />
      </el-form-item>
      <!-- 結束時間 -->
      <el-form-item label="結束時間" prop="endTime">
        <el-time-select
          v-model="form.endTime"
          start="08:30"
          step="00:30"
          end="20:30"
          placeholder="請選擇結束時間"
          style="width: 100%"
        />
      </el-form-item>
      <!-- 狀態 -->
      <el-form-item label="狀態" prop="status">
        <el-select v-model="form.status" style="width: 100%">
          <el-option label="已確認" value="confirmed" />
          <el-option label="待確認" value="pending" />
          <el-option label="已取消" value="canceled" />
        </el-select>
      </el-form-item>
      <!-- 關聯任務 -->
      <el-form-item label="關聯任務" prop="relatedTaskId">
        <el-select v-model="form.relatedTaskId" clearable filterable style="width: 100%">
          <el-option v-for="t in tasks" :key="t.id" :label="t.title" :value="t.id" />
        </el-select>
      </el-form-item>
    </el-form>
    <!-- footer區：取消 / 儲存按鈕 -->
    <template #footer>
      <el-button @click="onCancel">取消</el-button>
      <el-button @click="onSubmit" type="primary" :loading="saving">儲存</el-button>
    </template>
  </el-dialog>
</template>
