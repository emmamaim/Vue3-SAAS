<script setup>
import { ref, watch } from 'vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import { getCandidateInfoService } from '@/api/candidate';
import { cancelInterviewService } from '@/api/interview';
import InterviewDialog from './InterviewDialog.vue';
import { Edit, Delete } from '@element-plus/icons-vue';

const props = defineProps({
  modelValue: Boolean,
  id: [Number, String],
});
const emit = defineEmits(['update:modelValue', 'refresh']);
const loading = ref(false);
const detail = ref({});
const showInterviewDialog = ref(false);
const selectedInterview = ref(null);
// 狀態標籤顏色：應徵者
const getCandidateStatusType = (status) => {
  const map = {
    pending: 'info',
    screening: '',
    interviewing: 'warning',
    offer: 'success',
    hired: 'success',
    rejected: 'danger',
  };
  return map[status] || 'info';
};
// 狀態標籤顏色：面試
const getInterviewStatusType = (status) => {
  const map = {
    scheduled: 'primary',
    completed: 'success',
    cancelled: 'info',
  };
  return map[status] || 'info';
};
// 狀態標簽顔色：面試結果
const getResultTagType = (result) => {
  const map = {
    pass: 'success',
    pending: 'warning',
    fail: 'danger'
  };
  return map[result] || 'info';
};
// 狀態標簽文字：面試結果
const getResultLabel = (result) => {
  const map = {
    pass: '通過',
    pending: '待定',
    fail: '未通過'
  };
  return map[result] || '尚未評定';
};
// 監聽ID變化
watch(
  () => [props.modelValue, props.id],
  async ([isOpen, newId]) => {
    if (isOpen && newId) {
      fetchDetail(newId);
    }
  },
  { immediate: true },
);
// 獲取詳情
const fetchDetail = async (id) => {
  loading.value = true;
  try {
    const res = await getCandidateInfoService(id);
    if (res.success) {
      res.data.interviews?.sort((a, b) => new Date(a.date) - new Date(b.date));
      detail.value = res.data;
    }
  } catch (error) {
    ElMessage.error('獲取詳情失敗：' + error.message);
  } finally {
    loading.value = false;
  }
};
// 關閉彈窗
const handleClose = () => {
  emit('update:modelValue', false);
};
// 編輯面試
const handleEditInterview = (item) => {
  selectedInterview.value = { ...item };
  showInterviewDialog.value = true;
}
// 取消面試
const handleCancelInterview = async (interviewId) => {
  ElMessageBox.confirm('確定要取消這場面試嗎？這將會同步從面試官的行事曆中移除。', '取消確認', {
    confirmButtonText: '確定',
    cancelButtonText: '取消',
    type: 'warning',
  }).then(async () => {
    try {
      await cancelInterviewService(interviewId);
      ElMessage.success('面試已成功取消');
      fetchDetail(props.id);
      emit('refresh');
    } catch (error) {
      ElMessage.error('取消失敗：' + error.message);
    }
  });
}
</script>

<template>
  <el-dialog :model-value="modelValue" @update:model-value="handleClose" title="人才詳細資訊" width="650px">
    <div v-loading="loading">
      <el-descriptions :column="2" border>
        <el-descriptions-item label="姓名">{{ detail.name || '-' }}</el-descriptions-item>
        <el-descriptions-item label="狀態">
          <el-tag :type="getCandidateStatusType(detail.status)">{{ detail.status || '-' }}</el-tag>
        </el-descriptions-item>
        <el-descriptions-item label="應徵職位">{{ detail.position_name || '-' }}</el-descriptions-item>
        <el-descriptions-item label="人才來源">{{ detail.source_name || '-' }}</el-descriptions-item>
        <el-descriptions-item label="電子郵件" :span="2">{{ detail.email || '-' }}</el-descriptions-item>
        <el-descriptions-item label="聯絡電話" :span="2">{{ detail.phone || '-' }}</el-descriptions-item>
      </el-descriptions>

      <h4 class="section-title">面試紀錄</h4>
      <el-timeline v-if="detail.interviews?.length">
        <el-timeline-item v-for="(item, index) in detail.interviews" :key="index" :timestamp="item.date" placement="top"
          :type="item.status === 'scheduled' ? 'primary' : ''">
          <el-card shadow="hover" class="interview-card">
            <div class="card-header">
              <div class="header-left">
                <strong>第 {{ item.interview_round }} 輪面試</strong>
                <el-tag size="small" :type="getInterviewStatusType(item.status)" style="margin-left: 8px">
                  {{ item.status }}
                </el-tag>
              </div>

              <div v-if="item.status === 'scheduled'" class="header-actions">
                <el-button type="primary" link :icon="Edit" @click="handleEditInterview(item)">編輯</el-button>
                <el-button type="danger" link :icon="Delete" @click="handleCancelInterview(item.id)">取消</el-button>
              </div>
            </div>

            <p>面試官: {{ item.interviewer_name }}</p>
            <p>時間: {{ item.startTime?.slice(0, 5) }} - {{ item.endTime?.slice(0, 5) }}</p>

            <div class="result-section" style="margin-top: 10px;">
              <span style="font-size: 14px; color: #606266;">面試結果：</span>
              <el-tag :type="getResultTagType(item.result)" effect="dark" size="small">
                {{ getResultLabel(item.result) }}
              </el-tag>
            </div>

            <p v-if="item.comments" class="comments" style="margin-top: 10px;">
              評語：{{ item.comments }}
            </p>
          </el-card>
        </el-timeline-item>
      </el-timeline>
      <el-empty v-else description="暫無面試紀錄" :image-size="60" />
    </div>

    <InterviewDialog v-model="showInterviewDialog" :interview="selectedInterview"
      @refresh="fetchDetail(props.id); emit('refresh')" />
  </el-dialog>
</template>

<style scoped>
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
</style>
