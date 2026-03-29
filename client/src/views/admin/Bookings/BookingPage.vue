<script setup>
import { computed, onMounted, ref, watch, onUnmounted } from 'vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import { useBookingStore, useUserStore, useSystemStore } from '@/stores';
import BookingDialog from '@/views/admin/Bookings/components/BookingDialog.vue';

// 控制日曆顯示
const windowWidth = ref(window.innerWidth);
const handleResize = () => {
  windowWidth.value = window.innerWidth;
};
window.addEventListener('resize', handleResize);
const isMobile = computed(() => windowWidth.value <= 1024);
onUnmounted(() => {
  window.removeEventListener('resize', handleResize);
});

const BookingStore = useBookingStore();
const userStore = useUserStore();
const systemStore = useSystemStore();

// 權限控制
const isStaff = computed(
  () => userStore.userInfo.role === 'super_admin' || userStore.userInfo.role === 'dept_hr',
);

// 使用者ID
const myUserId = computed(() => userStore.userInfo.id);

// 選中的面試官ID
const selectedInterviewerId = ref(isStaff.value ? null : myUserId.value);

// 獲取面試官列表 => 篩選
const otherInterviewerOptions = computed(() => {
  return (systemStore.interviewerOptions || []).filter((opt) => opt.value !== myUserId.value);
});

// 顯示：新增/編輯行程彈窗按鈕
const isMyOwnSchedule = computed(() => {
  if (isStaff.value) return false;
  return selectedInterviewerId.value !== '' && selectedInterviewerId.value === myUserId.value;
});

// 監聽：篩選框變化 => 管理員/HR切換面試官，重新載入行程資料
watch(
  selectedInterviewerId,
  async (newId) => {
    console.log('當前切換到的 ID:', newId);
    BookingStore.items = [];
    if (newId && newId !== undefined) {
      BookingStore.items = [];
      await BookingStore.fetchAll({ userId: newId });
    } else {
      BookingStore.items = [];
    }
  },
  { immediate: true },
);

// 初始化載入
onMounted(async () => {
  if (isStaff.value) {
    await systemStore.fetchAllOptions();
  }
});

// 資料處理
const selectedDate = ref(new Date().toISOString().slice(0, 10));
const bookings = computed(() => (Array.isArray(BookingStore.items) ? BookingStore.items : []));

// 資料分組 （按日期）
const bookingsByDate = computed(() => {
  const map = new Map();
  for (const b of bookings.value) {
    if (!b.date) continue;
    const dateKey = b.date.slice(0, 10);
    if (!map.has(dateKey)) {
      map.set(dateKey, []);
    }
    map.get(dateKey).push(b);
  }
  // 每個日期內的行程按照時間排序
  for (const arr of map.values()) {
    // 字串相加後比較
    arr.sort((a, b) => (a.startTime + a.endTime).localeCompare(b.startTime + b.endTime));
  }
  return map;
});

// 判斷某天是否有行程
const hasBookings = (day) => {
  return (bookingsByDate.value.get(day)?.length ?? 0) > 0;
};

// 選中日期的行程列表
const dayBookings = computed(() => bookingsByDate.value.get(selectedDate.value) ?? []);

// 點擊返回今天
const calendarDate = ref(new Date());
watch(calendarDate, (newVal) => {
  if (newVal) {
    const y = newVal.getFullYear();
    const m = String(newVal.getMonth() + 1).padStart(2, '0');
    const d = String(newVal.getDate()).padStart(2, '0');
    selectedDate.value = `${y}-${m}-${d}`;
  }
});

// 彈窗相關
const dialogOpen = ref(false);
const dialogMode = ref('create');
const dialogInitial = ref(null);
const dialogSaving = ref(false);
const conflictMsg = ref('');

// 新增行程
function openCreate(prefill = {}) {
  if (!isMyOwnSchedule.value) {
    return ElMessage.warning('你無權為其他面試官安排私人行程');
  }
  dialogMode.value = 'create';
  dialogInitial.value = {
    date: selectedDate.value,
    startTime: '10:00',
    endTime: '11:00',
    status: 'confirmed',
    title: '',
    user_id: myUserId.value,
    relatedTaskId: null,
    // 若有傳入prefill參數，則覆蓋預設值
    ...prefill,
  };
  conflictMsg.value = '';
  dialogOpen.value = true;
}

