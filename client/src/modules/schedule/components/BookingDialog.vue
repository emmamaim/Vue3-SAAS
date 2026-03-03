<script setup>
import { computed, reactive, ref, watch } from 'vue'
import { ElMessage } from 'element-plus'
// 接收父組件SchedulePage傳來的props
const props = defineProps({
  open: { type: Boolean, default: false },
  mode: { type: String, default: 'create' },
  initial: { type: Object, default: null },
  saving: { type: Boolean, default: false },
  conflictMsg: { type: String, default: '' },
  tasks: { type: Array, default: () => [] },
  allBookings: { type: Array, default: () => [] },
})
// emit通知父組件 取消 / 儲存
const emit = defineEmits(['cancel', 'submit'])

// 附加功能的旗標
const adjustedOnce = ref(false)
const endOutOfRange = ref(false)

// 表單實例
const formRef = ref(null)
// 表單資料
const form = reactive({
  title: '',
  date: '',
  startTime: '',
  endTime: '',
  durationMin: 60,
  status: 'confirmed',
  relatedTaskId: null,
})

// 附加功能1：當選擇開始時間 => 自動調整結束時間
// 附加功能2：檢測時間衝突 => 自動導航可選的時間區間
// 附加功能3：超出時間範圍 => 禁用儲存按鈕
// 時間工具函式1：把"HH:mm"轉成分鐘數
function toMinutes(hhmm) {
  if (!hhmm) return null
  const [h, m] = hhmm.split(':').map(Number)
  if (Number.isNaN(h) || Number.isNaN(m)) {
    return null
  }
  return h * 60 + m
}
// 時間工具函式2：把分鐘數轉回"HH:mm"
function toHHmm(min) {
  // 取得小時數 => 補0確保字串長度至少為 2
  const h = String(Math.floor(min / 60)).padStart(2, '0')
  // 取得分鐘數 => 補0確保字串長度至少為 2
  const m = String(min % 60).padStart(2, '0')
  return `${h}:${m}`
}
// 時間工具函式3：檢測時間是否重疊
function isOverlap(aStart, aEnd, bStart, bEnd) {
  return aStart < bEnd && aEnd > bStart
}
// 限制結束時間
const END_MAX = toMinutes('20:30')
// 時間選擇的間隔（30分鐘）
const STEP_MIN = 30
// 時間槽搜尋：找出下一個還沒有被佔用的空檔
function findNextAvailableSlot(startMin, durationMin, blocks) {
  // startMin：時間搜尋的起點
  // block：已經被預約的時間區間
  let s = startMin
  while (s + durationMin <= END_MAX) {
    // 計算目前嘗試的結束時間
    const e = s + durationMin
    const hit = blocks.some((b) => isOverlap(s, e, b.s, b.e))
    if (!hit) return { s, e }
    s += STEP_MIN
  }
  return null
}
// 監聽open=>打開彈窗，將initial填入表單
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
    // 預設1小時的時長
    form.durationMin = b?.durationMin ?? 60
    // endTime用startTime和durationMin算
    const s = toMinutes(form.startTime)
    if (s != null) {
      const e = s + form.durationMin
      endOutOfRange.value = e > END_MAX
      form.endTime = toHHmm(e)
    } else {
      endOutOfRange.value = false
      form.endTime = ''
    }
    form.status = b?.status ?? 'confirmed'
    form.relatedTaskId = b?.relatedTaskId ?? null
    adjustedOnce.value = false
    // 等畫面和表單都更新完後再清除驗證紅字
    // queueMicrotask 能更早地處理掉狀態，讓視覺效果更乾淨(與nextTick相比)
    queueMicrotask(() => formRef.value?.clearValidate?.())
  },
)
// 監聽startTime&durationMin => 自動更新endTime
watch(
  () => [form.startTime, form.durationMin],
  ([newStart]) => {
    // 沒有選擇開始時間或已經手動調整過結束時間，就不自動調整結束時間
    const s = toMinutes(newStart)
    if (s === null) {
      form.endTime = ''
      return
    }
    // 限制在可選範圍內
    const next = s + form.durationMin
    // endTime 永遠有值，不會觸發 required
    endOutOfRange.value = next > END_MAX
    form.endTime = toHHmm(next)
  },
)
// 監聽開始時間、日期、時長 => 只要有改動就重置自動調整的旗標
watch(
  () => [form.date, form.startTime, form.durationMin],
  () => {
    adjustedOnce.value = false
  },
)

// 表單驗證規則
const rules = computed(() => ({
  title: [{ required: true, message: '需要輸入標題', trigger: 'blur' }],
  date: [{ required: true, message: '需要輸入日期', trigger: 'change' }],
  startTime: [{ required: true, message: '需要輸入開始時間', trigger: 'change' }],
  endTime: [
    { required: true, message: '需要輸入結束時間', trigger: 'change' },
    // 自定義校驗器 (rule, endTime, callback)
    {
      validator: (_, value, cb) => {
        // 空值檢查：未選擇時，先讓required規則處理
        if (!form.startTime || !value) return cb()
        // 轉換失敗 => 先跳過，不在此處報錯
        const s = toMinutes(form.startTime)
        const e = toMinutes(value)
        if (s == null || e == null) return cb()
        // 核心檢查（時長）
        if (e !== s + form.durationMin)
          return cb(new Error(`結束時間會自動為開始時間後${form.durationMin}分鐘`))
        cb()
      },
      trigger: 'change',
    },
  ],
  durationMin: [{ required: true, message: '請選擇時長', trigger: 'change' }],
}))

