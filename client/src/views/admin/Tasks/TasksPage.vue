<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { ElMessage } from 'element-plus';
import { useTasksStore } from '@/stores';
import TaskDialog from '@/views/admin/Tasks/components/TaskDialog.vue';
import { useTaskDnD } from '@/views/admin/Tasks/composables/useTaskDnD';
import { Edit, RefreshLeft } from '@element-plus/icons-vue';
import type { Task, TaskFeedbackPayload } from '@/types';
import axios from 'axios';

const tasksStore = useTasksStore();

// 拖拽邏輯物件 dnd (Drag and Drop)
const dnd = useTaskDnD();

// 任務狀態
const todo = computed<Task[]>(() => tasksStore.byStatus('todo'));
const done = computed<Task[]>(() => tasksStore.byStatus('done'));

// 拖拽放置 dnd
async function onDropTo(status: 'todo' | 'done') {
  // 先獲取被拖拽卡片的id
  const id = dnd.draggingId.value;
  if (!id) return;
  // 尋找該任務
  const task = tasksStore.items.find((t) => t.id === id);
  // 型別守衛
  if (!task || task.status === status) {
    dnd.onDragEnd();
    return;
  }
  // 更新store
  try {
    await tasksStore.updateStatus(id, status);
    ElMessage.success('更新成功');
  } catch {
    ElMessage.error('更新失敗');
  } finally {
    dnd.onDragEnd();
  }
}

// 移動（更新）任務
async function move(id: string, status: 'todo' | 'done') {
  try {
    await tasksStore.updateStatus(id, status);
    ElMessage.success('已更新');
  } catch {
    ElMessage.error('移動失敗');
  }
}

// 彈窗控制
const dialogOpen = ref(false);
const dialogInitial = ref<Task | null>(null);
const dialogSaving = ref(false);

// 打開彈窗
function openEdit(task: Task) {
  dialogInitial.value = { ...task };
  dialogOpen.value = true;
}

// 關閉彈窗
function closeDialog() {
  dialogOpen.value = false;
  dialogInitial.value = null;
}

// 提交
async function handleSubmit(payload: TaskFeedbackPayload) {
  if (!dialogInitial.value?.id) return;
  dialogSaving.value = true;
  try {
    await tasksStore.submitInterviewResult(dialogInitial.value.id, payload);
    ElMessage.success('面試評價已提交');
    closeDialog();
  } catch (err: unknown) {
    if (axios.isAxiosError(err)) {
      return err.response?.data?.message || err.message;
    }
    return err instanceof Error ? err.message : '未知錯誤';
  } finally {
    dialogSaving.value = false;
  }
}

