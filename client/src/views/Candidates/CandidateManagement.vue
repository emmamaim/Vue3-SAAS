<script setup>
import { ref, reactive, onMounted, computed } from 'vue';
import { Search, Plus, RefreshLeft, Document } from '@element-plus/icons-vue';
import { getCandidatesListService, getCandidateInfoService, archiveCandidateService } from '@/api/candidate';
import { useSystemStore } from '@/stores';
import CandidateDrawer from './components/CandidateDrawer.vue';
import { ElMessage, ElMessageBox } from 'element-plus';
const systemStore = useSystemStore();
// 響應式數據
const deptOptions = computed(() => systemStore.departments);
const sourceOptions = computed(() => systemStore.sources);
const hrOptions = computed(() => systemStore.hrOptions);

const loading = ref(false);
const candidateList = ref([]);
const total = ref(0);
const drawerVisible = ref(false);
const currentRow = ref({});
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
// 搜索與重置
const handleQuery = () => {
  // 搜尋時必須重置回第一頁
  queryParams.page = 1;
  getCandidatesList();
};
const handleReset = () => {
  queryParams.keyword = '';
  queryParams.dept_id = '';
  queryParams.source_id = '';
  queryParams.status = '';
  queryParams.hr_id = '';
  queryParams.page = 1;
  getCandidatesList();
};

// 新增與編輯 => 打開抽屜
const handleAdd = () => {
  currentRow.value = {};
  drawerVisible.value = true;
};
const handleEdit = (row) => {
  currentRow.value = { ...row };
  drawerVisible.value = true;
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
  if (!url) return ElMessage.warning('無檔案');
  previewUrl.value = url;
  resumePreviewVisible.value = true;
};
// 專門處理 Word 下載的函數
const downloadFile = () => {
  const link = document.createElement('a');
  link.href = `http://localhost:3000${previewUrl.value}`;
  link.setAttribute('download', '');
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
// 查看詳情
const infoVisible = ref(false);
const candidateDetail = ref({});
const handleViewDetail = async (id) => {
  try {
    const res = await getCandidateInfoService(id);
    if (res.success) {
      candidateDetail.value = res.data;
      infoVisible.value = true;
    }
  } catch (error) {
    ElMessage.error(error.message);
  }

}
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
      }
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
}
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
            </el-icon> 查詢
          </el-button>
          <el-button @click="handleReset">
            <el-icon>
              <RefreshLeft />
            </el-icon> 重置
          </el-button>
          <el-button type="success" @click="handleAdd">
            <el-icon>
              <Plus />
            </el-icon> 新增應徵者
          </el-button>
        </el-form-item>
      </el-form>
    </el-card>
    <!-- 表格展示區域 -->
    <el-card class="table-card" style="margin-top: 20px">
      <el-table v-loading="loading" :data="candidateList" border stripe>
        <el-table-column prop="name" label="姓名" width="100" />
        <el-table-column prop="position_name" label="應徵職位" width="150" />
        <el-table-column prop="dept_name" label="部門" width="120" />
        <el-table-column prop="source_name" label="來源" width="120" />
        <el-table-column prop="hr_name" label="負責 HR" width="120" />
        <el-table-column label="狀態" width="120" align="center">
          <template #default="{ row }">
            <el-tag :type="getStatusType(row.status)" effect="light">
              {{statusOptions.find((opt) => opt.value === row.status)?.label || row.status}}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="履歷" width="100" align="center">
          <template #default="{ row }">
            <el-link v-if="row.resume_url" type="primary" @click="handleViewResume(row.resume_url)">
              <el-icon>
                <Document />
              </el-icon> 查看
            </el-link>
            <span v-else>-</span>
          </template>
        </el-table-column>
        <el-table-column prop="createAt" label="投遞時間" width="180">
          <template #default="{ row }">
            {{ row.createAt ? row.createAt.slice(0, 10) : '-' }}
          </template>
        </el-table-column>
        <el-table-column label="操作" fixed="right" min-width="120">
          <template #default="{ row }">
            <el-button link type="primary" @click="handleViewDetail(row.id)">詳情</el-button>
            <el-button link type="primary" @click="handleEdit(row)">編輯</el-button>
            <el-button link type="danger" @click="handleArchive(row)">封存</el-button>
          </template>
        </el-table-column>
      </el-table>

      <div class="pagination-container">
        <el-pagination v-model:current-page="queryParams.page" v-model:page-size="queryParams.pageSize" :total="total"
          :page-sizes="[10, 20, 50]" layout="total, sizes, prev, pager, next, jumper" @change="getCandidatesList" />
      </div>
    </el-card>

    <!-- 新增/編輯抽屜 -->
    <CandidateDrawer v-model="drawerVisible" :data="currentRow" @refresh="getCandidatesList" />
  </div>

  <!-- 履歷預覽抽屜 -->
  <el-drawer v-model="resumePreviewVisible" title="履歷預覽" size="50%" destroy-on-close>
    <div v-if="previewUrl" style="height: 100%; display: flex; flex-direction: column">
      <iframe v-if="previewUrl.toLowerCase().endsWith('.pdf')" :src="`http://localhost:3000${previewUrl}`" width="100%"
        height="100%" frameborder="0"></iframe>

      <div v-else class="no-preview">
        <el-result icon="info" title="該格式不支援線上預覽" sub-title="Word 檔案需下載後使用 Office 軟體查看">
          <template #extra>
            <el-button type="primary" @click="downloadFile">立即下載</el-button>
          </template>
        </el-result>
      </div>
    </div>
  </el-drawer>
  <!-- 應徵者詳情彈窗 -->
  <el-dialog v-model="infoVisible" title="人才詳細資訊" width="600px">
    <el-descriptions :column="2" border>
      <el-descriptions-item label="姓名">{{ candidateDetail.name }}</el-descriptions-item>
      <el-descriptions-item label="狀態">
        <el-tag :type="getStatusType(candidateDetail.status)">{{ candidateDetail.status }}</el-tag>
      </el-descriptions-item>
      <el-descriptions-item label="應徵職位">{{ candidateDetail.position_name }}</el-descriptions-item>
      <el-descriptions-item label="人才來源">{{ candidateDetail.source_name }}</el-descriptions-item>
      <el-descriptions-item label="電子郵件" :span="2">{{ candidateDetail.email }}</el-descriptions-item>
      <el-descriptions-item label="聯絡電話" :span="2">{{ candidateDetail.phone }}</el-descriptions-item>
    </el-descriptions>

    <h4 style="margin: 20px 0 10px">面試紀錄</h4>
    <el-timeline v-if="candidateDetail.interviews?.length">
      <el-timeline-item v-for="(item, index) in candidateDetail.interviews" :key="index" :timestamp="item.date"
        placement="top">
        <el-card>
          <p><strong>第 {{ item.interview_round }} 輪面試</strong> (面試官: {{ item.interviewer_name }})</p>
          <p>結果：{{ item.status }} | 評分：{{ item.rating }}</p>
          <p v-if="item.comments">評語：{{ item.comments }}</p>
        </el-card>
      </el-timeline-item>
    </el-timeline>
    <el-empty v-else description="暫無面試紀錄" :image-size="60" />
  </el-dialog>
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
