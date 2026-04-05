<script setup lang="ts">
import { ref, watch, computed, onUnmounted, reactive } from 'vue';
import axios from 'axios';
import { ElMessage, type FormInstance, type FormRules, type UploadFile } from 'element-plus';
import { createCandidateService, updateCandidateService } from '@/api/candidate';
import { UploadFilled } from '@element-plus/icons-vue';
import { useSystemStore } from '@/stores';
import type { Candidate, CandidateStatus } from '@/types';

// 響應式佈局
const windowWidth = ref(window.innerWidth);
const handleResize = () => {
  windowWidth.value = window.innerWidth;
};
window.addEventListener('resize', handleResize);
const isMobile = computed(() => windowWidth.value <= 480);
const isTablet = computed(() => windowWidth.value <= 1024);
const drawerSize = computed(() => {
  if (isMobile.value) return '90%';
  if (isTablet.value) return '70%';
  return '50%';
});
onUnmounted(() => {
  window.removeEventListener('resize', handleResize);
});

// 基礎配置
const systemStore = useSystemStore();
const deptOptions = computed(() => systemStore.departments);
const sourceOptions = computed(() => systemStore.sources);
const jobOptions = computed(() => systemStore.jobs);
const hrOptions = computed(() => systemStore.hrOptions);

// 狀態選項（對應資料庫 ENUM）
const statusOptions: { label: string; value: CandidateStatus }[] = [
  { label: '待處理', value: 'pending' },
  { label: '初步篩選', value: 'screening' },
  { label: '面試中', value: 'interviewing' },
  { label: '發放 Offer', value: 'offer' },
  { label: '已入職', value: 'hired' },
  { label: '不錄取', value: 'rejected' },
];

// props
interface Props {
  modelValue: boolean;
  data?: Partial<Candidate>;
}
const props = defineProps<Props>();

// emit
const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void;
  (e: 'refresh'): void;
}>();

// 載入狀態
const loading = ref(false);

// 表單相關
interface CandidateForm {
  name: string;
  email: string;
  phone: string;
  job_id: number | null;
  dept_id: number | null;
  source_id: number | null;
  status: CandidateStatus;
  hr_id: string | null;
  resume: File | null;
  resume_url: string;
}
const formRef = ref<FormInstance>();
const isEdit = ref(false);
const rules = reactive<FormRules>({
  name: [{ required: true, message: '請輸入姓名', trigger: 'blur' }],
  email: [{ required: true, type: 'email', message: '格式不正確', trigger: 'blur' }],
  phone: [{ required: true, pattern: /^09\d{8}$/, message: '手機格式錯誤', trigger: 'blur' }],
  dept_id: [{ required: true, message: '請選擇部門', trigger: 'change' }],
  job_id: [{ required: true, message: '請選擇職位', trigger: 'change' }],
  source_id: [{ required: true, message: '請選擇來源', trigger: 'change' }],
  status: [{ required: true, message: '請選擇狀態', trigger: 'change' }],
  hr_id: [{ required: true, message: '請選擇負責人', trigger: 'change' }],
});

// 檔案列表 (給 el-upload 展示用)
const fileList = ref<UploadFile[]>([]);
const form = ref<CandidateForm>({
  name: '',
  email: '',
  phone: '',
  job_id: null,
  dept_id: null,
  source_id: null,
  status: 'pending',
  hr_id: null,
  resume: null,
  resume_url: '',
});
// 處理檔案切換
const handleFileChange = (file: UploadFile) => {
  // 检查大小
  if (file.size && file.size / 1024 / 1024 > 5) {
    ElMessage.error('上傳履歷大小不能超過 5MB!');
    fileList.value = [];
    return;
  }
  form.value.resume = file.raw as File;
};

