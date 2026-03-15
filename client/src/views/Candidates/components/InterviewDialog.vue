<script setup>
import { ref, reactive, watch, computed } from 'vue';
import { ElMessage } from 'element-plus';
import { useBookingStore, useSystemStore } from '@/stores';
import { createInterviewService } from '@/api/interview';

const props = defineProps({
  modelValue: Boolean,
  candidate: Object,
});
const emit = defineEmits(['update:modelValue', 'refresh']);
const bookingStore = useBookingStore();
const systemStore = useSystemStore();
// 根據部門動態過濾面試官
const displayInterviewers = computed(() => {
  return systemStore.getInterviewerByDept(form.dept_id);
});
// --- 附加功能旗標 ---
const adjustedOnce = ref(false);
const endOutOfRange = ref(false);
const loading = ref(false);
// 附加功能1：當選擇開始時間 => 自動調整結束時間
// 附加功能2：檢測時間衝突 => 自動導航可選的時間區間
// 附加功能3：超出時間範圍 => 禁用儲存按鈕
// 時間工具函式1：把"HH:mm"轉成分鐘數
function toMinutes(hhmm) {
  if (!hhmm) return null;
  const [h, m] = hhmm.split(':').map(Number);
  if (Number.isNaN(h) || Number.isNaN(m)) {
    return null;
  }
  return h * 60 + m;
}
// 時間工具函式2：把分鐘數轉回"HH:mm"
function toHHmm(min) {
  // 取得小時數 => 補0確保字串長度至少為 2
  const h = String(Math.floor(min / 60)).padStart(2, '0');
  // 取得分鐘數 => 補0確保字串長度至少為 2
  const m = String(min % 60).padStart(2, '0');
  return `${h}:${m}`;
}
// 時間工具函式3：檢測時間是否重疊
function isOverlap(aStart, aEnd, bStart, bEnd) {
  return aStart < bEnd && aEnd > bStart;
}
// 限制結束時間
const END_MAX = toMinutes('20:30');
// 時間選擇的間隔（30分鐘）
const STEP_MIN = 30;
// 時間槽搜尋：找出下一個還沒有被佔用的空檔
function findNextAvailableSlot(startMin, durationMin, blocks) {
  // startMin：時間搜尋的起點
  // block：已經被預約的時間區間
  let s = startMin;
  while (s + durationMin <= END_MAX) {
    // 計算目前嘗試的結束時間
    const e = s + durationMin;
    const hit = blocks.some((b) => isOverlap(s, e, b.s, b.e));
    if (!hit) return { s, e };
    s += STEP_MIN;
  }
  return null;
}
// 表單資料
const formRef = ref(null);
const form = reactive({
  candidate_id: '',
  interviewer_id: '',
  dept_id: '',
  interview_round: 1,
  date: new Date().toISOString().slice(0, 10),
  startTime: '10:00',
  endTime: '11:00',
  durationMin: 60,
  location: '線上會議室',
  title: '',
});
// 表單驗證
const rules = {
  interviewer_id: [{ required: true, message: '請選擇面試官', trigger: 'change' }],
  date: [{ required: true, message: '請選擇日期', trigger: 'change' }],
  startTime: [{ required: true, message: '請選擇開始時間', trigger: 'change' }],
  durationMin: [{ required: true, message: '請選擇面試時長', trigger: 'change' }],
};
// 監聽1: modelValue => 初始化彈窗
watch(
  () => props.modelValue,
  (v) => {
    if (!v) return;
    systemStore.fetchAllOptions();
    if (props.candidate) {
      form.candidate_id = props.candidate.id;
      form.dept_id = props.candidate.dept_id;
      form.title = `面試：${props.candidate.name} - 第 ${form.interview_round} 輪`;
    }
    adjustedOnce.value = false;
    // 重置驗證狀態
    queueMicrotask(() => formRef.value?.clearValidate?.());
  },
);
// 監聽2: interviewer_id/form.date => 同步面試官行程資料
watch(
  () => [form.interviewer_id, form.date],
  ([newInterviewer, newDate]) => {
    if (newInterviewer && newDate) {
      // HR查看特定面試官的行程
      bookingStore.fetchAll({ userId: newInterviewer });
    }
  },
);
// 監聽3: startTime/furationMin => 自動調整endTime
watch(
  () => [form.startTime, form.durationMin],
  ([newStart, newDuration]) => {
    const s = toMinutes(newStart);
    if (s !== null) {
      const next = s + newDuration;
      endOutOfRange.value = next > END_MAX;
      form.endTime = toHHmm(next);
    }
  },
);
// 監聽4: date/interviewer_id/startTime => 重置自動導航旗標
watch(
  () => [form.date, form.interviewer_id, form.startTime],
  () => {
    adjustedOnce.value = false;
  },
);
// 關閉彈窗
const handleClose = () => emit('update:modelValue', false);
// 提交（建立面試 => 檢測衝突 => 自動導航調整=> 執行三表聯動）
async function onSubmit() {
  // 防止重複提交
  if (loading.value) return;
  // 1. 基本驗證
  if (!form.interviewer_id) return ElMessage.warning('請選擇面試官');
  const sMin = toMinutes(form.startTime);
  const eMin = sMin + form.durationMin;
  if (eMin > END_MAX) {
    return ElMessage.error('結束時間超出範圍 (20:30)，請縮短時長或提前開始');
  }
  try {
    await formRef.value.validate();
  } catch {
    return;
  }
  // 2. 取得面試官當天行程
  const blocks = bookingStore.items
    .filter((b) => b.date?.slice(0, 10) === form.date)
    .map((b) => ({
      s: toMinutes(b.startTime),
      e: toMinutes(b.endTime),
    }));
  // 3. 檢測時間衝突
  const hasConflict = blocks.some((b) => isOverlap(sMin, eMin, b.s, b.e));
  if (hasConflict) {
    if (!adjustedOnce.value) {
      // 第一次衝突 => 自動搜尋下一個可用空檔
      const next = findNextAvailableSlot(sMin, form.durationMin, blocks);
      if (!next) {
        ElMessage.error('該面試官今日已無足夠空檔，請改選日期');
        return;
      }
      form.startTime = toHHmm(next.s);
      form.endTime = toHHmm(next.e);
      adjustedOnce.value = true;
      ElMessage.warning(
        `時段衝突！已為您自動導航至下一個可用空檔: ${form.startTime}-${form.endTime}`,
      );
      //中斷 => 管理員/HR確認一次
      return;
    }
    return ElMessage.error('仍與現有行程衝突，請手動調整');
  }
  // 4. 執行三表聯動
  loading.value = true;
  try {
    await createInterviewService(form);
    ElMessage.success('面試安排成功！已同步至該面試官的行事曆與任務清單');
    emit('refresh');
    handleClose();
  } catch (e) {
    if (e.response && e.response.status === 409) {
      ElMessage.error('預約失敗：該時段已被佔用（後端衝突檢查），請重新同步行程。');
      bookingStore.fetchAll({ userId: form.interviewer_id });
    }
  } finally {
    loading.value = false;
  }
}
</script>