// 通知父組件關閉彈窗
function onCancel() {
  emit('cancel')
}

// 驗證表單再送出資料給父組件
async function onSubmit() {
  //第一步：依時長用startTime推算endTime
  const sMin = toMinutes(form.startTime)
  if (sMin === null) return
  const eMin = sMin + form.durationMin
  if (eMin > END_MAX) {
    ElMessage.error('結束時間超出可選範圍，請選擇更早的開始時間或縮短時長')
    return
  }
  // 先把endTime確保同步（避免required/validator卡住）
  form.endTime = toHHmm(eMin)
  try {
    await formRef.value?.validate?.()
  } catch {
    return
  }
  // 第二步：組出同一天已預約的時間區間
  const blocks = (props.allBookings || [])
    // 過濾出同一天的行程
    .filter((b) => {
      if (!b?.date) return false
      // 切掉 ISO 尾巴，確保比對的是 "2026-03-03"
      const bDate = b.date.slice(0, 10)
      return bDate === form.date
    })
    // 過濾掉目前編輯中的行程
    .filter((b) => b?.id !== props.initial?.id)
    // 格式轉換：{ startTime: "09:00", endTime: "10:00" } => { s: 540, e: 600 }
    .map((b) => ({
      s: toMinutes(b.startTime),
      e: toMinutes(b.endTime),
    }))
    // 過濾掉轉換失敗的資料
    .filter((x) => x.s != null && x.e != null)

  // 第三部：檢測時間衝突
  const hit = blocks.some((b) => isOverlap(sMin, eMin, b.s, b.e))
  // 時間衝突：hit = true => 搜尋其他空檔
  // 時間不衝突：hit = false => 儲存提交
  if (hit) {
    // 使用者第一次撞期
    if (!adjustedOnce.value) {
      // 搜尋其他空檔
      const next = findNextAvailableSlot(sMin, form.durationMin, blocks)
      // 沒有空檔 => 提示使用者
      if (!next) {
        ElMessage.error('當日已無可選的時段，請改選其他日期')
        return
      }
      // 有空檔 => 幫使用者自動填表
      form.startTime = toHHmm(next.s)
      form.endTime = toHHmm(next.e)
      // 標記：已經調整過一次
      adjustedOnce.value = true
      // 提示調整後的時間
      ElMessage.warning(
        `偵測到時間衝突，已為您調整到 ${form.startTime}-${form.endTime}(${form.durationMin}分鐘)，請確認後再儲存`,
      )
      // 讓使用者知曉調整後的時間，先不送出
      return
    }
    // 避免第二次衝突
    ElMessage.error('仍然存在時間衝突，請手動調整時間後儲存')
    return
  }

  // 第四步：不衝突 => 提交（固定30分鐘）
  form.endTime = toHHmm(eMin)
  emit('submit', {
    title: form.title.trim(),
    date: form.date,
    startTime: form.startTime,
    endTime: form.endTime,
    durationMin: form.durationMin,
    status: form.status,
    relatedTaskId: form.relatedTaskId || null,
  })
}
</script>
<template>
  <el-dialog :model-value="open" :title="mode === 'create' ? '新增行程' : '編輯行程'" width="560px" @close="onCancel">
    <!-- 衝突訊息 -->
    <el-alert v-if="conflictMsg" :title="conflictMsg" type="error" :closable="false" show-icon
      style="margin-bottom: 12px" />
    <!-- 表單區 -->
    <el-form ref="formRef" :model="form" label-width="100px" :rules="rules" status-icon>
      <!-- 標題 -->
      <el-form-item label="標題" prop="title">
        <el-input v-model="form.title" placeholder="例如：客戶簡報" />
      </el-form-item>
      <!-- 日期 -->
      <el-form-item label="日期" prop="date">
        <el-date-picker v-model="form.date" type="date" value-format="YYYY-MM-DD" placeholder="請選擇日期"
          style="width: 100%" />
      </el-form-item>
      <!-- 開始時間 -->
      <el-form-item label="開始時間" prop="startTime">
        <el-time-select v-model="form.startTime" start="08:00" step="00:30" end="20:00" placeholder="請選擇開始時間"
          style="width: 100%" />
      </el-form-item>
      <!-- 時長（新增） -->
      <el-form-item label="時長" prop="durationMin">
        <el-select v-model="form.durationMin" style="width: 100%">
          <el-option label="30 分鐘" :value="30" />
          <el-option label="60 分鐘" :value="60" />
          <el-option label="120 分鐘" :value="120" />
        </el-select>
      </el-form-item>
      <!-- 結束時間（改成唯讀顯示） -->
      <el-form-item label="結束時間" prop="endTime">
        <el-input v-model="form.endTime" disabled placeholder="會依開始時間＋時長自動計算" />
        <div v-if="endOutOfRange" style="margin-top: 6px; font-size: 12px; color: var(--el-color-danger)">
          結束時間超出 20:30，請改選更早開始時間或縮短時長
        </div>
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
      <el-button @click="onSubmit" type="primary" :loading="saving" :disabled="endOutOfRange">儲存</el-button>
    </template>
  </el-dialog>
</template>