// 重置表單
const resetForm = () => {
  form.value = {
    name: '',
    email: '',
    phone: '',
    job_id: null,
    dept_id: null,
    source_id: null,
    status: 'pending',
    hr_id: null,
    resume: null,
    resume_url: '',
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
  async (val) => {
    if (systemStore.jobs.length === 0) {
      await systemStore.fetchAllOptions();
    }
    if (val && props.data && props.data.id) {
      isEdit.value = true;
      form.value = {
        name: props.data.name || '',
        email: props.data.email || '',
        phone: props.data.phone || '',
        job_id: props.data.job_id ? Number(props.data.job_id) : null,
        dept_id: props.data.dept_id ? Number(props.data.dept_id) : null,
        source_id: props.data.source_id ? Number(props.data.source_id) : null,
        status: (props.data.status as CandidateStatus) || 'pending',
        hr_id: props.data.hr_id || null,
        resume: null,
        resume_url: props.data.resume_url || '',
      };
    } else if (val) {
      isEdit.value = false;
      resetForm();
    }
  },
);

// 提交表單
const submitForm = async () => {
  loading.value = true;
  if (!formRef.value) return;
  try {
    await formRef.value.validate();
    // 找出選中職位的類別ID
    const selectedJob = jobOptions.value.find((j) => Number(j.id) === Number(form.value.job_id));
    const category_id = selectedJob ? selectedJob.category_id : 1;
    // 構建FormData
    const formData = new FormData();
    formData.append('name', form.value.name);
    formData.append('email', form.value.email);
    formData.append('phone', form.value.phone);
    formData.append('job_id', String(form.value.job_id));
    formData.append('dept_id', String(form.value.dept_id));
    formData.append('source_id', String(form.value.source_id));
    formData.append('category_id', String(category_id));
    formData.append('status', form.value.status);
    formData.append('hr_id', form.value.hr_id || '');

    // 有檔案才附加
    if (form.value.resume) {
      formData.append('resume', form.value.resume);
    }
    // 編輯未上傳新檔案，保留原檔案URL
    if (isEdit.value && form.value.resume_url) {
      formData.append('resume_url', form.value.resume_url);
    }
    if (isEdit.value && props.data?.id) {
      await updateCandidateService(props.data.id, formData);
      ElMessage.success('已更新');
    } else {
      await createCandidateService(formData);
      ElMessage.success('應徵者已錄入');
    }
    emit('refresh');
    handleClose();
  } catch (err: unknown) {
    if (!axios.isAxiosError(err)) {
      if (err instanceof Error) {
        console.error('開發者邏輯錯誤：', err);
      } else {
        ElMessage.warning('表單內容有誤，請檢查紅字提示');
      }
    }
  } finally {
    loading.value = false;
  }
};
</script>
<template>
  <el-drawer
    :model-value="modelValue"
    :title="isEdit ? '編輯應徵者' : '錄入應徵者'"
    :size="drawerSize"
    @close="handleClose"
    class="candidate-drawer"
  >
    <el-form :model="form" label-position="top" :rules="rules" ref="formRef">
      <el-row :gutter="20">
        <el-col :xs="11" :sm="12">
          <el-form-item label="姓名" prop="name">
            <el-input v-model="form.name" placeholder="請輸入姓名" />
          </el-form-item>
        </el-col>
        <el-col :xs="11" :sm="12">
          <el-form-item label="應徵職位" prop="job_id">
            <el-select v-model="form.job_id" placeholder="請選擇職位" style="width: 100%">
              <el-option
                v-for="item in jobOptions"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              />
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row :gutter="20">
        <el-col :xs="11" :sm="12">
          <el-form-item label="Email" prop="email">
            <el-input v-model="form.email" placeholder="example@hr.com" />
          </el-form-item>
        </el-col>
        <el-col :xs="11" :sm="12">
          <el-form-item label="電話" prop="phone">
            <el-input v-model="form.phone" placeholder="0912345678" />
          </el-form-item>
        </el-col>
      </el-row>

      <el-row :gutter="20">
        <el-col :xs="11" :sm="12">
          <el-form-item label="所屬部門" prop="dept_id">
            <el-select v-model="form.dept_id" placeholder="選擇部門" style="width: 100%">
              <el-option
                v-for="item in deptOptions"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :xs="11" :sm="12">
          <el-form-item label="來源渠道" prop="source_id">
            <el-select v-model="form.source_id" placeholder="選擇來源" style="width: 100%">
              <el-option
                v-for="item in sourceOptions"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              />
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row :gutter="20">
        <el-col :xs="11" :sm="12">
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
        <el-col :xs="11" :sm="12">
          <el-form-item label="負責 HR" prop="hr_id">
            <el-select v-model="form.hr_id" placeholder="選擇負責人" style="width: 100%" clearable>
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

      <el-form-item label="履歷檔案 (PDF / Word)">
        <div v-if="isEdit && form.resume_url" style="margin-bottom: 10px">
          <el-tag closable @close="form.resume_url = ''"> 當前已有檔案 </el-tag>
        </div>
        <el-upload
          action="#"
          :auto-upload="false"
          :limit="1"
          :on-change="handleFileChange"
          :file-list="fileList"
          accept=".pdf,.doc,.docx"
          drag
        >
          <el-icon class="el-icon--upload"><upload-filled /></el-icon>
          <div class="el-upload__text">拖拽或點擊上傳新履歷</div>
          <template #tip>
            <div class="el-upload__tip">請上傳 PDF/Word 檔案，大小不超過 5MB</div>
          </template>
        </el-upload>
      </el-form-item>
    </el-form>

    <template #footer>
      <div style="flex: auto">
        <el-button @click="handleClose">取消</el-button>
        <el-button type="primary" :loading="loading" @click="submitForm">
          {{ isEdit ? '儲存修改' : '確認錄入' }}
        </el-button>
      </div>
    </template>
  </el-drawer>
</template>

<style>
@media (max-width: 480px) {
  .candidate-drawer .el-drawer__body {
    padding: 0 0 0 10px !important;
  }
}
</style>