<template>
  <el-dialog
    :model-value="modelValue"
    title="安排面試"
    width="560px"
    @close="handleClose"
    top="10vh"
  >
    <el-form ref="formRef" :model="form" :rules="rules" label-width="100px" status-icon>
      <el-form-item label="應徵者">
        <el-input :model-value="candidate?.name" disabled />
      </el-form-item>

      <el-form-item label="面試官" prop="interviewer_id">
        <el-select
          v-model="form.interviewer_id"
          placeholder="請選擇面試官"
          style="width: 100%"
          filterable
        >
          <el-option
            v-for="item in displayInterviewers"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          >
            <span style="float: left">{{ item.label }}</span>
            <span style="float: right; color: #8492a6; font-size: 13px">
              {{ systemStore.departments.find((d) => d.id === item.dept_id)?.name }}
            </span>
          </el-option>
        </el-select>

        <div v-if="form.dept_id" style="font-size: 12px; color: #909399; line-height: 1">
          已自動篩選「{{
            systemStore.departments.find((d) => d.id === form.dept_id)?.name
          }}」的面試官
          <el-button type="primary" link @click="form.dept_id = ''" size="small"
            >顯示全公司</el-button
          >
        </div>
      </el-form-item>

      <el-form-item label="面試日期" prop="date">
        <el-date-picker
          v-model="form.date"
          type="date"
          value-format="YYYY-MM-DD"
          style="width: 100%"
        />
      </el-form-item>

      <el-form-item label="開始時間" prop="startTime">
        <el-time-select
          v-model="form.startTime"
          start="08:00"
          step="00:30"
          end="20:00"
          style="width: 100%"
        />
      </el-form-item>

      <el-form-item label="面試時長" prop="durationMin">
        <el-select v-model="form.durationMin" style="width: 100%">
          <el-option label="30 分鐘" :value="30" />
          <el-option label="60 分鐘" :value="60" />
          <el-option label="90 分鐘" :value="90" />
          <el-option label="120 分鐘" :value="120" />
        </el-select>
      </el-form-item>

      <el-form-item label="結束時間">
        <el-input v-model="form.endTime" disabled />
        <el-text v-if="endOutOfRange" type="danger" size="small">
          結束時間超出 20:30 可選範圍
        </el-text>
      </el-form-item>

      <el-form-item label="地點/連結">
        <el-input v-model="form.location" placeholder="例如：線上 Google Meet" />
      </el-form-item>
    </el-form>

    <template #footer>
      <el-button @click="handleClose">取消</el-button>
      <el-button type="primary" :loading="loading" :disabled="endOutOfRange" @click="onSubmit">
        確認安排
      </el-button>
    </template>
  </el-dialog>
</template>

<style scoped>
.scheduler-container {
  display: grid;
  grid-template-columns: 1fr 280px;
  gap: 30px;
}

.time-picker-wrap {
  display: flex;
  align-items: center;
  gap: 10px;
}

.range-separator {
  color: #909399;
}

.preview-section {
  background: #f8f9fa;
  border-radius: 8px;
  padding: 15px;
  display: flex;
  flex-direction: column;
}

.preview-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 15px;
  border-bottom: 1px solid #dee2e6;
  padding-bottom: 5px;
}

.busy-list {
  flex: 1;
  overflow-y: auto;
}

.busy-item {
  background: #fff;
  border-left: 4px solid #909399;
  padding: 8px;
  margin-bottom: 8px;
  border-radius: 4px;
  font-size: 12px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.busy-item.is-interview {
  border-left-color: #409eff;
  background: #ecf5ff;
}

.time-tag {
  display: block;
  font-weight: bold;
  color: #303133;
}

.title-tag {
  color: #606266;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  display: block;
}

.empty-preview {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #909399;
  font-style: italic;
}

.conflict-hint {
  display: block;
  margin-top: 5px;
}

.tips {
  margin-top: 20px;
  font-size: 11px;
  color: #e6a23c;
  line-height: 1.4;
}
</style>
