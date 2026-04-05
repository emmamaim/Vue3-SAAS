// 限制結束時間
export const END_MAX_STR: string = '20:30';
// 時間選擇的間隔（30分鐘）
export const STEP_MIN: number = 30;

// 時間工具函式1：把"HH:mm"轉成分鐘數
export function toMinutes(hhmm: string): number | null {
  if (!hhmm) return null;
  const [h, m] = hhmm.split(':').map(Number);
  return h * 60 + m;
}

// 時間工具函式2：把分鐘數轉回"HH:mm"
export function toHHmm(min: number): string {
  const h = String(Math.floor(min / 60)).padStart(2, '0');
  const m = String(min % 60).padStart(2, '0');
  return `${h}:${m}`;
}

// 時間工具函式3：檢測時間是否重疊
export function isOverlap(aStart: number, aEnd: number, bStart: number, bEnd: number) {
  return aStart < bEnd && aEnd > bStart;
}

// 已佔用時段
interface TimeBlock {
  s: number; // Start minute
  e: number; // End minute
}

// 時間槽搜尋：找出下一個還沒有被佔用的空檔
export function findNextAvailableSlot(
  startMin: number,
  durationMin: number,
  blocks: TimeBlock[],
): TimeBlock | null {
  const END_MAX = toMinutes(END_MAX_STR);
  if (END_MAX === null) return null;
  let s = startMin;
  while (s + durationMin <= END_MAX) {
    const e = s + durationMin;
    const hit = blocks.some((b) => isOverlap(s, e, b.s, b.e));
    if (!hit) return { s, e };
    s += STEP_MIN;
  }
  return null;
}