// 編輯行程
function openEdit(row) {
  if (!isMyOwnSchedule.value) {
    return ElMessage.info('查看模式：無法修改他人行程');
  }
  dialogMode.value = 'edit';
  dialogInitial.value = row;
  conflictMsg.value = '';
  dialogOpen.value = true;
}

// 刪除行程
async function del(id) {
  try {
    await ElMessageBox.confirm('你確定要刪除這個行程嗎？', '刪除行程', {
      confirmButtonText: '刪除',
      cancelButtonText: '取消',
      type: 'warning',
    });
    await BookingStore.remove(id);
    ElMessage.success('刪除行程成功');
  } catch (e) {
    if (e !== 'cancel') ElMessage.error(e.response?.data?.error || e.message);
  }
}

// 關閉彈窗
function closeDialog() {
  dialogOpen.value = false;
  conflictMsg.value = '';
}

// 提交表單
async function handleSubmit(payload) {
  dialogSaving.value = true;
  try {
    // 新增模式
    if (dialogMode.value === 'create') {
      await BookingStore.add(payload);
      ElMessage.success('新增成功');
    } else {
      // 編輯模式
      await BookingStore.patch(dialogInitial.value.id, payload);
      ElMessage.success('更新成功');
    }
    closeDialog();
  } catch (e) {
    const msg = e.response?.data?.error || e.message;
    if (msg.includes('衝突')) {
      conflictMsg.value = '時間衝突，該時段已安排面試或會議';
    } else {
      ElMessage.error(msg);
    }
  } finally {
    dialogSaving.value = false;
  }
}

