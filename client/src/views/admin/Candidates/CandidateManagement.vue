<script setup lang="ts">
import { ref, reactive, onMounted, computed } from 'vue';
import {
  Search,
  Plus,
  RefreshLeft,
  Document,
  View,
  Edit,
  Box,
  Calendar,
  ArrowRight,
} from '@element-plus/icons-vue';
import { getCandidatesListService, archiveCandidateService } from '@/api/candidate';
import { useSystemStore } from '@/stores';
import type { Candidate, CandidateQuery, CandidateStatus } from '@/types';

import CandidateDrawer from './components/CandidateDrawer.vue';
import ResumeDrawer from './components/ResumeDrawer.vue';
import CandidateInfoDialog from './components/CandidateInfoDialog.vue';
import InterviewDialog from './components/InterviewDialog.vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import { useRoute, useRouter } from 'vue-router';

// 基礎配置
const route = useRoute();
const router = useRouter();
const systemStore = useSystemStore();
const deptOptions = computed(() => systemStore.departments);
const sourceOptions = computed(() => systemStore.sources);
const hrOptions = computed(() => systemStore.hrOptions);

// 響應式佈局判斷
const isMobile = computed(() => window.innerWidth <= 1024);

// 載入狀態
const loading = ref(false);

// 狀態配置
interface StatusOption {
  label: string;
  value: CandidateStatus;
}
const statusOptions: StatusOption[] = [
  { label: '待處理', value: 'pending' },
  { label: '初步篩選', value: 'screening' },
  { label: '面試中', value: 'interviewing' },
  { label: '發放 Offer', value: 'offer' },
  { label: '已入職', value: 'hired' },
  { label: '不錄取', value: 'rejected' },
];
const getStatusType = (status: CandidateStatus): 'info' | '' | 'warning' | 'success' | 'danger' => {
  const map: Record<CandidateStatus, 'info' | '' | 'warning' | 'success' | 'danger'> = {
    pending: 'info',
    screening: '',
    interviewing: 'warning',
    offer: 'success',
    hired: 'success',
    rejected: 'danger',
  };
  return map[status] || 'info';
};

// 搜尋和分頁參數
const total = ref(0);
const queryParams = reactive<CandidateQuery>({
  page: 1,
  pageSize: 10,
  keyword: '',
  dept_id: undefined,
  source_id: undefined,
  status: undefined,
  hr_id: undefined,
});

// 獲取應徵者列表
interface CandidateItem extends Candidate {
  _expanded?: boolean;
}
const candidateList = ref<CandidateItem[]>([]);
const getCandidatesList = async () => {
  loading.value = true;
  try {
    const res = await getCandidatesListService(queryParams);
    if (res.success && res.data) {
      candidateList.value = res.data.list.map((item) => ({
        ...item,
        _expanded: false,
      }));
      total.value = res.total || 0;
    }
  } catch (err) {
    console.error('獲取列表失敗', err);
    ElMessage.error('獲取數據失敗');
  } finally {
    loading.value = false;
  }
};

// 封存應徵者
const handleArchive = async (row: Candidate) => {
  try {
    // 二次確認
    await ElMessageBox.confirm(
      `確定要將應徵者「${row.name}」移入人才庫封存嗎？封存後將不再顯示於此列表。`,
      '系統提示',
      {
        confirmButtonText: '確定封存',
        cancelButtonText: '取消',
        type: 'warning',
      },
    );
    loading.value = true;
    await archiveCandidateService(row.id);
    ElMessage.success('已成功封存');
    getCandidatesList();
  } catch (error) {
    if (error !== 'cancel') {
      console.error('封存失敗', error);
      ElMessage.error('封存操作失敗');
    }
  } finally {
    loading.value = false;
  }
};

// 搜索
const handleQuery = () => {
  // 搜尋時必須重置回第一頁
  queryParams.page = 1;
  getCandidatesList();
};

// 重置
const handleReset = () => {
  Object.assign(queryParams, {
    page: 1,
    keyword: '',
    dept_id: undefined,
    source_id: undefined,
    status: undefined,
    hr_id: undefined,
  });
  router.replace({ query: {} });
  getCandidatesList();
};

