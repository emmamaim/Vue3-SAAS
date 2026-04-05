<script setup lang="ts">
import { ref, reactive, onMounted, computed } from 'vue';
import { Search, Plus, RefreshLeft } from '@element-plus/icons-vue';
import { ElMessage, ElMessageBox } from 'element-plus';

import type { UserList, UserQuery} from '@/types';
import { userListService, userUpdateStatusService } from '@/api/users';
import { useSystemStore } from '@/stores';

import { useWindowSize } from '@vueuse/core';
import UserDialog from './components/UserDialog.vue';

const systemStore = useSystemStore();
const deptOptions = computed(() => systemStore.departments);
const { width } = useWindowSize();

// 響應式數據定義
const loading = ref(false);
const userList = ref<UserList[]>([]);
const total = ref(0);
const dialogVisible = ref(false);
const currentRow = ref<Partial<UserList>>({});

// 搜尋和分頁參數
const queryParams = reactive<UserQuery>({
  page: 1,
  pageSize: 10,
  dept_id: undefined,
  role: undefined,
});

// 斷點設為 1024px，涵蓋大部分平板
const isCompact = computed(() => width.value < 1024);

const pagiLayout = computed(() =>
  isCompact.value ? 'prev, pager, next' : 'total, sizes, prev, pager, next, jumper',
);

// 獲取用戶列表
const getUserList = async () => {
  loading.value = true;
  try {
    const res = await userListService(queryParams);
    userList.value = res.data || [];
    total.value = res.total || 0;
  } finally {
    loading.value = false;
  }
};

// 搜尋用戶
const handleQuery = () => {
  queryParams.page = 1;
  getUserList();
};

// 重置搜尋條件
const handleReset = () => {
  queryParams.dept_id = undefined;
  queryParams.role = undefined;
  queryParams.page = 1;
  getUserList();
};

// 新增用戶
const handleAdd = () => {
  currentRow.value = {};
  dialogVisible.value = true;
};

// 編輯用戶
const handleEdit = (row: UserList) => {
  currentRow.value = { ...row };
  dialogVisible.value = true;
};

// 啓用/停用用戶
const handleToggleStatus = async (row: UserList) => {
  const isActivating = row.status !== 'active';
  const actionText = isActivating ? '啟用' : '停用';
  try {
    await ElMessageBox.confirm(`確定要${actionText}用戶「${row.real_name}」嗎？`, '提示', {
      type: 'warning',
    });
    await userUpdateStatusService(row.id, isActivating ? 'active' : 'disabled');
    ElMessage.success(`${actionText}成功`);
    getUserList();
  } catch {
    // 無
  }
};

// 格式化工具（role角色）
const formatRole = (role: string) => {
  const map: Record<string, string> = {
    super_admin: '管理員',
    dept_hr: '部門HR',
    interviewer: '面試官',
  };
  return map[role] || role;
};

// 初始化挂載
onMounted(async () => {
  await systemStore.fetchAllOptions();
  getUserList();
});
</script>