// 切換日期
function openDayDetails(day) {
  selectedDate.value = day;
}
</script>
<template>
  <div class="schedule-page">
    <el-card>
      <!-- 標題區（按鈕） -->
      <div class="card-header">
        <div class="title-wrap">
          <h2 style="margin: 0">行事曆</h2>
          <div class="subtle">
            {{ isMyOwnSchedule ? '正在管理我的私人行程' : '正在查看面試官行程（唯讀）' }}
          </div>
        </div>
        <div class="actions">
          <el-select
            v-if="isStaff"
            v-model="selectedInterviewerId"
            placeholder="請選擇面試官"
            filterable
            clearable
            style="width: 180px"
          >
            <el-option
              v-for="item in otherInterviewerOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
          <el-button v-if="isMyOwnSchedule" type="primary" @click="openCreate()">
            +新增行程
          </el-button>
        </div>
      </div>
      <!-- 月曆 -->
      <el-calendar v-model="calendarDate" class="booking-calendar">
        <!-- 用插槽自定義日期單元格內容 -->
        <template #date-cell="{ data }">
          <!-- 日期單元格的外框 .cal-cell -->
          <div
            class="cal-cell"
            :class="{ 'is-selected': data.day === selectedDate, 'is-mobile-cell': isMobile }"
            @click="selectedDate = data.day"
          >
            <!-- 上半部：日期數字 + 當天行程數量tag -->
            <div class="cal-top">
              <span class="cal-day">
                {{ Number(data.day.slice(8, 10)) }}
              </span>
              <template v-if="isMobile">
                <div v-if="hasBookings(data.day)"></div>
              </template>
              <template v-else>
                <el-tag
                  type="info"
                  v-if="(bookingsByDate.get(data.day)?.length ?? 0) > 0"
                  size="small"
                >
                  {{ bookingsByDate.get(data.day).length }}
                </el-tag>
              </template>
            </div>
            <!-- 下半部：最多顯示3筆行程資訊 -->
            <div class="cal-slots">
              <template v-if="isMobile">
                <div v-if="hasBookings(data.day)" class="mobile-dot"></div>
              </template>

              <template v-else>
                <div
                  class="slot"
                  v-for="b in (bookingsByDate.get(data.day) ?? []).slice(0, 3)"
                  :key="b.id"
                  @click.stop="openEdit(b)"
                  :title="`${b.startTime} ${b.title}`"
                >
                  <span class="slot-time">{{ b.startTime }}</span>
                  <span class="slot-title">{{ b.title }}</span>
                </div>
                <button
                  v-if="(bookingsByDate.get(data.day)?.length ?? 0) > 3"
                  type="button"
                  class="slot more"
                  @click.stop="openDayDetails(data.day)"
                >
                  +{{ bookingsByDate.get(data.day).length - 3 }}
                </button>
              </template>
            </div>
          </div>
        </template>
      </el-calendar>
    </el-card>

    <!-- 選中日期的行程列表 -->
    <el-card>
      <!-- 標題區（選中日期 + 操作按鈕） -->
      <div class="day-header">
        <div>
          <div style="font-size: 12px; opacity: 0.7">已選日期</div>
          <div style="font-size: 20px; font-weight: 700">{{ selectedDate }}</div>
        </div>
        <el-button v-if="isMyOwnSchedule" type="primary" @click="openCreate({ date: selectedDate })"
          >+新增</el-button
        >
      </div>

      <el-divider />

      <!-- 行程列表 -->
      <el-empty v-if="dayBookings.length === 0" description="本日尚無行程資料" />
      <div v-else class="day-list">
        <div class="day-item" v-for="b in dayBookings" :key="b.id">
          <!-- 時間 + 狀態tag -->
          <div class="day-item__time">
            <div class="time">{{ b.startTime }} - {{ b.endTime }}</div>
            <el-tag size="small" :type="b.relatedTaskId ? 'danger' : 'primary'" effect="plain">
              {{ b.relatedTaskId ? '面試任務' : '私人行程' }}
            </el-tag>
          </div>
          <!-- 標題 + 關聯任務 -->
          <div class="day-item__body">
            <div class="title">
              {{ b.title }}
            </div>
            <div
              class="meta"
              v-if="b.relatedTaskId"
              style="color: var(--el-color-danger); font-size: 12px"
            >
              * 此行程由系統面試安排產生，不可在此刪除
            </div>
          </div>
          <!-- 編輯 -> 開彈窗 / 刪除 -> 直接刪除 -->
          <div class="day-item__actions" v-if="isMyOwnSchedule">
            <el-button size="small" @click="openEdit(b)"> 編輯 </el-button>
            <el-button v-if="!b.relatedTaskId" size="small" type="danger" @click="del(b.id)">
              刪除
            </el-button>
            <el-tooltip v-else content="請至面試管理模組取消此面試" placement="top">
              <el-button size="small" type="info" disabled>刪除</el-button>
            </el-tooltip>
          </div>
        </div>
      </div>
    </el-card>
    <BookingDialog
      v-model:open="dialogOpen"
      :mode="dialogMode"
      :initial="dialogInitial"
      :saving="dialogSaving"
      :conflict-msg="conflictMsg"
      :all-bookings="bookings"
      @cancel="closeDialog"
      @submit="handleSubmit"
    />
  </div>
</template>

<style scoped>
.schedule-page {
  display: flex;
  flex-direction: column;
  /* 卡片與卡片之間的間距 */
  gap: 12px;
}

.schedule-page :deep(.el-calendar-table td.current) {
  border: none !important;
}

.schedule-page :deep(.el-calendar-table .el-calendar-day) {
  padding: 0;
}

/* 月曆區域 */
.card-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 12px;
  /* 方便標題與按鈕在小熒幕換行 */
  flex-wrap: wrap;
  margin-bottom: 8px;
}

/* 副標題 */
.title-wrap .subtle {
  font-size: 12px;
  opacity: 0.65;
  margin-top: 2px;
}