// 彈窗相關
const drawerVisible = ref(false);
const currentRow = ref({});
const interviewVisible = ref(false);
const selectedCandidate = ref<Candidate | undefined>(undefined);

// 彈窗1：新增/編輯應徵者
const handleAdd = () => {
  currentRow.value = {};
  drawerVisible.value = true;
};
const handleEdit = (row: Candidate) => {
  currentRow.value = { ...row };
  drawerVisible.value = true;
};

// 彈窗2：建立面試:
const handleAddInterview = (row: Candidate) => {
  selectedCandidate.value = row;
  interviewVisible.value = true;
};

// 彈窗3：查看履歷
const resumePreviewVisible = ref(false);
const previewUrl = ref('');
const handleViewResume = (url: string | null) => {
  if (!url) return ElMessage.warning('該應徵者未上傳履歷');
  previewUrl.value = url;
  resumePreviewVisible.value = true;
};

// 彈窗4：查看詳情
const currentId = ref<string | undefined>(undefined);
const infoVisible = ref(false);
const handleViewDetail = async (id: string) => {
  currentId.value = id;
  infoVisible.value = true;
};

// 初始化挂載
onMounted(async () => {
  loading.value = true;
  try {
    await systemStore.fetchAllOptions();
    // 儀表板參數跳轉
    if (route.query.hrId) {
      queryParams.hr_id = route.query.hrId as string;
    }
    getCandidatesList();
  } catch (error) {
    console.error('初始化失敗', error);
  } finally {
    loading.value = false;
  }
});
</script>

