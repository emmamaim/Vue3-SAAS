<script setup>
import { ref, watch } from 'vue';
import { ElMessage } from 'element-plus';
import { createCandidateService } from '@/api/candidate';
import { getHrListService } from '@/api/users';
import { systemInitService } from '@/api/system';
import { UploadFilled } from '@element-plus/icons-vue';
// 響應式選項數據
const hrOptions = ref([]);
const deptOptions = ref([]);
// 狀態選項（對應資料庫 ENUM）
const statusOptions = [
  { label: '待處理', value: 'pending' },
  { label: '初步篩選', value: 'screening' },
  { label: '面試中', value: 'interviewing' },
  { label: '發放 Offer', value: 'offer' },
  { label: '已入職', value: 'hired' },
  { label: '不錄取', value: 'rejected' },
];

// 父組件傳進的資料
const props = defineProps({
  modelValue: Boolean,
  data: Object,
});
// emit通知父組件關閉抽屜和刷新列表
const emit = defineEmits(['update:modelValue', 'refresh']);
// 表單相關數據
const formRef = ref(null);
const loading = ref(false);
const isEdit = ref(false);
// 檔案列表 (給 el-upload 展示用)
const fileList = ref([]);
const form = ref({
  name: '',
  email: '',
  phone: '',
  job_id: '',
  dept_id: '',
  source_id: '',
  category_id: '',
  status: 'pending',
  hr_id: null,
  resume: null,
});
const rules = {
  name: [{ required: true, message: '請輸入姓名', trigger: 'blur' }],
  email: [{ required: true, type: 'email', message: '格式不正確', trigger: 'blur' }],
  phone: [{ required: true, pattern: /^09\d{8}$/, message: '手機格式錯誤', trigger: 'blur' }],
  dept_id: [{ required: true, message: '請選擇部門', trigger: 'change' }],
  job_id: [{ required: true, message: '請輸入職位 ID', trigger: 'blur' }],
};
const getOptions = async () => {
  try {
    const [hrRes, systemRes] = await Promise.all([getHrListService(), systemInitService()]);
    hrOptions.value = hrRes.data;
    deptOptions.value = systemRes.departments || [];
  } catch (err) {
    console.error('初始化失敗:', err);
  }
};
// 重置表單
const resetForm = () => {
  form.value = {
    name: '',
    email: '',
    phone: '',
    job_id: '',
    dept_id: null,
    source_id: '',
    category_id: 1,
    status: 'pending',
    hr_id: null,
    resume: null,
  };
  fileList.value = [];
  if (formRef.value) formRef.value.resetFields();
};
// 關閉抽屜
const handleClose = () => {
  emit('update:modelValue', false);
};
// 監聽
watch(
  () => props.modelValue,
  (val) => {
    if (val) getOptions();
  },
);
watch(
  () => props.data,
  (newVal) => {
    if (newVal && newVal.id) {
      isEdit.value = true;
      form.value = { ...newVal, resume: null };
    } else {
      isEdit.value = false;
      resetForm();
    }
  },
  { deep: true },
);
// 處理檔案切換
const handleFileChange = (file) => {
  form.value.resume = file.raw;
};
// 提交表單
const submitForm = async () => {
  loading.value = true;
  if (!formRef.value) return;
  try {
    await formRef.value.validate();
    // 構建FormData
    const formData = new FormData();
    formData.append('name', form.value.name);
    formData.append('email', form.value.email);
    formData.append('phone', form.value.phone);
    formData.append('job_id', form.value.job_id);
    formData.append('dept_id', form.value.dept_id);
    formData.append('source_id', form.value.source_id);
    formData.append('category_id', form.value.category_id);
    formData.append('status', form.value.status);
    formData.append('hr_id', form.value.hr_id);
    // 有檔案才附加
    if (form.value.resume) {
      formData.append('resume', form.value.resume);
    }
    if (isEdit.value) {
      // 預留給UPDATE的API
      ElMessage.success('已更新');
    } else {
      await createCandidateService(formData);
      ElMessage.success('應徵者已錄入');
    }
    // 通知父組件刷新列表 和 關閉抽屜
    emit('refresh');
    handleClose();
  } catch (err) {
    if (err instanceof Error) {
      console.error('API 請求出錯：', err);
      ElMessage.error('系統錯誤，請稍後再試');
    } else {
      // validate() 失敗觸發
      ElMessage.warning('請檢查表單欄位是否正確填寫');
    }
  } finally {
    loading.value = false;
  }
};
</script>
<template>
  <el-drawer
    :model-value="modelValue"
    :title="isEdit ? '編輯' : '錄入應徵者'"
    size="50%"
    @close="emit('update:modelValue', false)"
  >
    <el-form :model="form" label-position="top" :rules="rules" ref="formRef">
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="姓名" prop="name">
            <el-input v-model="form.name" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="職位編號" prop="job_id">
            <el-input v-model="form.job_id" placeholder="例如: JOB001" />
          </el-form-item>
        </el-col>
      </el-row>

      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="Email" prop="email">
            <el-input v-model="form.email" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="電話" prop="phone">
            <el-input v-model="form.phone" />
          </el-form-item>
        </el-col>
      </el-row>

      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="應徵部門" prop="dept_id">
            <el-select v-model="form.dept_id" style="width: 100%">
              <el-option
                v-for="item in deptOptions"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="來源渠道" prop="source_id">
            <el-select v-model="form.source_id" style="width: 100%">
              <el-option label="104銀行" value="104" />
              <el-option label="LinkedIn" value="linkedin" />
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="當前狀態" prop="status">
            <el-select v-model="form.status" style="width: 100%">
              <el-option
                v-for="item in statusOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="負責 HR" prop="hr_id">
            <el-select v-model="form.hr_id" style="width: 100%">
              <el-option
                v-for="item in hrOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>

      <el-form-item label="履歷檔案 (resume_url)" :required="!isEdit">
        <el-upload action="#" :auto-upload="false" :limit="1" :on-change="handleFileChange" drag>
          <el-icon class="el-icon--upload"><upload-filled /></el-icon>
          <div class="el-upload__text">拖拽或點擊上傳</div>
        </el-upload>
      </el-form-item>
    </el-form>

    <template #footer>
      <el-button @click="emit('update:modelValue', false)">取消</el-button>
      <el-button type="primary" :loading="loading" @click="submitForm">確認錄入</el-button>
    </template>
  </el-drawer>
</template>

<style scoped>
:deep(.el-drawer__body) {
  padding-top: 10px;
}
</style>
