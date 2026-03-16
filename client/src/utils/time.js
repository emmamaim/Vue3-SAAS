// 限制結束時間
export const END_MAX_STR = '20:30';
// 時間選擇的間隔（30分鐘）
export const STEP_MIN = 30;

// 時間工具函式1：把"HH:mm"轉成分鐘數
export function toMinutes(hhmm) {
  if (!hhmm) return null;
  const [h, m] = hhmm.split(':').map(Number);
  return h * 60 + m;
}

// 時間工具函式2：把分鐘數轉回"HH:mm"
export function toHHmm(min) {
  const h = String(Math.floor(min / 60)).padStart(2, '0');
  const m = String(min % 60).padStart(2, '0');
  return `${h}:${m}`;
}

// 時間工具函式3：檢測時間是否重疊
export function isOverlap(aStart, aEnd, bStart, bEnd) {
  return aStart < bEnd && aEnd > bStart;
}

// 時間槽搜尋：找出下一個還沒有被佔用的空檔
export function findNextAvailableSlot(startMin, durationMin, blocks) {
  const END_MAX = toMinutes(END_MAX_STR);
  let s = startMin;
  while (s + durationMin <= END_MAX) {
    const e = s + durationMin;
    const hit = blocks.some((b) => isOverlap(s, e, b.s, b.e));
    if (!hit) return { s, e };
    s += STEP_MIN;
  }
  return null;
}
