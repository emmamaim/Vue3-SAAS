<script setup>
import { ref, watch, nextTick, computed } from 'vue';
import { userCreateService, userUpdateService } from '@/api/users';
import { useSystemStore } from '@/stores';
import { ElMessage } from 'element-plus';

// 父組件傳進的資料
const props = defineProps({
  visible: Boolean,
  rowData: Object,
});
// emit通知父組件關閉對話框和刷新列表
const emit = defineEmits(['update:visible', 'success']);
// 獲取部門列表
const systemStore = useSystemStore();
const deptOptions = computed(() => systemStore.departments);
// 定義表單
const formRef = ref(null);
const isEdit = ref(false);
const initialForm = {
  username: '',
  password: '',
  real_name: '',
  role: 'interviewer',
  dept_id: '',
};
const form = ref({ ...initialForm });
const rules = {
  username: [
    { required: true, message: '請輸入帳號', trigger: 'blur' },
    { min: 3, max: 20, message: '長度需在 3 到 20 個字元', trigger: 'blur' },
  ],
  real_name: [{ required: true, message: '請輸入真實姓名', trigger: 'blur' }],
  // 密碼規則可以用函數動態處理
  password: [
    {
      validator: (rule, value, callback) => {
        if (!isEdit.value && !value) {
          callback(new Error('新增用戶必須設置初始密碼'));
        } else {
          callback();
        }
      },
      trigger: 'blur',
    },
  ],
  dept_id: [{ required: true, message: '請選擇部門', trigger: 'change' }],
};

// 監控visible
watch(
  () => props.visible,
  async (newVal) => {
    if (newVal) {
      await systemStore.fetchAllOptions();
      // 清除表單校驗殘留
      nextTick(() => {
        if (formRef.value) formRef.value.clearValidate();
      });
      if (props.rowData && props.rowData.id) {
        // 編輯模式
        isEdit.value = true;
        // 密碼欄位清空，避免顯示原密碼
        form.value = {
          id: props.rowData.id,
          username: props.rowData.username,
          real_name: props.rowData.real_name,
          role: props.rowData.role,
          dept_id: props.rowData.dept_id ? Number(props.rowData.dept_id) : '',
          password: '',
        };
      } else {
        // 新增模式
        isEdit.value = false;
        form.value = { ...initialForm };
      }
    }
  },
);

// 關閉彈窗
const handleClose = () => {
  emit('update:visible', false);
};

// 提交表單
const submitForm = async () => {
  if (!formRef.value) return;
  try {
    await formRef.value.validate();
    // 封裝提交數據
    const submitData = {
      username: form.value.username,
      real_name: form.value.real_name,
      role: form.value.role,
      dept_id: form.value.dept_id,
    };
    // 處理密碼：只有輸入有效內容才提交
    if (form.value.password && form.value.password.trim() !== '') {
      submitData.password = form.value.password;
    }
    if (isEdit.value) {
      await userUpdateService(form.value.id, submitData);
      ElMessage.success('更新成功');
    } else {
      await userCreateService(submitData);
      ElMessage.success('新增成功');
    }
    // 通知父組件提交成功并且關彈窗
    emit('success');
    handleClose();
  } catch (error) {
    console.error('表單提交失敗:', error);
  }
};
</script>

<template>
  <el-dialog :model-value="visible" :title="isEdit ? '編輯用戶' : '新增用戶'" width="500px" @close="handleClose">
    <el-form :model="form" ref="formRef" :rules="rules" label-width="100px">
      <el-form-item label="帳號" prop="username" for="username">
        <el-input v-model="form.username" :disabled="isEdit" id="username" placeholder="建議使用英文名" />
      </el-form-item>

      <el-form-item :label="isEdit ? '重設密碼' : '初始密碼'" prop="password" for="password">
        <el-input v-model="form.password" type="password" id="password" show-password placeholder="不修改請留空" />
      </el-form-item>

      <el-form-item label="真實姓名" prop="real_name" for="real_name">
        <el-input v-model="form.real_name" id="real_name" placeholder="請輸入中文姓名" />
      </el-form-item>

      <el-form-item label="所屬部門" prop="dept_id" for="dept_id">
        <el-select v-model="form.dept_id" id="dept_id" placeholder="請選擇部門" style="width: 100%">
          <el-option v-for="item in deptOptions" :key="item.id" :label="item.name" :value="item.id" />
        </el-select>
      </el-form-item>

      <el-form-item label="權限角色" prop="role">
        <el-radio-group v-model="form.role">
          <el-radio value="interviewer">面試官</el-radio>
          <el-radio value="dept_hr">部門HR</el-radio>
          <el-radio value="super_admin">管理員</el-radio>
        </el-radio-group>
      </el-form-item>
    </el-form>

    <template #footer>
      <el-button @click="handleClose">取消</el-button>
      <el-button type="primary" @click="submitForm">確定</el-button>
    </template>
  </el-dialog>
</template>
