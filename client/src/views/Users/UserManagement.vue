<script setup>
import { ref, reactive, onMounted } from 'vue';
import { Search, Plus, RefreshLeft } from '@element-plus/icons-vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import { userListService, userUpdateStatusService } from '@/api/users';
import UserDialog from './components/UserDialog.vue';

// 響應式數據定義
const loading = ref(false)
const userList = ref([])
const total = ref(0)
const dialogVisible = ref(false);
const currentRow = ref({});
// 搜尋和分頁參數
const queryParams = reactive({
  page: 1,
  pageSize: 10,
  dept: '',
  role: '',
  status: ''
})
// 部門選項
const deptOptions = [
  { label: '管理層', value: 'Management' },
  { label: '技術部', value: 'Tech' },
  { label: '人力資源部', value: 'HR' },
  { label: '產品部', value: 'Product' },
  { label: '營運部', value: 'Operations' },
  { label: '市場部', value: 'Marketing' }
]
// 獲取用戶列表
const getUserList = async () => {
  loading.value = true
  try {
    const res = await userListService(queryParams)
    userList.value = res.data
    total.value = res.total
  } catch {
    // request.js 攔截
  } finally {
    loading.value = false
  }
}

// 搜尋用戶
const handleQuery = () => {
  // 搜尋時必須重置回第一頁
  queryParams.page = 1
  getUserList()
}
// 重置搜尋條件
const handleReset = () => {
  queryParams.dept = ''
  queryParams.role = ''
  queryParams.status = ''
  queryParams.page = 1
  getUserList()
}
// 新增用戶
const handleAdd = () => {
  // 清空當前行資料
  currentRow.value = {}
  dialogVisible.value = true
}

// 編輯用戶
const handleEdit = (row) => {
  // 將當前行資料傳入彈窗
  currentRow.value = { ...row }
  dialogVisible.value = true
}

// 啓用/停用用戶
const handleToggleStatus = async (row) => {
  const actionText = row.status === 'active' ? '停用' : '啟用';
  const newStatus = row.status === 'active' ? 'disabled' : 'active';
  try {
    await ElMessageBox.confirm(`確定要${actionText}用戶「${row.real_name}」嗎？`, '提示', { confirmButtonText: '確定', cancelButtonText: '取消', type: 'warning' })
    await userUpdateStatusService(row.id, newStatus)
    // 提示操作成功后刷新列表
    ElMessage.success(`${actionText}成功`);
    getUserList();
  } catch {
    // 用戶點擊取消
  }
}

// 格式化工具（role角色）
const formatRole = (role) => {
  const map = {
    super_admin: '管理員',
    dept_hr: '部門HR',
    interviewer: '面試官'
  }
  return map[role] || role;
}

// 初始化挂載
onMounted(() => {
  getUserList();
});
</script>

<template>
  <div class="user-management">
    <!-- 篩選查詢 -->
    <el-card class="filter-card">
      <el-form :inline="true" :model="queryParams" class="filter-form">
        <el-form-item label="部門">
          <el-select v-model="queryParams.dept" placeholder="請輸入部門名稱" clearable style="width: 150px;">
            <el-option v-for="item in deptOptions" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="角色">
          <el-select v-model="queryParams.role" placeholder="全部角色" clearable style="width: 150px">
            <el-option label="管理員" value="super_admin" />
            <el-option label="部門HR" value="dept_hr" />
            <el-option label="面試官" value="interviewer" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleQuery">
            <el-icon>
              <Search />
            </el-icon> 查詢
          </el-button>
          <el-button @click="handleReset">
            <el-icon>
              <RefreshLeft /> 
            </el-icon>重置
          </el-button>
          <el-button type="success" @click="handleAdd">
            <el-icon>
              <Plus />
            </el-icon> 新增
          </el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <!-- 用戶表格信息 -->
    <el-card class="table-card" style="margin-top: 20px">
      <el-table v-loading="loading" :data="userList" border stripe style="width: 100%">
        <el-table-column prop="real_name" label="姓名" width="120" />
        <el-table-column prop="username" label="帳號" width="150" />
        <el-table-column prop="dept" label="部門" width="150" />
        <el-table-column prop="role" label="角色" width="120">
          <template #default="{ row }">
            {{ formatRole(row.role) }}
          </template>
        </el-table-column>

        <el-table-column label="帳號狀態" width="120" align="center">
          <template #default="{ row }">
            <el-tag :type="row.status === 'active' ? 'success' : 'danger'">
              {{ row.status === 'active' ? '使用中' : '已停用' }}
            </el-tag>
          </template>
        </el-table-column>

        <el-table-column prop="createAt" label="建立時間" width="180" />

        <el-table-column label="操作" fixed="right" min-width="200">
          <template #default="{ row }">
            <el-button link type="primary" @click="handleEdit(row)">
              編輯
            </el-button>

            <el-divider direction="vertical" />

            <el-button link :type="row.status === 'active' ? 'danger' : 'success'" @click="handleToggleStatus(row)">
              {{ row.status === 'active' ? '停用' : '啟用' }}
            </el-button>
          </template>
        </el-table-column>
      </el-table>

      <div class="pagination-container">
        <el-pagination v-model:current-page="queryParams.page" v-model:page-size="queryParams.pageSize" :total="total"
          :page-sizes="[10, 20, 50]" layout="total, sizes, prev, pager, next, jumper" @size-change="getUserList"
          @current-change="getUserList" />
      </div>
    </el-card>

    <!-- 編輯/新增用戶彈窗 -->
    <UserDialog v-model:visible="dialogVisible" :row-data="currentRow" @success="getUserList" />
  </div>
</template>

<style scoped>
.user-management {
  padding: 20px;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.pagination-container {
  margin-top: 20px;
  display: flex;
  justify-content: flex-end;
}

.filter-card {
  background-color: #f8f9fa;
}
</style>