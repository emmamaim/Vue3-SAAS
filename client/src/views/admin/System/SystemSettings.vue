<script setup>
import { ref, computed, onMounted } from 'vue';
import {
  OfficeBuilding,
  Suitcase,
  Filter,
  Files,
  Plus,
  Delete,
  Check,
} from '@element-plus/icons-vue';
import {
  getSystemSettingsService,
  saveSystemSettingService,
  deleteSystemSettingService,
} from '@/api/system';
import { ElMessage, ElMessageBox } from 'element-plus';
import { useSystemStore } from '@/stores';

const systemStore = useSystemStore();

// 響應式狀態
const activeTab = ref('departments');
const selectedId = ref(null);
const listData = ref([]);
const loading = ref(false);
const submitLoading = ref(false);

// 表單
const editForm = ref({});

// 導航卡片配置
const tabs = [
  { id: 'departments', label: '部門管理', icon: OfficeBuilding, color: '#409EFF' },
  { id: 'jobs', label: '職位清單', icon: Suitcase, color: '#67C23A' },
  { id: 'categories', label: '職位類別', icon: Files, color: '#E6A23C' },
  { id: 'sources', label: '人才來源', icon: Filter, color: '#F56C6C' },
];

// 獲取數據
const fetchList = async (type = activeTab.value) => {
  loading.value = true;
  try {
    const res = await getSystemSettingsService(type);
    let rawData = res.data || [];

    if (type === 'jobs') {
      rawData = rawData.map((item) => ({
        ...item,
        name: item.job_name,
        desc: item.description,
      }));
    } else if (type === 'departments') {
      rawData = rawData.map((item) => ({
        ...item,
        desc: item.description,
      }));
    } else if (type === 'sources') {
      rawData = rawData.map((item) => ({
        ...item,
        name: item.name,
        type:
          item.type === 'Internal' ? '內部推薦' : item.type === 'Campus' ? '校園招聘' : '外部管道',
      }));
    }

    listData.value = rawData;

    // 默認選中第一項
    if (listData.value.length > 0) {
      selectItem(listData.value[0]);
    } else {
      selectedId.value = null;
      editForm.value = {};
    }
  } catch {
    ElMessage.error('獲取資料失敗');
  } finally {
    loading.value = false;
  }
};

// 選中項目並深拷貝到編輯表單
const selectItem = (item) => {
  selectedId.value = item.id;
  editForm.value = JSON.parse(JSON.stringify(item));
};

// 切換TAB
const handleTabChange = (id) => {
  activeTab.value = id;
  fetchList(id);
};

// 儲存
const handleSave = async () => {
  if (!editForm.value.name) {
    return ElMessage.warning('請輸入名稱');
  }
  submitLoading.value = true;

  let payload = { ...editForm.value };

  if (activeTab.value === 'jobs') {
    payload = {
      ...editForm.value,
      job_name: editForm.value.name,
      description: editForm.value.desc,
    };
  } else if (activeTab.value === 'departments') {
    payload = {
      ...editForm.value,
      description: editForm.value.desc,
    };
  } else if (activeTab.value === 'sources') {
    const typeMapping = {
      內部推薦: 'Internal',
      外部管道: 'External',
      校園招聘: 'Campus',
    };
    payload = {
      id: editForm.value.id,
      name: editForm.value.name,
      type: typeMapping[editForm.value.type] || 'External',
    };
    // 確保不帶desc字段
    delete payload.desc;
  }
  try {
    await saveSystemSettingService(activeTab.value, payload);
    ElMessage.success('儲存成功');
    // 儲存成功後刷新全域 Store 選項
    await systemStore.refreshOptions();
    fetchList(activeTab.value);
  } catch {
    ElMessage.error('儲存失敗');
  } finally {
    submitLoading.value = false;
  }
};

// 刪除
const handleDelete = async () => {
  try {
    await ElMessageBox.confirm('確定要刪除此配置嗎？這可能會影響相關聯的數據。', '警告', {
      confirmButtonText: '確定',
      cancelButtonText: '取消',
      type: 'warning',
    });
    await deleteSystemSettingService(activeTab.value, selectedId.value);
    ElMessage.success('刪除成功');
    await systemStore.refreshOptions();
    fetchList();
  } catch {
    // 使用者取消刪除
  }
};

// 新增配置
const handleAdd = () => {
  selectedId.value = 'new';
  // 基礎欄位
  const baseForm = {
    name: '',
    desc: '',
    job_name: '',
    description: '',
  };
  if (activeTab.value === 'departments') {
    editForm.value = { ...baseForm, manager_id: null };
  } else if (activeTab.value === 'sources') {
    editForm.value = { ...baseForm, type: '外部管道' };
  } else if (activeTab.value === 'jobs') {
    editForm.value = { ...baseForm, category_id: null };
  } else {
    editForm.value = baseForm;
  }
};