<template>
  <div class="candidate-management">
    <el-card class="filter-card">
      <el-form :inline="true" :model="queryParams" class="responsive-search">
        <el-form-item label="關鍵字" class="item-keyword">
          <el-input
            v-model="queryParams.keyword"
            placeholder="姓名 / 職位"
            clearable
            @keyup.enter="handleQuery"
          />
        </el-form-item>

        <div class="filter-grid">
          <el-form-item label="部門">
            <el-select v-model="queryParams.dept_id" placeholder="選擇部門" clearable>
              <el-option
                v-for="item in deptOptions"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="來源">
            <el-select v-model="queryParams.source_id" placeholder="選擇來源" clearable>
              <el-option
                v-for="item in sourceOptions"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="狀態">
            <el-select v-model="queryParams.status" placeholder="人才階段" clearable>
              <el-option
                v-for="item in statusOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="負責 HR">
            <el-select v-model="queryParams.hr_id" placeholder="全部" clearable>
              <el-option
                v-for="item in hrOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
        </div>

        <el-form-item class="item-btns">
          <el-button type="primary" @click="handleQuery"
            ><el-icon><Search /></el-icon>查詢</el-button
          >
          <el-button @click="handleReset"
            ><el-icon><RefreshLeft /></el-icon>重置</el-button
          >
          <el-button type="success" @click="handleAdd" class="btn-add-full"
            ><el-icon><Plus /></el-icon>新增應徵者</el-button
          >
        </el-form-item>
      </el-form>
    </el-card>

    <el-card class="table-card desktop-only" style="margin-top: 20px">
      <el-table v-loading="loading" :data="candidateList" border stripe align="center">
        <el-table-column prop="name" label="姓名" />
        <el-table-column prop="position_name" label="應徵職位" />
        <el-table-column prop="dept_name" label="部門" />
        <el-table-column prop="source_name" label="來源" />
        <el-table-column prop="hr_name" label="負責 HR" />
        <el-table-column label="狀態" width="100">
          <template #default="{ row }">
            <el-tag :type="getStatusType(row.status)" effect="light">
              {{ statusOptions.find((opt) => opt.value === row.status)?.label || row.status }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="履歷" width="100">
          <template #default="{ row }">
            <el-link v-if="row.resume_url" type="primary" @click="handleViewResume(row.resume_url)">
              <el-icon><Document /></el-icon> 查看
            </el-link>
            <span v-else>-</span>
          </template>
        </el-table-column>
        <el-table-column prop="createAt" label="投遞時間" width="180">
          <template #default="{ row }">{{
            row.createAt ? row.createAt.slice(0, 10) : '-'
          }}</template>
        </el-table-column>
        <el-table-column label="操作" fixed="right" width="180">
          <template #default="{ row }">
            <el-tooltip content="查看詳情" placement="top"
              ><el-button link type="primary" :icon="View" @click="handleViewDetail(row.id)"
            /></el-tooltip>
            <el-tooltip content="安排面試" placement="top"
              ><el-button link type="success" :icon="Calendar" @click="handleAddInterview(row)"
            /></el-tooltip>
            <el-tooltip content="編輯資料" placement="top"
              ><el-button link type="primary" :icon="Edit" @click="handleEdit(row)"
            /></el-tooltip>
            <el-tooltip content="封存應徵者" placement="top"
              ><el-button link type="danger" :icon="Box" @click="handleArchive(row)"
            /></el-tooltip>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <div class="mobile-only mobile-list-container" style="margin-top: 10px">
      <div
        v-for="item in candidateList"
        :key="item.id"
        class="m-card"
        :class="`m-status-${item.status}`"
      >
        <div class="m-card-header" @click="item._expanded = !item._expanded">
          <div class="m-title">
            <span class="m-name">{{ item.name }}</span>
            <span class="m-pos">{{ item.position_name }}</span>
          </div>
          <div class="m-right">
            <el-tag :type="getStatusType(item.status)" size="small">{{
              statusOptions.find((o) => o.value === item.status)?.label
            }}</el-tag>
            <el-icon class="m-arrow" :class="{ 'is-rotated': item._expanded }"
              ><ArrowRight
            /></el-icon>
          </div>
        </div>
        <el-collapse-transition>
          <div v-show="item._expanded" class="m-card-content">
            <div class="m-detail-grid">
              <div class="m-row"><span>部門：</span>{{ item.dept_name }}</div>
              <div class="m-row"><span>來源：</span>{{ item.source_name }}</div>
              <div class="m-row"><span>負責 HR：</span>{{ item.hr_name }}</div>
              <div class="m-row"><span>投遞時間：</span>{{ item.createAt?.slice(0, 10) }}</div>
            </div>
            <div class="m-actions">
              <el-button
                v-if="item.resume_url"
                type="primary"
                link
                @click="handleViewResume(item.resume_url)"
                ><el-icon><Document /></el-icon> 查看履歷</el-button
              >
              <div class="m-btn-group">
                <el-button circle :icon="View" @click="handleViewDetail(item.id)" />
                <el-button
                  circle
                  type="success"
                  :icon="Calendar"
                  @click="handleAddInterview(item)"
                />
                <el-button circle type="primary" :icon="Edit" @click="handleEdit(item)" />
                <el-button circle type="danger" :icon="Box" @click="handleArchive(item)" />
              </div>
            </div>
          </div>
        </el-collapse-transition>
      </div>
    </div>

    <div class="pagination-container">
      <el-pagination
        v-model:current-page="queryParams.page"
        v-model:page-size="queryParams.pageSize"
        :total="total"
        :page-sizes="[10, 20, 50]"
        :layout="isMobile ? 'total, prev, pager, next' : 'total, sizes, prev, pager, next, jumper'"
        @change="getCandidatesList"
      />
    </div>
  </div>
  <!-- 新增/編輯抽屜 -->
  <CandidateDrawer v-model="drawerVisible" :data="currentRow" @refresh="getCandidatesList" />
  <!-- 履歷預覽抽屜 -->
  <ResumeDrawer v-model="resumePreviewVisible" :url="previewUrl" />
  <!-- 應徵者詳情彈窗 -->
  <CandidateInfoDialog v-model="infoVisible" :id="currentId" />
  <!-- 安排面試彈窗 -->
  <InterviewDialog
    v-model="interviewVisible"
    :candidate="selectedCandidate"
    @refresh="getCandidatesList"
  />
</template>

<style scoped>
.candidate-management {
  padding: 20px;
  background-color: var(--el-bg-color-page);
  min-height: 100vh;
}
.filter-card {
  background-color: var(--el-bg-color-overlay);
  border: 1px solid var(--el-border-color-light);
}
.pagination-container {
  margin-top: 20px;
  display: flex;
  justify-content: flex-end;
}