<template>
  <div class="user-management">
    <el-card class="filter-card">
      <el-form :inline="true" :model="queryParams" class="filter-form">
        <div class="filter-inputs">
          <el-form-item label="部門">
            <el-select
              v-model="queryParams.dept_id"
              placeholder="全部部門"
              clearable
              class="filter-select"
            >
              <el-option
                v-for="item in deptOptions"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              />
            </el-select>
          </el-form-item>

          <el-form-item label="角色">
            <el-select
              v-model="queryParams.role"
              placeholder="全部角色"
              clearable
              class="filter-select"
            >
              <el-option label="管理員" value="super_admin" />
              <el-option label="部門HR" value="dept_hr" />
              <el-option label="面試官" value="interviewer" />
            </el-select>
          </el-form-item>
        </div>

        <el-form-item class="op-btns">
          <el-button type="primary" @click="handleQuery">
            <el-icon><Search /></el-icon>查詢
          </el-button>
          <el-button @click="handleReset">
            <el-icon><RefreshLeft /></el-icon><span class="hidden-xs">重置</span>
          </el-button>
          <el-button type="success" @click="handleAdd" class="btn-add">
            <el-icon><Plus /></el-icon>新增
          </el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <el-card class="table-card">
      <el-table
        v-if="!isCompact"
        v-loading="loading"
        :data="userList"
        border
        stripe
        header-cell-class-name="table-header-center"
        cell-class-name="table-cell-center"
      >
        <el-table-column prop="real_name" label="姓名" min-width="1" />
        <el-table-column prop="username" label="帳號" min-width="1" />
        <el-table-column prop="dept_name" label="部門" min-width="1" />
        <el-table-column prop="role" label="角色" min-width="1">
          <template #default="{ row }">{{ formatRole(row.role) }}</template>
        </el-table-column>
        <el-table-column label="狀態" min-width="1">
          <template #default="{ row }">
            <el-tag :type="row.status === 'active' ? 'success' : 'danger'">
              {{ row.status === 'active' ? '使用中' : '已停用' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" fixed="right" width="160">
          <template #default="{ row }">
            <el-button link type="primary" @click="handleEdit(row)">編輯</el-button>
            <el-button
              link
              :type="row.status === 'active' ? 'danger' : 'success'"
              @click="handleToggleStatus(row)"
            >
              {{ row.status === 'active' ? '停用' : '啟用' }}
            </el-button>
          </template>
        </el-table-column>
      </el-table>

      <div v-else class="compact-list" v-loading="loading">
        <div class="card-grid">
          <div v-for="row in userList" :key="row.id" class="user-item-card">
            <div class="card-header">
              <span class="name">{{ row.real_name }}</span>
              <el-tag
                :type="row.status === 'active' ? 'success' : 'danger'"
                size="small"
                effect="dark"
              >
                {{ row.status === 'active' ? '使用中' : '已停用' }}
              </el-tag>
            </div>
            <div class="card-body">
              <div class="info-row"><span>帳號:</span> {{ row.username }}</div>
              <div class="info-row"><span>部門:</span> {{ row.dept_name }}</div>
              <div class="info-row"><span>角色:</span> {{ formatRole(row.role) }}</div>
            </div>
            <div class="card-footer">
              <el-button size="small" @click="handleEdit(row)">編輯</el-button>
              <el-button
                size="small"
                :type="row.status === 'active' ? 'danger' : 'success'"
                plain
                @click="handleToggleStatus(row)"
              >
                {{ row.status === 'active' ? '停用' : '啟用' }}
              </el-button>
            </div>
          </div>
        </div>
        <el-empty v-if="userList.length === 0" description="暫無數據" />
      </div>

      <div class="pagination-wrapper">
        <el-pagination
          v-model:current-page="queryParams.page"
          v-model:page-size="queryParams.pageSize"
          :total="total"
          :page-sizes="[10, 20, 50]"
          :layout="pagiLayout"
          @size-change="getUserList"
          @current-change="getUserList"
        />
      </div>
    </el-card>

    <UserDialog v-model:visible="dialogVisible" :row-data="currentRow" @success="getUserList" />
  </div>
</template>

<style scoped>
/* 基礎佈局 */
.user-management {
  padding: 24px;
}

.el-card {
  border: none;
  background-color: var(--el-bg-color-overlay);
  box-shadow: var(--el-box-shadow-light);
  margin-bottom: 20px;
}

/* 篩選區域 */
.filter-form {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  width: 100%;
}

.filter-form :deep(.el-form-item) {
  margin-right: 10px;
  margin-bottom: 0;
}

.filter-inputs {
  display: flex;
  gap: 10px;
  flex-shrink: 0;
}

.op-btns {
  flex: 1;
  display: flex;
  align-items: center;
  margin-bottom: 0 !important;
  margin-right: 0 !important;
}

.btn-add {
  margin-left: auto !important;
}

.filter-select {
  width: 150px;
}

/* 電腦端表格居中 */
:deep(.table-header-center) {
  text-align: center !important;
  background-color: var(--el-fill-color-light) !important;
}

:deep(.table-cell-center) {
  text-align: center !important;
}

/* 卡片佈局 */
.card-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
  gap: 16px;
}

.user-item-card {
  background-color: var(--el-fill-color-blank);
  border: 1px solid var(--el-border-color-lighter);
  border-radius: 12px;
  padding: 18px;
  display: flex;
  flex-direction: column;
  transition:
    transform 0.2s,
    box-shadow 0.2s;
}

.user-item-card:hover {
  box-shadow: var(--el-box-shadow);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-bottom: 12px;
  border-bottom: 1px solid var(--el-border-color-extra-light);
  margin-bottom: 12px;
}

.card-header .name {
  font-size: 17px;
  font-weight: 600;
  color: var(--el-text-color-primary);
}

.card-body .info-row {
  font-size: 14px;
  line-height: 2;
  color: var(--el-text-color-regular);
}

.card-body .info-row span {
  color: var(--el-text-color-secondary);
  margin-right: 4px;
}

.card-footer {
  margin-top: auto;
  padding-top: 16px;
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}

.pagination-wrapper {
  margin-top: 24px;
  display: flex;
  justify-content: flex-end;
}

/* 平板和手機端優化 */
@media (max-width: 1023px) {
  .filter-form {
    flex-direction: column;
    align-items: flex-start;
  }
  .filter-inputs {
    width: 100%;
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 12px;
  }
  .filter-select {
    width: 100% !important;
  }
  .filter-form :deep(.el-form-item) {
    margin-right: 0;
    width: 100%;
    margin-bottom: 8px;
  }
  .op-btns {
    width: 100%;
    display: flex;
    justify-content: space-between;
    gap: 10px;
  }
  .op-btns :deep(.el-form-item__content) {
    width: 100%;
    display: flex;
    gap: 10px;
  }
  .op-btns .el-button {
    flex: 1;
    margin-left: 0 !important;
  }
  .pagination-wrapper {
    justify-content: center;
  }
}

/* 手機端優化 */
@media (max-width: 480px) {
  .user-management {
    padding: 2px;
  }
  .card-grid {
    grid-template-columns: 1fr;
  }
  .hidden-xs {
    display: none !important;
  }
  .btn-add {
    margin-left: 0 !important;
    flex: 1;
  }
}
</style>
