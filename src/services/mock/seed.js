// 初始資料 -> 第一次啟動寫入localStorage
export function createSeedData() {
  // 現在時間
  const now = Date.now()
  // 初始任務
  const tasks = [
    {
      id: 't_1',
      title: '早餐',
      status: 'todo',
      priority: 'medium',
      // 預設任務1是三天前建立和更新
      // 加兩天再轉成ISO格式（YYYY-MM-DDTHH:mm:ss.sssZ）
      dueDate: new Date(now + 2 * 24 * 3600 * 1000).toISOString(),
      createAt: new Date(now - 3 * 24 * 3600 * 1000).toISOString(),
      updateAt: new Date(now - 3 * 24 * 3600 * 1000).toISOString(),
      description: 'breakfast',
    },
    {
      id: 't_2',
      title: '工作會議',
      status: 'doing',
      priority: 'high',
      dueDate: new Date(now + 5 * 24 * 3600 * 1000).toISOString(),
      createAt: new Date(now - 2 * 24 * 3600 * 1000).toISOString(),
      updateAt: new Date(now - 1 * 24 * 3600 * 1000).toISOString(),
      description: 'meeting',
    },
    {
      id: 't_3',
      title: '看書',
      status: 'done',
      priority: 'low',
      dueDate: new Date(now + 1 * 24 * 3600 * 1000).toISOString(),
      createAt: new Date(now - 6 * 24 * 3600 * 1000).toISOString(),
      updateAt: new Date(now - 2 * 24 * 3600 * 1000).toISOString(),
      description: 'reading',
    },
  ]
  // 初始行程
  const bookings = [
    {
      id: 'b_1',
      title: 'demo',
      // 現在時間取前10個字元 (YYYY-MM-DDTHH)
      date: new Date(now + 1 * 24 * 3600 * 1000).toISOString().slice(1, 10),
      startTime: '10:00',
      endTime: '11:00',
      status: 'confirmed',
      relatedTaskId: 't_2',
      createAt: new Date(now - 3 * 24 * 3600 * 1000).toISOString(),
      updateAt: new Date(now - 3 * 24 * 3600 * 1000).toISOString(),
    },
  ]
  // 將回傳值寫進mock DB
  return { tasks, bookings }
}