/* 平板和手機共用樣式 */
@media (max-width: 1024px) {
  .desktop-only {
    display: none;
  }
  .filter-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    margin-bottom: 0px;
  }
  .item-btns {
    width: 100%;
    display: flex;
    justify-content: space-between;
    margin-right: 0 !important;
    margin-bottom: 0 !important;
  }
  .item-btns .el-button {
    flex: 1;
  }

  /* 卡片區域 */
  .m-card {
    background-color: var(--el-bg-color-overlay);
    border: 1px solid var(--el-border-color-lighter);
    border-radius: 8px;
    margin-bottom: 12px;
    border-left: 5px solid var(--el-border-color);
    overflow: hidden;
  }
  .m-status-pending {
    border-left-color: var(--el-color-info);
  }
  .m-status-screening {
    border-left-color: var(--el-color-primary);
  }
  .m-status-interviewing {
    border-left-color: var(--el-color-warning);
  }
  .m-status-offer,
  .m-status-hired {
    border-left-color: var(--el-color-success);
  }
  .m-status-rejected {
    border-left-color: var(--el-color-danger);
  }
  .m-card-header {
    padding: 12px;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .m-title {
    display: flex;
    flex-direction: column;
  }
  .m-name {
    font-size: 16px;
    font-weight: bold;
    color: var(--el-text-color-primary);
  }
  .m-pos {
    font-size: 12px;
    color: var(--el-text-color-secondary);
  }
  .m-arrow {
    transition: transform 0.3s;
    color: var(--el-text-color-placeholder);
  }
  .m-arrow.is-rotated {
    transform: rotate(90deg);
  }
  .m-card-content {
    padding: 0 12px 12px;
    border-top: 1px solid var(--el-border-color-extra-light);
  }
  .m-detail-grid {
    padding: 10px 0;
    font-size: 13px;
    color: var(--el-text-color-regular);
  }
  .m-row span {
    color: var(--el-text-color-secondary);
  }
  .m-actions {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 10px;
  }
  .m-btn-group {
    display: flex;
    gap: 8px;
  }
}

/* 平板端優化 */
@media (min-width: 760px) and (max-width: 1024px) {
  .candidate-management {
    padding: 5px;
  }
  .item-keyword {
    width: 100% !important;
    margin-right: 0 !important;
  }
  .btn-add-full {
    margin-top: 0 !important;
  }
  /* 平板卡片 */
  .mobile-list-container {
    display: grid;
    gap: 12px;
    grid-template-columns: 1fr 1fr !important;
  }
}

/* 手機端優化 */
@media (max-width: 759px) {
  .candidate-management {
    padding: 2px;
  }
  .filter-card :deep(.el-card__body) {
    padding: 15px !important;
  }
  .filter-grid :deep(.el-form-item) {
    margin-right: 10px !important;
  }
  .filter-form :deep(.el-form-item) {
    margin-bottom: 8px !important;
  }
  .item-keyword {
    width: 100% !important;
    margin-right: 0 !important;
  }
  .btn-add-full {
    margin-top: 10px;
    width: 100%;
  }

  /* 手機卡片 */
  .mobile-list-container {
    display: grid !important;
    grid-template-columns: 1fr;
  }
}

/* 桌面端優化 */
@media (min-width: 1025px) {
  .mobile-only {
    display: none;
  }

  .responsive-search {
    display: flex;
    flex-wrap: wrap;
    align-items: flex-end;
    gap: 10px;
  }
  .item-keyword {
    width: 220px;
    margin-right: 0px !important;
  }
  .filter-grid {
    display: flex;
    gap: 10px;
  }
  .filter-grid :deep(.el-form-item) {
    margin-right: 0;
  }
  .filter-grid :deep(.el-select) {
    width: 160px;
  }
  .item-btns {
    margin-left: auto;
    white-space: nowrap;
  }
  /* 表格內容置中 */
  .table-card.desktop-only .el-table .el-table__cell {
    text-align: center !important;
  }
  .table-card.desktop-only :deep(.el-table .cell) {
    text-align: center !important;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .table-card.desktop-only :deep(.el-table th.el-table__cell) {
    text-align: center !important;
  }
}
</style>