// 初始化載入
onMounted(async () => {
  // 先載入全域選項再獲取列表
  await systemStore.fetchAllOptions();
  fetchList();
});

// 下拉選單選項
const interviewerOptions = computed(() => systemStore.interviewerOptions);

// 計算當前選中項目
const currentItem = computed(() => {
  if (selectedId.value === 'new') {
    return { name: '新增項目', id: 'new' };
  }
  return listData.value.find((i) => i.id === selectedId.value) || null;
});
</script>

<template>
  <div class="system-container" v-loading="loading">
    <el-row :gutter="20" class="top-nav-row">
      <el-col :xs="12" :sm="12" :md="6" v-for="tab in tabs" :key="tab.id">
        <div
          :class="['nav-card', { active: activeTab === tab.id }]"
          @click="handleTabChange(tab.id)"
        >
          <div
            class="icon-box"
            :style="{
              backgroundColor: activeTab === tab.id ? tab.color : 'var(--el-fill-color-darker)',
            }"
          >
            <el-icon
              :style="{ color: activeTab === tab.id ? '#fff' : 'var(--el-text-color-secondary)' }"
            >
              <component :is="tab.icon" />
            </el-icon>
          </div>

          <span class="label">{{ tab.label }}</span>

          <div class="active-dot" v-if="activeTab === tab.id"></div>
        </div>
      </el-col>
    </el-row>

    <el-row :gutter="20" class="main-body-row">
      <el-col :xs="24" :sm="10" :md="8" :lg="6" class="content-col">
        <div class="glass-module list-module">
          <div class="module-header">
            <span>{{ tabs.find((t) => t.id === activeTab).label }}列表</span>

            <el-button type="primary" :icon="Plus" circle size="small" @click="handleAdd" />
          </div>

          <el-scrollbar>
            <div class="card-list" v-if="listData.length > 0">
              <div
                v-for="item in listData"
                :key="item.id"
                :class="['mini-item-card', { active: selectedId === item.id }]"
                @click="selectItem(item)"
              >
                <div class="info">
                  <div class="name">{{ item.name }}</div>

                  <div class="sub">
                    {{
                      item.manager_name || item.manager || item.category || item.type || '系統配置'
                    }}
                  </div>
                </div>

                <el-icon v-if="selectedId === item.id" color="#409EFF"><Check /></el-icon>
              </div>
            </div>

            <el-empty v-else description="暫無數據" :image-size="60" />
          </el-scrollbar>
        </div>
      </el-col>

      <el-col :xs="24" :sm="14" :md="16" :lg="18" class="content-col">
        <div class="glass-module detail-module">
          <template v-if="selectedId">
            <div class="detail-header">
              <div class="header-info">
                <h2>{{ selectedId === 'new' ? '新增項目' : currentItem.name }}</h2>

                <el-tag v-if="selectedId !== 'new'" size="small" effect="plain"
                  >ID: {{ selectedId }}</el-tag
                >
              </div>

              <el-button
                v-if="selectedId !== 'new'"
                type="danger"
                link
                :icon="Delete"
                @click="handleDelete"
                >刪除</el-button
              >
            </div>

            <el-form label-position="top" class="edit-form">
              <el-row :gutter="20">
                <el-col :span="24" :md="12">
                  <el-form-item label="名稱" required>
                    <el-input v-model="editForm.name" placeholder="例如：研發部門、104人力銀行" />
                  </el-form-item>
                </el-col>

                <el-col :span="24" :md="12" v-if="activeTab === 'departments'">
                  <el-form-item label="部門負責人">
                    <el-select
                      v-model="editForm.manager_id"
                      placeholder="請選擇負責人"
                      filterable
                      style="width: 100%"
                    >
                      <el-option
                        v-for="item in interviewerOptions"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value"
                      />
                    </el-select>
                  </el-form-item>
                </el-col>

                <el-col :span="24" :md="12" v-if="activeTab === 'sources'">
                  <el-form-item label="管道類型">
                    <el-select v-model="editForm.type" style="width: 100%">
                      <el-option label="外部管道" value="外部管道" />

                      <el-option label="內部推薦" value="內部推薦" />

                      <el-option label="校園招聘" value="校園招聘" />
                    </el-select>
                  </el-form-item>
                </el-col>

                <el-col :span="24" :md="12" v-if="activeTab === 'jobs'">
                  <el-form-item label="職位類別">
                    <el-select v-model="editForm.category_id" style="width: 100%">
                      <el-option
                        v-for="cat in systemStore.job_categories"
                        :key="cat.id"
                        :label="cat.name"
                        :value="cat.id"
                      />
                    </el-select>
                  </el-form-item>
                </el-col>
              </el-row>

              <el-form-item label="詳細描述/備註" v-if="activeTab !== 'sources'">
                <el-input
                  v-model="editForm.desc"
                  type="textarea"
                  :rows="6"
                  resize="none"
                  placeholder="請輸入說明資訊..."
                />
              </el-form-item>

              <div class="btn-group">
                <el-button type="primary" size="large" :loading="submitLoading" @click="handleSave">
                  {{ selectedId === 'new' ? '立即創建' : '儲存更變' }}
                </el-button>

                <el-button size="large" @click="selectedId = null" v-if="selectedId === 'new'"
                  >取消</el-button
                >
              </div>
            </el-form>
          </template>

          <div v-else class="empty-state">
            <el-empty description="請從左側列表選擇一個項目，或點擊 '+' 新增" />
          </div>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<style scoped>
