<script setup>
import { ref, watch } from 'vue'
import { userCreateService, userUpdateService } from '@/api/users';
import { ElMessage } from 'element-plus';

// 父組件傳進的資料
const props = defineProps({
  visible: Boolean,
  rowData: Object
})
// emit通知父組件關閉對話框和刷新列表
const emit = defineEmits(['update:visible', 'success'])

// 定義表單
const formRef = ref(null)
const isEdit = ref(false)
const initialForm = {
  username: '',
  password: '',
  real_name: '',
  role: 'interviewer',
  dept: ''
}
const form = ref({ ...initialForm })
const rules = {
  username: [
    { required: true, message: '請輸入帳號', trigger: 'blur' },
    { min: 3, max: 20, message: '長度需在 3 到 20 個字元', trigger: 'blur' }
  ],
  real_name: [
    { required: true, message: '請輸入真實姓名', trigger: 'blur' }
  ],
  dept: [
    { required: true, message: '請選擇部門', trigger: 'change' }
  ],
  // 密碼規則可以用函數動態處理
  password: [
    {
      validator: (rule, value, callback) => {
        if (!isEdit.value && !value) {
          callback(new Error('新增用戶必須設置初始密碼'))
        } else {
          callback()
        }
      },
      trigger: 'blur'
    }
  ]
}
// 部門選項
const deptOptions = [
  { label: '管理層', value: 'Management' },
  { label: '技術部', value: 'Tech' },
  { label: '人力資源部', value: 'HR' },
  { label: '產品部', value: 'Product' },
  { label: '營運部', value: 'Operations' },
  { label: '市場部', value: 'Marketing' }
]

// 監控visible
watch(() => props.visible, (newVal) => {
  console.log('彈窗打開了！接收到的原始資料是:', props.rowData);
  if (newVal) {
    if (props.rowData && (props.rowData.id || props.rowData.username)) {
      // 編輯模式
      isEdit.value = true
      // 密碼欄位清空，避免顯示原密碼
      form.value = { ...props.rowData, password: '' }
    } else {
      // 新增模式
      isEdit.value = false
      form.value = { ...initialForm }
    }
  }
})

// 關閉彈窗
const handleClose = () => {
  emit('update:visible', false)
}

// 提交表單
const submitForm = async () => {
  if (!formRef.value) return
  try {
    await formRef.value.validate()
    if (isEdit.value) {
      await userUpdateService(form.value.id, form.value)
      ElMessage.success('更新成功')
    } else {
      await userCreateService(form.value)
      ElMessage.success('新增成功')
    }
    // 通知父組件提交成功并且關彈窗
    emit('success')
    handleClose()
  } catch {
    // 由request.js統一處理
  }
}
</script>

<template>
  <el-dialog :model-value="visible" :title="isEdit ? '編輯用戶' : '新增用戶'" width="500px" @close="handleClose">
    <el-form :model="form" ref="formRef" :rules="rules" label-width="100px">
      <el-form-item label="帳號" required>
        <el-input v-model="form.username" :disabled="isEdit" placeholder="建議使用英文名" />
      </el-form-item>

      <el-form-item :label="isEdit ? '重設密碼' : '初始密碼'" :required="!isEdit">
        <el-input v-model="form.password" type="password" show-password placeholder="不修改請留空" />
      </el-form-item>

      <el-form-item label="真實姓名" required>
        <el-input v-model="form.real_name" placeholder="請輸入中文姓名" />
      </el-form-item>

      <el-form-item label="所屬部門" required>
        <el-select v-model="form.dept" placeholder="請選擇部門" style="width: 100%">
          <el-option v-for="item in deptOptions" :key="item.value" :label="item.label" :value="item.value" />
        </el-select>
      </el-form-item>

      <el-form-item label="權限角色" required>
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