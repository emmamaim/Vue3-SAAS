<script setup>
import { ref, watch } from 'vue';
import { ElMessage } from 'element-plus';
import { getCandidateInfoService } from '@/api/candidate';

const props = defineProps({
  modelValue: Boolean,
  id: [Number, String],
});
const emit = defineEmits(['update:modelValue']);
const loading = ref(false);
const detail = ref({});
// 狀態標籤顏色
const getStatusType = (status) => {
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
const fetchDetail = async (id) => {
  loading.value = true;
  try {
    const res = await getCandidateInfoService(id);
    if (res.success) {
      detail.value = res.data;
    }
  } catch (error) {
    ElMessage.error('獲取詳情失敗：' + error.message);
  } finally {
    loading.value = false;
  }
};
const handleClose = () => {
  emit('update:modelValue', false);
};
</script>

<template>
  <el-dialog
    :model-value="modelValue"
    @update:model-value="handleClose"
    title="人才詳細資訊"
    width="650px"
  >
    <div v-loading="loading">
      <el-descriptions :column="2" border>
        <el-descriptions-item label="姓名">{{ detail.name || '-' }}</el-descriptions-item>
        <el-descriptions-item label="狀態">
          <el-tag :type="getStatusType(detail.status)">{{ detail.status || '-' }}</el-tag>
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
          :type="index === 0 ? 'primary' : ''"
        >
          <el-card shadow="hover" class="interview-card">
            <div class="card-header">
              <strong>第 {{ item.interview_round }} 輪面試</strong>
              <el-tag size="small">{{ item.status }}</el-tag>
            </div>
            <p>面試官: {{ item.interviewer_name }}</p>
            <p>評分：<el-rate v-model="item.rating" disabled show-score /></p>
            <p v-if="item.comments" class="comments">評語：{{ item.comments }}</p>
          </el-card>
        </el-timeline-item>
      </el-timeline>
      <el-empty v-else description="暫無面試紀錄" :image-size="60" />
    </div>
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

.comments {
  background: #f8f9fa;
  padding: 8px;
  border-radius: 4px;
  font-size: 13px;
  color: #666;
}
</style>
