<script setup lang="ts">
import { ref, watch, computed, onUnmounted } from 'vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import { getCandidateInfoService } from '@/api/candidate';
import { cancelInterviewService } from '@/api/interview';
import InterviewDialog from './InterviewDialog.vue';
import { Edit, Delete } from '@element-plus/icons-vue';
import type { Candidate, Interview, CandidateStatus } from '@/types';
import axios from 'axios';

// 響應式佈局
const windowWidth = ref(window.innerWidth);
const handleResize = () => {
  windowWidth.value = window.innerWidth;
};
window.addEventListener('resize', handleResize);
const isMobile = computed(() => windowWidth.value <= 480);
const isTablet = computed(() => windowWidth.value <= 1024);
const dialogSize = computed(() => {
  if (isMobile.value) return '85%';
  if (isTablet.value) return '60%';
  return '35%';
});
onUnmounted(() => {
  window.removeEventListener('resize', handleResize);
});

// 狀態標籤顏色：應徵者
const getCandidateStatusType = (status?: CandidateStatus): string => {
  const map = {
    pending: 'info',
    screening: '',
    interviewing: 'warning',
    offer: 'success',
    hired: 'success',
    rejected: 'danger',
  };
  return status ? map[status] || 'info' : 'info';
};

// 狀態標籤顏色：面試
const getInterviewStatusType = (status?: string) => {
  const map: Record<string, string> = {
    scheduled: 'primary',
    completed: 'success',
    cancelled: 'info',
  };
  return status ? map[status] || 'info' : 'info';
};

// 狀態標簽顔色：面試結果
const getResultTagType = (result?: string) => {
  const map: Record<string, string> = {
    pass: 'success',
    pending: 'warning',
    fail: 'danger',
  };
  return result ? map[result] || 'info' : 'info';
};

// 狀態標簽文字：面試結果
const getResultLabel = (result?: string) => {
  const map: Record<string, string> = {
    pass: '通過',
    pending: '待定',
    fail: '未通過',
  };
  return result ? map[result] || '尚未評定' : '尚未評定';
};

// props
interface Props {
  modelValue: boolean;
  id?: string | null;
}
const props = defineProps<Props>();

// emit
const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void;
  (e: 'refresh'): void;
}>();

// 載入狀態
const loading = ref(false);

// 數據
const detail = ref<Partial<Candidate>>({});
const showInterviewDialog = ref(false);
const selectedInterview = ref<Interview | null>(null);

// 監聽ID變化
watch(
  () => [props.modelValue, props.id],
  async ([isOpen, newId]) => {
    if (isOpen && newId !== null && newId !== undefined) {
      fetchDetail(newId as string);
    }
  },
  { immediate: true },
);

// 獲取詳情
const fetchDetail = async (id: string) => {
  loading.value = true;
  try {
    const res = await getCandidateInfoService(id);
    if (res.success && res.data) {
      if (res.data.interviews) {
        res.data.interviews?.sort(
          (a: Interview, b: Interview) => new Date(a.date).getTime() - new Date(b.date).getTime(),
        );
      }
      detail.value = res.data || {};
    }
  } catch (error: unknown) {
    let msg = '未知錯誤';
    if (axios.isAxiosError(error)) {
      msg = error.response?.data?.message || error.message;
    } else if (error instanceof Error) {
      msg = error.message;
    }
    ElMessage.error('獲取詳情失敗：' + msg);
  } finally {
    loading.value = false;
  }
};

// 編輯面試
const handleEditInterview = (item: Interview) => {
  selectedInterview.value = { ...item };
  showInterviewDialog.value = true;
};

// 取消面試
const handleCancelInterview = async (interviewId: string) => {
  ElMessageBox.confirm('確定要取消這場面試嗎？這將會同步從面試官的行事曆中移除。', '取消確認', {
    confirmButtonText: '確定',
    cancelButtonText: '取消',
    type: 'warning',
  }).then(async () => {
    try {
      await cancelInterviewService(interviewId);
      ElMessage.success('面試已成功取消');
      if (props.id) fetchDetail(props.id);
      emit('refresh');
    } catch (err: unknown) {
      if (err === 'cancel') return;

      let msg = '取消失敗';
      if (axios.isAxiosError(err)) {
        msg = err.response?.data?.message || err.message;
      } else if (err instanceof Error) {
        msg = err.message;
      }
      ElMessage.error(msg);
    }
  });
};

