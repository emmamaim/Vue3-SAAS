<script setup>
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
} from '@element-plus/icons-vue';
import { getCandidatesListService, archiveCandidateService } from '@/api/candidate';
import { useSystemStore } from '@/stores';
import CandidateDrawer from './components/CandidateDrawer.vue';
import ResumeDrawer from './components/ResumeDrawer.vue';
import CandidateInfoDialog from './components/CandidateInfoDialog.vue';
import InterviewDialog from './components/InterviewDialog.vue';
import { ElMessage, ElMessageBox } from 'element-plus';

const systemStore = useSystemStore();
const deptOptions = computed(() => systemStore.departments);
const sourceOptions = computed(() => systemStore.sources);
const hrOptions = computed(() => systemStore.hrOptions);
// 響應式數據
const loading = ref(false);
const candidateList = ref([]);
const total = ref(0);
const drawerVisible = ref(false);
const currentRow = ref({});
const interviewVisible = ref(false);
const selectedCandidate = ref(null);
// 搜尋和分頁參數
const queryParams = reactive({
  page: 1,
  pageSize: 10,
  keyword: '',
  dept_id: '',
  source_id: '',
  status: '',
  hr_id: '',
});
const statusOptions = [
  { label: '待處理', value: 'pending' },
  { label: '初步篩選', value: 'screening' },
  { label: '面試中', value: 'interviewing' },
  { label: '發放 Offer', value: 'offer' },
  { label: '已入職', value: 'hired' },
  { label: '不錄取', value: 'rejected' },
];
// 獲取應徵者列表
const getCandidatesList = async () => {
  loading.value = true;
  try {
    const res = await getCandidatesListService({ ...queryParams });
    candidateList.value = res.data.list;
    total.value = res.data.total;
  } catch (err) {
    console.error(err);
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
  queryParams.keyword = '';
  queryParams.dept_id = '';
  queryParams.source_id = '';
  queryParams.status = '';
  queryParams.hr_id = '';
  queryParams.page = 1;
  getCandidatesList();
};
// 新增與編輯應徵者 => 打開抽屜
const handleAdd = () => {
  currentRow.value = {};
  drawerVisible.value = true;
};
const handleEdit = (row) => {
  currentRow.value = { ...row };
  drawerVisible.value = true;
};
// 建立面試 => 打開彈窗
const handleAddInterview = (row) => {
  selectedCandidate.value = {
    id: row.id,
    name: row.name,
    dept_id: row.dept_id,
  };
  interviewVisible.value = true;
};
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
// 初始化挂載
onMounted(async () => {
  await systemStore.fetchAllOptions();
  getCandidatesList();
});
// 查看履歷
const resumePreviewVisible = ref(false);
const previewUrl = ref('');
const handleViewResume = (url) => {
  if (!url) return ElMessage.warning('該應徵者未上傳履歷');
  previewUrl.value = url;
  resumePreviewVisible.value = true;
};
// 查看詳情
const currentId = ref(null);
const infoVisible = ref(false);
const handleViewDetail = async (id) => {
  currentId.value = id;
  infoVisible.value = true;
};
// 封存應徵者
const handleArchive = async (row) => {
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
</script>
<template>
  <div class="candidate-management">
    <!-- 搜索與篩選區域 -->
    <el-card class="filter-card">
      <el-form :inline="true" :model="queryParams">
        <el-form-item label="關鍵字">
          <el-input v-model="queryParams.keyword" placeholder="姓名 / 職位" clearable @keyup.enter="handleQuery" />
        </el-form-item>
        <el-form-item label="部門">
          <el-select v-model="queryParams.dept_id" placeholder="選擇部門" clearable style="width: 140px">
            <el-option v-for="item in deptOptions" :key="item.id" :label="item.name" :value="item.id" />
          </el-select>
        </el-form-item>
        <el-form-item label="來源">
          <el-select v-model="queryParams.source_id" placeholder="選擇來源" clearable style="width: 140px">
            <el-option v-for="item in sourceOptions" :key="item.id" :label="item.name" :value="item.id" />
          </el-select>
        </el-form-item>
        <el-form-item label="狀態">
          <el-select v-model="queryParams.status" placeholder="人才階段" clearable style="width: 140px">
            <el-option v-for="item in statusOptions" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="負責 HR">
          <el-select v-model="queryParams.hr_id" placeholder="全部" clearable style="width: 140px">
            <el-option v-for="item in hrOptions" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleQuery">
            <el-icon>
              <Search />
            </el-icon>
            查詢
          </el-button>
          <el-button @click="handleReset">
            <el-icon>
              <RefreshLeft />
            </el-icon>
            重置
          </el-button>
          <el-button type="success" @click="handleAdd">
            <el-icon>
              <Plus />
            </el-icon>
            新增應徵者
          </el-button>
        </el-form-item>
      </el-form>
    </el-card>
    <!-- 表格展示區域 -->
    <el-card class="table-card" style="margin-top: 20px">
      <el-table v-loading="loading" :data="candidateList" border stripe align="center"
        :cell-style="{ textAlign: 'center' }" :header-cell-style="{ textAlign: 'center' }">
        <el-table-column prop="name" label="姓名" />
        <el-table-column prop="position_name" label="應徵職位" />
        <el-table-column prop="dept_name" label="部門" />
        <el-table-column prop="source_name" label="來源" />
        <el-table-column prop="hr_name" label="負責 HR" />
        <el-table-column label="狀態" width="100">
          <template #default="{ row }">
            <el-tag :type="getStatusType(row.status)" effect="light">
              {{statusOptions.find((opt) => opt.value === row.status)?.label || row.status}}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="履歷" width="100">
          <template #default="{ row }">
            <el-link v-if="row.resume_url" type="primary" @click="handleViewResume(row.resume_url)">
              <el-icon>
                <Document />
              </el-icon>
              查看
            </el-link>
            <span v-else>-</span>
          </template>
        </el-table-column>
        <el-table-column prop="createAt" label="投遞時間" width="180">
          <template #default="{ row }">
            {{ row.createAt ? row.createAt.slice(0, 10) : '-' }}
          </template>
        </el-table-column>
        <el-table-column label="操作" fixed="right" width="180">
          <template #default="{ row }">
            <el-tooltip content="查看詳情" placement="top">
              <el-button link type="primary" :icon="View" @click="handleViewDetail(row.id)" />
            </el-tooltip>
            <el-tooltip content="安排面試" placement="top">
              <el-button link type="success" :icon="Calendar" @click="handleAddInterview(row)" />
            </el-tooltip>
            <el-tooltip content="編輯資料" placement="top">
              <el-button link type="primary" :icon="Edit" @click="handleEdit(row)" />
            </el-tooltip>
            <el-tooltip content="封存應徵者" placement="top">
              <el-button link type="danger" :icon="Box" @click="handleArchive(row)" />
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>

      <div class="pagination-container">
        <el-pagination v-model:current-page="queryParams.page" v-model:page-size="queryParams.pageSize" :total="total"
          :page-sizes="[10, 20, 50]" layout="total, sizes, prev, pager, next, jumper" @change="getCandidatesList" />
      </div>
    </el-card>
  </div>
  <!-- 新增/編輯抽屜 -->
  <CandidateDrawer v-model="drawerVisible" :data="currentRow" @refresh="getCandidatesList" />
  <!-- 履歷預覽抽屜 -->
  <ResumeDrawer v-model="resumePreviewVisible" :url="previewUrl" />
  <!-- 應徵者詳情彈窗 -->
  <CandidateInfoDialog v-model="infoVisible" :id="currentId" />
  <!-- 安排面試彈窗 -->
  <InterviewDialog v-model="interviewVisible" :candidate="selectedCandidate" @refresh="getCandidatesList" />
</template>

<style scoped>
.candidate-management {
  padding: 20px;
}

.pagination-container {
  margin-top: 20px;
  display: flex;
  justify-content: flex-end;
}

.filter-card {
  background-color: #f8f9fa;
}

.no-preview {
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #f5f7fa;
  border-radius: 8px;
  margin: 10px;
}

iframe {
  border-radius: 4px;
  border: 1px solid #dcdfe6;
}
</style>
