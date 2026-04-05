<script setup lang="ts">
import { reactive, ref, watch, computed, onUnmounted } from 'vue';
import { ElMessage, type FormInstance, type FormRules } from 'element-plus';
import { toMinutes, toHHmm, isOverlap, findNextAvailableSlot, END_MAX_STR } from '@/utils/time';
import type { Booking, CreateBookingPayload, UpdateBookingPayload } from '@/types';

// 響應式佈局
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

// props
interface Props {
  open: boolean;
  mode?: 'create' | 'edit';
  initial?: Partial<Booking> | null;
  saving?: boolean;
  conflictMsg?: string;
  allBookings?: Booking[];
}
const props = withDefaults(defineProps<Props>(), {
  open: false,
  mode: 'create',
  initial: null,
  saving: false,
  conflictMsg: '',
  allBookings: () => [],
});

// emit
const emit = defineEmits<{
  (e: 'cancel'): void;
  (e: 'submit', payload: CreateBookingPayload | UpdateBookingPayload): void;
}>();

// --- 狀態控制 ---
const adjustedOnce = ref<boolean>(false);
const endOutOfRange = ref<boolean>(false);
const formRef = ref<FormInstance>();

// 【核心判斷】是否為面試關聯行程 (不可編輯)
const isLocked = computed(() => !!form.relatedTaskId);

// 表單資料型別
interface BookingForm extends Partial<Booking> {
  durationMin: number;
}

// 表單資料
const form = reactive<BookingForm>({
  id: undefined,
  title: '',
  date: '',
  startTime: '',
  endTime: '',
  durationMin: 60,
  status: 'confirmed',
  relatedTaskId: null,
  user_id: undefined,
});

// 監聽彈窗打開：初始化資料
watch(
  () => props.open,
  (v) => {
    if (!v) return;
    const b = props.initial;
    form.id = b?.id;
    form.title = b?.title ?? '';
    form.date = b?.date ?? new Date().toISOString().slice(0, 10);
    form.startTime = b?.startTime ?? '10:00';
    form.durationMin = 60;
    form.status = b?.status ?? 'confirmed';
    form.relatedTaskId = b?.relatedTaskId ?? null;
    form.user_id = b?.user_id;

    calculateEndTime();
    adjustedOnce.value = false;
    queueMicrotask(() => formRef.value?.clearValidate?.());
  },
);

// 自動計算結束時間
const calculateEndTime = () => {
  if (!form.startTime) return;
  const s = toMinutes(form.startTime);
  if (s !== null) {
    const next = s + form.durationMin;
    endOutOfRange.value = next > toMinutes(END_MAX_STR)!;
    form.endTime = toHHmm(next);
  }
};

// 監聽：計算結束時間，重置調整旗標
watch(() => [form.startTime, form.durationMin], calculateEndTime);
watch(
  () => [form.date, form.startTime],
  () => {
    adjustedOnce.value = false;
  },
);

// 驗證規則
const rules: FormRules = {
  title: [{ required: true, message: '請輸入標題', trigger: 'blur' }],
  date: [{ required: true, message: '請選擇日期', trigger: 'change' }],
  startTime: [{ required: true, message: '請選擇開始時間', trigger: 'change' }],
};

// 提交處理
async function onSubmit() {
  if (props.saving || isLocked.value) return;
  // 表單驗證
  try {
    await formRef.value?.validate();
  } catch {
    return;
  }
  const sMin = toMinutes(form.startTime!);
  if (sMin === null) return;
  const eMin = sMin + form.durationMin;
  // 時間範圍檢查
  if (eMin > toMinutes(END_MAX_STR)!) {
    return ElMessage.error(`結束時間不可超過 ${END_MAX_STR}`);
  }
  // 時間衝突檢查 (排除當前編輯的 ID)
  const blocks = (props.allBookings || [])
    .filter((b) => b.date?.slice(0, 10) === form.date && b.id !== form.id)
    .map((b) => ({
      s: toMinutes(b.startTime) ?? 0,
      e: toMinutes(b.endTime) ?? 0,
    }));

  const hasConflict = blocks.some((b) => isOverlap(sMin, eMin, b.s, b.e));
  if (hasConflict) {
    if (!adjustedOnce.value) {
      const next = findNextAvailableSlot(sMin, form.durationMin, blocks);
      if (!next) return ElMessage.error('該日期已無空檔');
      form.startTime = toHHmm(next.s);
      form.endTime = toHHmm(next.e);
      adjustedOnce.value = true;
      ElMessage.warning(`偵測到衝突，已為您調整至最近空檔：${form.startTime}`);
      return;
    }
    return ElMessage.error('仍存在衝突，請手動修改時間');
  }
  const { durationMin: _, ...payload } = form;

  if (props.mode === 'create') {
    emit('submit', payload as CreateBookingPayload);
  } else {
    emit('submit', payload as UpdateBookingPayload);
  }
}

// 關閉彈窗
function onCancel() {
  emit('cancel');
}
</script>

<template>
  <el-dialog
    :model-value="open"
    :title="isLocked ? '檢視面試行程 (唯讀)' : mode === 'create' ? '新增行程' : '編輯行程'"
    :width="dialogSize"
    @close="onCancel"
    destroy-on-close
  >
    <el-alert
      v-if="isLocked"
      title="此為系統同步的面試行程，無法在此直接修改。如需調整請聯繫 HR 或至面試管理模組。"
      type="warning"
      show-icon
      :closable="false"
      style="margin-bottom: 18px"
    />

    <el-alert
      v-if="conflictMsg"
      :title="conflictMsg"
      type="error"
      show-icon
      style="margin-bottom: 15px"
    />

    <el-form ref="formRef" :model="form" :rules="rules" label-width="90px" status-icon>
      <el-form-item label="標題" prop="title">
        <el-input v-model="form.title" :disabled="isLocked" placeholder="例如：會議、休假" />
      </el-form-item>

      <el-form-item label="日期" prop="date">
        <el-date-picker
          v-model="form.date"
          type="date"
          value-format="YYYY-MM-DD"
          style="width: 100%"
          :disabled="isLocked"
        />
      </el-form-item>

      <el-form-item label="開始時間" prop="startTime">
        <el-time-select
          v-model="form.startTime"
          start="08:00"
          step="00:30"
          end="20:00"
          style="width: 100%"
          :disabled="isLocked"
        />
      </el-form-item>

      <el-form-item label="時長">
        <el-select v-model="form.durationMin" style="width: 100%" :disabled="isLocked">
          <el-option label="30 分鐘" :value="30" />
          <el-option label="60 分鐘" :value="60" />
          <el-option label="90 分鐘" :value="90" />
          <el-option label="120 分鐘" :value="120" />
        </el-select>
      </el-form-item>

      <el-form-item label="結束時間">
        <el-input :model-value="form.endTime" disabled />
        <el-text v-if="endOutOfRange" type="danger" size="small">
          超出 {{ END_MAX_STR }} 工作範圍
        </el-text>
      </el-form-item>

      <el-form-item label="行程狀態">
        <el-radio-group v-model="form.status" :disabled="isLocked">
          <el-radio-button value="confirmed">已確認</el-radio-button>
          <el-radio-button value="pending">待定</el-radio-button>
        </el-radio-group>
      </el-form-item>
    </el-form>

    <template #footer>
      <el-button @click="onCancel">{{ isLocked ? '關閉' : '取消' }}</el-button>
      <el-button
        v-if="!isLocked"
        type="primary"
        :loading="saving"
        :disabled="endOutOfRange"
        @click="onSubmit"
      >
        儲存行程
      </el-button>
    </template>
  </el-dialog>
</template>