// 初始化載入
onMounted(async () => {
  await tasksStore.fetchAll();
});
</script>
<template>
  <div class="main">
    <el-card>
      <!-- 標題區：標題 + 新增按鈕 -->
      <div class="header">
        <h3>面試任務</h3>
        <el-tag type="info">請及時處理</el-tag>
      </div>
    </el-card>
    <div style="height: 12px"></div>

    <!-- 看板欄位 -->
    <!-- 核心區1：拖放容器 -->
    <!-- 具體功能
    1.動態class 視覺反饋
    2.@dragenter.capture.prevent (進入區域)
    3.@dragover.capture.prevent (區域內懸停)
    4.@dragleave.capture (離開區域)
    5.@drop.capture.prevent (正式放下)
    capture 讓父元素優先處理拖拽信號
    prevent 攔截瀏覽器對拖拽事件的預設拒絕行為 -->

    <!-- 核心區2：拖拽的任務卡片 -->
    <!-- 具體功能
    1.動態class 視覺反饋
    2.draggable="true" 基礎宣告讓滑鼠選取並移動
    3.@dragstart.stop (開始拖拽)
    4.@dragend (拖拽結束)：重置相關狀態
    stop 阻止冒泡，防止卡片的拖拽信號傳遞給父層或其他嵌套元素，避免觸發多重 DND 邏輯 -->

    <el-row :gutter="16" class="kanban-row">
      <!-- todo -->
      <el-col :xs="24" :sm="12" class="kanban-col">
        <el-card>
          <h4>待辦</h4>
          <!-- 核心區：拖放容器 -->
          <div
            class="dropzone"
            :class="{ 'dropzone--over': dnd.overStatus.value === 'todo' }"
            @dragenter.capture.prevent="dnd.onDragOver('todo')"
            @dragover.capture.prevent="dnd.onDragOver('todo')"
            @dragleave.capture="dnd.onDragLeave('todo')"
            @drop.capture.prevent="onDropTo('todo')"
          >
            <el-empty v-if="todo.length === 0" description="尚無任務資料" />
            <el-space direction="vertical" fill style="width: 100%">
              <!-- 任務卡片 -->
              <el-card
                v-for="t in todo"
                :key="t.id"
                shadow="never"
                class="task-card"
                @click="openEdit(t)"
                :class="{ 'task-card--dragging': dnd.draggingId.value === t.id }"
                draggable="true"
                @dragstart.stop="(e: DragEvent) => dnd.onDragStart(t.id, e)"
                @dragend="dnd.onDragEnd"
              >
                <!-- 任務容器 -->
                <div class="tasksContainer">
                  <!-- 任務內容 -->
                  <div>
                    <div class="task-title">
                      {{ t.title }}
                    </div>
                    <small> {{ t.priority }} . {{ t.dueDate?.slice(0, 10) || 'no due' }} </small>
                  </div>
                  <!-- 任務下拉菜單：編輯/移動/刪除 -->
                  <div @click.stop>
                    <!-- 防止點擊選單時觸發卡片的openEdit -->
                    <el-dropdown trigger="click">
                      <el-button size="default" :icon="Edit" circle />
                      <template #dropdown>
                        <el-dropdown-menu>
                          <el-dropdown-item @click="openEdit(t)">填寫評價</el-dropdown-item>
                          <el-dropdown-item @click="move(t.id, 'done')">標記完成</el-dropdown-item>
                        </el-dropdown-menu>
                      </template>
                    </el-dropdown>
                  </div>
                </div>
              </el-card>
            </el-space>
          </div>
        </el-card>
      </el-col>

      <!-- done -->
      <el-col :xs="24" :sm="12" class="kanban-col">
        <el-card>
          <h4>已完成</h4>
          <!-- 核心區：拖放容器 -->
          <div
            class="dropzone"
            :class="{ 'dropzone--over': dnd.overStatus.value === 'done' }"
            @dragenter.capture.prevent="dnd.onDragOver('done')"
            @dragover.capture.prevent="dnd.onDragOver('done')"
            @dragleave.capture="dnd.onDragLeave('done')"
            @drop.capture.prevent="onDropTo('done')"
          >
            <el-empty v-if="done.length === 0" description="尚無任務資料" />
            <el-space direction="vertical" fill style="width: 100%">
              <!-- 任務卡片 -->
              <el-card
                v-for="t in done"
                :key="t.id"
                shadow="never"
                class="task-card"
                @click="openEdit(t)"
                :class="{ 'task-card--dragging': dnd.draggingId.value === t.id }"
                draggable="true"
                @dragstart.stop="(e: DragEvent) => dnd.onDragStart(t.id, e)"
                @dragend="dnd.onDragEnd"
              >
                <!-- 任務容器 -->
                <div class="tasksContainer">
                  <!-- 任務內容 -->
                  <div>
                    <div class="task-title">
                      {{ t.title }}
                    </div>
                    <small> {{ t.priority }} . {{ t.dueDate?.slice(0, 10) || 'no due' }} </small>
                  </div>
                  <!-- 任務下拉菜單：編輯/移動/刪除 -->
                  <div @click.stop>
                    <!-- 防止點擊選單時觸發卡片的openEdit -->
                    <el-button
                      :icon="RefreshLeft"
                      circle
                      class="custom-action-btn reset-btn"
                      @click="move(t.id, 'todo')"
                    />
                  </div>
                </div>
              </el-card>
            </el-space>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <!-- TaskDialog 任務彈窗 -->
    <TaskDialog
      :open="dialogOpen"
      :initial="dialogInitial"
      :saving="dialogSaving"
      @cancel="closeDialog"
      @submit="handleSubmit"
    />
  </div>
</template>

<style scoped>
/* 標題區容器 和 標題 */
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.header h3 {
  margin: 0;
  color: var(--el-text-color-primary);
}

.tasksContainer {
  display: flex;
  justify-content: space-between;
  gap: 8px;
}

.task-title {
  font-weight: 600;
  color: var(--el-text-color-primary);
  line-height: 1.4;
}

/* 任務卡片狀態管理 */
.task-card {
  border: 1px solid var(--el-border-color-light);
  background-color: var(--el-bg-color-overlay);
  /* 滑鼠提示可移動的狀態 */
  cursor: grab;
  transition:
    box-shadow 0.15s ease,
    transform 0.05s ease;
}

.task-card:active {
  /* 鼠標提示已抓緊的狀態 */
  cursor: grabbing;
  /* 輕微縮小卡片：模擬物理按壓感 */
  transform: scale(0.99);
}

.task-card--dragging {
  opacity: 0.5;
  /* 縮小卡片：模擬脫離平面的層次感 */
  transform: scale(0.98);
}

/* 拖拽懸停時的目標容器 */
.dropzone {
  min-height: 200px;
  transition: all 0.2s ease;
  border-radius: 4px;
}

.dropzone--over {
  /* outline顯示虛線：模擬可放置的感覺（不會佔用空間）*/
  outline: 2px dashed var(--el-color-primary);
  background: var(--el-color-primary-light-9);
}

/* 手機端優化 */
@media (max-width: 500px) {
  .kanban-col {
    margin-bottom: 10px;
  }
  :deep(.el-card__body) {
    padding: 10px;
  }
  .task-title {
    font-size: 13px;
    font-weight: 600;
  }
  .tasksContainer :deep(.el-button) {
    background-color: var(--el-color-primary-light-9) !important;
    border: 1px solid var(--el-color-primary-light-7) !important;
    color: var(--el-color-primary) !important;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important;
  }
  .tasksContainer :deep(.el-button .el-icon) {
    font-size: 20px;
  }
}
</style>
