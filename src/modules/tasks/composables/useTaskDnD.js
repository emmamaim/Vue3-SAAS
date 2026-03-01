import { ref } from 'vue'

export function useTaskDnD() {
  // 目前拖拽的任務ID
  const draggingId = ref(null)
  // 滑鼠懸浮的狀態欄
  const overStatus = ref(null)

  // 開始拖拽 onDragStart
  function onDragStart(taskId, e) {
    // 任務ID
    draggingId.value = taskId
    // dataTransfer存放被拖拽的物件
    if (e?.dataTransfer) {
      // 可移動操作
      e.dataTransfer.effectAllowed = 'move'
      // 在拖放數據中存放ID
      e.dataTransfer.setData('text/plain', taskId)
    }
  }
  // 懸浮 DragOver
  function onDragOver(status) {
    overStatus.value = status
  }
  // 離開 DragLeave
  function onDragLeave(status) {
    // 若離開的欄位與目標欄位一致 => 清空
    if (overStatus.value === status) {
      overStatus.value = null
    }
  }
  // 結束重置 onDragEnd
  function onDragEnd(status) {
    // 重置ID
    draggingId.value = null
    // 清空懸浮狀態
    overStatus.value = null
  }
  return {
    draggingId,
    overStatus,
    onDragStart,
    onDragEnd,
    onDragOver,
    onDragLeave,
  }
}