.system-container {
  height: calc(100vh - 120px);
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.top-nav-row {
  flex-shrink: 0;
}

.nav-card {
  background: var(--el-bg-color);
  padding: 16px 20px;
  border-radius: 16px;
  display: flex;
  align-items: center;
  gap: 15px;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  border: 1px solid var(--el-border-color-light);
  position: relative;
  margin-bottom: 10px;
}

.nav-card:hover {
  transform: translateY(-3px);
  box-shadow: var(--el-box-shadow-light);
}

.nav-card.active {
  border-color: var(--el-color-primary);
  background: var(--el-bg-color);
  box-shadow: 0 8px 25px rgba(64, 158, 255, 0.15);
}

.nav-card .icon-box {
  background-color: var(--el-fill-color-light);
}

.icon-box {
  width: 44px;
  height: 44px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  transition: all 0.3s;
}

.nav-card .label {
  font-weight: 600;
  font-size: 15px;
  color: var(--el-text-color-primary);
}

.active-dot {
  position: absolute;
  right: 15px;
  width: 6px;
  height: 6px;
  background: var(--el-color-primary);
  border-radius: 50%;
}

.main-body-row {
  flex: 1;
  overflow: hidden;
}

.content-col {
  height: 100%;
}

.glass-module {
  background: var(--el-bg-color);
  border-radius: 20px;
  border: 1px solid var(--el-border-color-light);
  height: 93%;
  display: flex;
  flex-direction: column;
}

.list-module {
  background: var(--el-fill-color-blank);
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.module-header {
  padding: 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-weight: bold;
}

.list-module .el-scrollbar {
  flex: 1;
}

.card-list {
  padding: 0 15px 15px;
}

.mini-item-card {
  padding: 14px;
  background: var(--el-bg-color);
  border-radius: 12px;
  margin-bottom: 10px;
  cursor: pointer;
  border: 1px solid transparent;
  display: flex;
  justify-content: space-between;
  align-items: center;
  transition: 0.2s;
}

.mini-item-card:hover {
  background: var(--el-fill-color-light);
}

.mini-item-card.active {
  border-color: var(--el-color-primary);
  background: var(--el-color-primary-light-9);
}

.mini-item-card .name {
  font-size: 14px;
  font-weight: 600;
  color: var(--el-text-color-primary);
}

.mini-item-card .sub {
  font-size: 12px;
  color: var(--el-text-color-secondary);
  margin-top: 2px;
}

.detail-module {
  padding: 35px;
  overflow-y: auto;
}

.detail-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 30px;
  color: var(--el-text-color-primary);
}

.btn-group {
  margin-top: 30px;
  border-top: 1px solid var(--el-border-color-lighter);
  padding-top: 20px;
}

/* 響應式優化 */
/* 平板 & 手機 */
@media (max-width: 992px) {
  .system-container {
    height: auto;
  }
  .main-body-row {
    height: auto;
  }
  .content-col {
    height: auto;
    margin-bottom: 20px;
  }
  .detail-module {
    padding: 20px;
  }
}

/* 平板 */
@media (min-width: 600px) and (max-width: 992px) {
  .list-module {
    height: 620px;
    margin-bottom: 0px;
  }
}

/* 手機端優化 */
@media (max-width: 599px) {
  /* 邊距縮小 */
  .system-container {
    row-gap: 0px;
  }
  .nav-card {
    padding: 10px 12px;
    gap: 8px;
  }
  .content-col {
    height: auto;
    margin-bottom: 10px;
  }
  .module-header {
    padding: 10px;
    margin-left: 10px;
  }
  .detail-module {
    padding: 15px;
  }
  .detail-header {
    margin-bottom: 5px;
  }
  .el-form-item {
    margin-bottom: 5px !important;
  }
  .btn-group {
    margin-top: 10px;
    border-top: none;
    padding-top: 0px;
  }
  /* 字體縮小/換行 */
  .nav-card .label {
    display: inline-block;
    width: 2.2em;
    line-height: 1.2;
    word-break: break-all;
    text-align: left;
    font-size: 13px;
  }
  h2 {
    font-size: 17px;
    line-height: 1.1;
    margin-top: 10px;
    margin-bottom: 8px;
  }
  /* 固定左邊列表高度 */
  .list-module {
    height: 250px;
    margin-bottom: 1px;
  }
}
</style>