// 關閉彈窗
const handleClose = () => {
  emit('update:modelValue', false);
};
</script>

<template>
  <el-dialog
    :model-value="modelValue"
    @update:model-value="handleClose"
    title="人才詳細資訊"
    :width="dialogSize"
  >
    <div v-loading="loading">
      <el-descriptions :column="1" border class="centered-descriptions">
        <el-descriptions-item label="姓名">{{ detail.name || '-' }}</el-descriptions-item>
        <el-descriptions-item label="狀態">
          <el-tag :type="getCandidateStatusType(detail.status)">{{ detail.status || '-' }}</el-tag>
        </el-descriptions-item>
        <el-descriptions-item label="應徵職位">{{
          detail.position_name || '-'
        }}</el-descriptions-item>
        <el-descriptions-item label="人才來源">{{
          detail.source_name || '-'
        }}</el-descriptions-item>
        <el-descriptions-item label="電子郵件" :span="2">{{
          detail.email || '-'
        }}</el-descriptions-item>
        <el-descriptions-item label="聯絡電話" :span="2">{{
          detail.phone || '-'
        }}</el-descriptions-item>
      </el-descriptions>

      <h4 class="section-title">面試紀錄</h4>
      <el-timeline v-if="detail.interviews?.length">
        <el-timeline-item
          v-for="(item, index) in detail.interviews"
          :key="index"
          :timestamp="item.date"
          placement="top"
          :type="item.status === 'scheduled' ? 'primary' : ''"
        >
          <el-card shadow="hover" class="interview-card">
            <div class="card-header">
              <div class="header-left">
                <strong>第 {{ item.interview_round }} 輪面試</strong>
                <el-tag
                  size="small"
                  :type="getInterviewStatusType(item.status)"
                  style="margin-left: 8px"
                >
                  {{ item.status }}
                </el-tag>
              </div>

              <div v-if="item.status === 'scheduled'" class="header-actions">
                <el-button type="primary" link :icon="Edit" @click="handleEditInterview(item)"
                  >編輯</el-button
                >
                <el-button type="danger" link :icon="Delete" @click="handleCancelInterview(item.id)"
                  >取消</el-button
                >
              </div>
            </div>

            <p>面試官: {{ item.interviewer_name }}</p>
            <p>時間: {{ item.startTime?.slice(0, 5) }} - {{ item.endTime?.slice(0, 5) }}</p>

            <div class="result-section" style="margin-top: 10px">
              <span style="font-size: 14px; color: #606266">面試結果：</span>
              <el-tag :type="getResultTagType(item.result)" effect="dark" size="small">
                {{ getResultLabel(item.result) }}
              </el-tag>
            </div>

            <p v-if="item.comments" class="comments" style="margin-top: 10px">
              評語：{{ item.comments }}
            </p>
          </el-card>
        </el-timeline-item>
      </el-timeline>
      <el-empty v-else description="暫無面試紀錄" :image-size="60" />
    </div>

    <InterviewDialog
      v-model="showInterviewDialog"
      :interview="selectedInterview"
      @refresh="
        props.id && fetchDetail(props.id);
        emit('refresh');
      "
    />
  </el-dialog>
</template>

<style scoped>
.centered-descriptions :deep(.el-descriptions__label) {
  width: 120px !important;
  text-align: center !important;
  background-color: var(--el-fill-color-light) !important;
  font-weight: bold;
}

.centered-descriptions :deep(.el-descriptions__content) {
  text-align: center !important;
}

.section-title {
  margin: 25px 0 15px;
  padding-left: 10px;
  border-left: 4px solid #409eff;
}

.interview-card {
  margin-bottom: 10px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.header-left {
  display: flex;
  align-items: center;
}

.header-actions {
  display: flex;
  gap: 5px;
}

.comments {
  background: #f8f9fa;
  padding: 8px;
  border-radius: 4px;
  font-size: 13px;
  color: #666;
}

/* 手機端優化 */
@media (max-width: 500px) {
  :deep(.el-timeline) {
    padding-left: 5px !important;
  }
  :deep(.el-card__body) {
    padding: 15px !important;
  }
  .card-header {
    flex-direction: column;
    align-items: flex-start !important;
    gap: 8px;
  }
}
</style>
