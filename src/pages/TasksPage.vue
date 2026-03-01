<script setup>
import { ref, computed, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { useTasksStore } from '@/stores'
import TaskDialog from '@/modules/tasks/components/TaskDialog.vue'
import { useTaskDnD } from '@/modules/tasks/composables/useTaskDnD'

// store 實例
const tasksStore = useTasksStore()
// 拖拽邏輯物件 dnd (Drag and Drop)
const dnd = useTaskDnD()

// 一進頁面就載入行程資料
onMounted(async () => {
  await tasksStore.fetchAll()
})

// Computed 過濾器 => 任務狀態
const todo = computed(() => tasksStore.byStatus('todo'))
const doing = computed(() => tasksStore.byStatus('doing'))
const done = computed(() => tasksStore.byStatus('done'))

// 拖拽放置 dnd
async function onDropTo(status) {
  // 先獲取被拖拽卡片的id
  const id = dnd.draggingId.value
  if (!id) return
  // 尋找該任務
  const task = tasksStore.items.find((t) => t.id === id)
  // 防呆：任務不存在或放下位置與原來位置一樣 => 結束
  if (!task || task.status === status) {
    dnd.onDragEnd()
    return
  }
  // 更新store
  await tasksStore.patch(id, { status })
  // 狀態重置 / 提示使用者
  dnd.onDragEnd()
  ElMessage.success('移動成功')
}
// 移動（更新）任務
async function move(id, status) {
  // patch對象是物件 (id,{status:'doing'})
  await tasksStore.patch(id, { status })
  ElMessage.success('已更新')
}
// 刪除任務
async function del(id) {
  await tasksStore.remove(id)
  ElMessage.success('已刪除')
}

// 彈窗控制狀態
// 彈窗開關
const dialogOpen = ref(false)
// 彈窗模式：新增 或 編輯
const dialogMode = ref('create')
// 彈窗初始資料
const dialogInitial = ref(null)
// 彈窗loading狀態
const dialogSaving = ref(false)

// 新增任務
function openCreate() {
  dialogMode.value = 'create'
  dialogInitial.value = null
  dialogOpen.value = true
}
// 編輯任務
function openEdit(task) {
  dialogMode.value = 'edit'
  // 將需要編輯的資料傳給dialog
  dialogInitial.value = task
  dialogOpen.value = true
}
// 關閉彈窗
function closeDialog() {
  dialogOpen.value = false
}
// 彈窗提交
async function handleSubmit(payload) {
  // loading 加載資料
  dialogSaving.value = true
  try {
    if (dialogMode.value === 'create') {
      await tasksStore.add(payload)
      ElMessage.success('已新增')
    } else {
      await tasksStore.patch(dialogInitial.value.id, payload)
      ElMessage.success('已更新')
    }
    // 關閉視窗
    dialogOpen.value = false
  } finally {
    // 關閉loading加載效果
    dialogSaving.value = false
  }
}
</script>
<template>
  <div class="main">
    <el-card>
      <!-- 標題區：標題 + 新增按鈕 -->
      <div class="header">
        <h3>任務看板</h3>
        <el-button type="primary" @click="openCreate">+新增任務</el-button>
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
    
    <el-row :gutter="12">
      <!-- todo -->
      <el-col :span="8">
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
                @dragstart.stop="(e) => dnd.onDragStart(t.id, e)"
                @dragend="dnd.onDragEnd"
              >
                <!-- 任務容器 -->
                <div class="tasksContainer">
                  <!-- 任務內容 -->
                  <div>
                    <div style="font-weight: 600">
                      {{ t.title }}
                    </div>
                    <small> {{ t.priority }} . {{ t.dueDate?.slice(0, 10) || 'no due' }} </small>
                  </div>
                  <!-- 任務下拉菜單：編輯/移動/刪除 -->
                  <div @click.stop>
                    <!-- 防止點擊選單時觸發卡片的openEdit -->
                    <el-dropdown>
                      <el-button size="small">...</el-button>
                      <template #dropdown>
                        <el-dropdown-menu>
                          <el-dropdown-item @click="openEdit(t)"> 編輯 </el-dropdown-item>
                          <el-dropdown-item @click="move(t.id, 'doing')">
                            移至進行中
                          </el-dropdown-item>
                          <el-dropdown-item @click="move(t.id, 'done')">
                            移至已完成
                          </el-dropdown-item>
                          <el-dropdown-item @click="del(t.id)" divided> 刪除 </el-dropdown-item>
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

      <!-- doing -->
      <el-col :span="8">
        <el-card>
          <h4>進行中</h4>
          <!-- 核心區：拖放容器 -->
          <div
            class="dropzone"
            :class="{ 'dropzone--over': dnd.overStatus.value === 'doing' }"
            @dragenter.capture.prevent="dnd.onDragOver('doing')"
            @dragover.capture.prevent="dnd.onDragOver('doing')"
            @dragleave.capture="dnd.onDragLeave('doing')"
            @drop.capture.prevent="onDropTo('doing')"
          >
            <el-empty v-if="doing.length === 0" description="尚無任務資料" />
            <el-space direction="vertical" fill style="width: 100%">
              <!-- 任務卡片 -->
              <el-card
                v-for="t in doing"
                :key="t.id"
                shadow="never"
                class="task-card"
                @click="openEdit(t)"
                :class="{ 'task-card--dragging': dnd.draggingId.value === t.id }"
                draggable="true"
                @dragstart.stop="(e) => dnd.onDragStart(t.id, e)"
                @dragend="dnd.onDragEnd"
              >
                <!-- 任務容器 -->
                <div class="tasksContainer">
                  <!-- 任務內容 -->
                  <div>
                    <div style="font-weight: 600">
                      {{ t.title }}
                    </div>
                    <small> {{ t.priority }} . {{ t.dueDate?.slice(0, 10) || 'no due' }} </small>
                  </div>
                  <!-- 任務下拉菜單：編輯/移動/刪除 -->
                  <div @click.stop>
                    <!-- 防止點擊選單時觸發卡片的openEdit -->
                    <el-dropdown>
                      <el-button size="small">...</el-button>
                      <template #dropdown>
                        <el-dropdown-menu>
                          <el-dropdown-item @click="openEdit(t)"> 編輯 </el-dropdown-item>
                          <el-dropdown-item @click="move(t.id, 'todo')">
                            移至進行中
                          </el-dropdown-item>
                          <el-dropdown-item @click="move(t.id, 'done')">
                            移至已完成
                          </el-dropdown-item>
                          <el-dropdown-item @click="del(t.id)" divided> 刪除 </el-dropdown-item>
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
      <el-col :span="8">
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
                @dragstart.stop="(e) => dnd.onDragStart(t.id, e)"
                @dragend="dnd.onDragEnd"
              >
                <!-- 任務容器 -->
                <div class="tasksContainer">
                  <!-- 任務內容 -->
                  <div>
                    <div style="font-weight: 600">
                      {{ t.title }}
                    </div>
                    <small> {{ t.priority }} . {{ t.dueDate?.slice(0, 10) || 'no due' }} </small>
                  </div>
                  <!-- 任務下拉菜單：編輯/移動/刪除 -->
                  <div @click.stop>
                    <!-- 防止點擊選單時觸發卡片的openEdit -->
                    <el-dropdown>
                      <el-button size="small">...</el-button>
                      <template #dropdown>
                        <el-dropdown-menu>
                          <el-dropdown-item @click="openEdit(t)"> 編輯 </el-dropdown-item>
                          <el-dropdown-item @click="move(t.id, 'todo')">
                            移至待辦
                          </el-dropdown-item>
                          <el-dropdown-item @click="move(t.id, 'doing')">
                            移至進行中
                          </el-dropdown-item>
                          <el-dropdown-item @click="del(t.id)" divided> 刪除 </el-dropdown-item>
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
    </el-row>

    <!-- TaskDialog 任務彈窗 -->
    <TaskDialog
      :open="dialogOpen"
      :mode="dialogMode"
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
}

/* 任務容器 */
.tasksContainer {
  display: flex;
  justify-content: space-between;
  gap: 8px;
}

/* 任務卡片狀態管理 */
.task-card {
  border: 1px solid var(--el-border-color);
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
  background: rgba(64, 158, 255, 0.08);
}
</style>