.actions {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

/* 日期格 */
.cal-cell {
  height: 100%;
  padding: 10px;
  border-radius: 12px;
  cursor: pointer;
  border: 1px solid var(--el-border-color);
  background: var(--el-bg-color);
  transition:
    box-shadow 0.15s ease,
    border-color 0.15s ease,
    background 0.15s ease;
  display: flex;
  flex-direction: column;
  gap: 8px;
  box-sizing: border-box;
}

/* 格子hover滑入效果 */
.cal-cell:hover {
  border-color: var(--el-color-primary);
  box-shadow: var(--el-box-shadow-light);
}

/* 被選中的日期格子 -> 明顯的選取狀態 */
.cal-cell.is-selected {
  border-color: var(--el-color-primary);
  box-shadow: 0 0 0 2px var(--el-color-primary-light-8);
  background: var(--el-color-primary-light-9);
}

/* 手機格子 => 展示圓點 */
.mobile-dot {
  width: 6px;
  height: 6px;
  background-color: var(--el-color-primary);
  border-radius: 50%;
  margin: 2px auto 0;
}

/* 日期格上半部 + 日期數字 */
.cal-top {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.cal-day {
  font-weight: 700;
  color: var(--el-text-color-primary);
}

/* 日期下半部：行程資訊列表 */
.cal-slots {
  display: flex;
  flex-direction: column;
  gap: 6px;
  min-height: 0;
}

/* 行程資訊 -> 膠囊條 */
.slot {
  height: 30px;
  border-radius: 10px;
  padding: 0 8px;
  display: flex;
  align-items: center;
  gap: 8px;
  border: 1px solid var(--el-border-color);
  background: var(--el-bg-color);
  font-size: 12px;
  line-height: 1.2;
  cursor: pointer;
  overflow: hidden;
}

.slot:hover {
  border-color: var(--el-color-primary);
}

/* 行程資訊 -> 時間區 */
.slot-time {
  font-weight: 700;
  opacity: 0.85;
  /* 不壓縮 -> 時間能完整顯示 */
  flex: 0 0 auto;
}

/* 行程資訊 -> 標題內容區 */
.slot-title {
  /* 將剩餘空間都給標題內容 */
  flex: 1;
  /* 允許縮小 -> 觸發省略號 */
  min-width: 0;
  /* 超出隱藏 / 超出顯示省略號 / 不換行 */
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

/* 行程資訊 -> 標題內容區 -> + N 更多內容 */
.slot.more {
  justify-content: center;
  border-style: dashed;
  background: var(--el-fill-color-lighter);
  color: var(--el-color-primary);
}

/* 選中日期的行程列表 */
.day-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
}

/* 本日行程清單容器 */
.day-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.day-item {
  display: flex;
  gap: 12px;
  padding: 10px;
  border: 1px solid var(--el-border-color);
  border-radius: 12px;
  background: var(--el-bg-color);
}

.day-item__time {
  width: 120px;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.day-item__time .time {
  font-weight: 700;
  color: var(--el-text-color-primary);
}

.day-item__body {
  flex: 1;
  min-width: 0;
}

.day-item__body .title {
  font-weight: 700;
  color: var(--el-text-color-primary);
}

.day-item__body .meta {
  margin-top: 4px;
  font-size: 12px;
  color: var(--el-text-color-secondary);
  opacity: 0.7;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.day-item__actions {
  display: flex;
  gap: 8px;
  align-items: flex-start;
}

/* 平板和電腦端優化 */
@media (min-width: 1025px) {
  /* 日期格子更大 */
  .schedule-page :deep(.el-calendar-table .el-calendar-day) {
    height: 160px;
  }
}

/* 手機端優化 */
@media (max-width: 1024px) {
  :deep(.el-card__body) {
    padding: 10px;
  }
  :deep(.el-calendar__body) {
    padding: 0;
  }
  :deep(.el-calendar__header) {
    padding: 5px;
  }
  /* 日期格子較小且slot變小 */
  .schedule-page :deep(.el-calendar-table .el-calendar-day) {
    height: 60px !important;
  }
  .cal-cell {
    padding: 8px;
    gap: 6px;
  }
  .cal-top {
    justify-content: center;
  }
  /* 行程列表 */
  .day-item {
    flex-direction: column;
    gap: 10px;
    padding: 12px;
  }
  .day-item__time {
    width: 100%; /* 手機端佔滿寬度 */
    flex-direction: row; /* 時間與標籤改為水平並排 */
    justify-content: space-between;
    align-items: center;
    border-bottom: 1px dashed var(--el-border-color-lighter);
    padding-bottom: 8px;
  }
  .day-item__body .title {
    font-size: 14px;
    white-space: normal;
  }
  .day-item__body .meta {
    margin-top: 4px;
    white-space: normal;
  }
  .day-item__actions {
    width: 100%;
    justify-content: flex-end;
    margin-top: 4px;
  }
  .day-item__actions .el-button {
    padding: 14px 16px;
  }
}
</style>
