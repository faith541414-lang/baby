const RELATIONSHIP_START = new Date(2025, 8, 15);

export function getManilaNow(): Date {
  const now = new Date();
  const manilaOffset = 8 * 60;
  const utc = now.getTime() + now.getTimezoneOffset() * 60_000;
  return new Date(utc + manilaOffset * 60_000);
}

export function getNextMonthsary(now: Date): Date {
  const startDay = RELATIONSHIP_START.getDate();
  let candidate = new Date(now.getFullYear(), now.getMonth(), startDay);
  if (candidate <= now) {
    candidate = new Date(now.getFullYear(), now.getMonth() + 1, startDay);
  }
  return candidate;
}

export function getMonthsaryNumber(monthsaryDate: Date): number {
  const startYear = RELATIONSHIP_START.getFullYear();
  const startMonth = RELATIONSHIP_START.getMonth();
  const targetYear = monthsaryDate.getFullYear();
  const targetMonth = monthsaryDate.getMonth();
  return (targetYear - startYear) * 12 + (targetMonth - startMonth);
}

export function getNextSpecialDay(now: Date, month: number, day: number): Date {
  let candidate = new Date(now.getFullYear(), month, day);
  if (candidate <= now) {
    candidate = new Date(now.getFullYear() + 1, month, day);
  }
  return candidate;
}

export function formatDuration(ms: number): { days: number; hours: number; minutes: number; seconds: number } {
  if (ms <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0 };
  const totalSeconds = Math.floor(ms / 1000);
  const seconds = totalSeconds % 60;
  const totalMinutes = Math.floor(totalSeconds / 60);
  const minutes = totalMinutes % 60;
  const totalHours = Math.floor(totalMinutes / 60);
  const hours = totalHours % 24;
  const days = Math.floor(totalHours / 24);
  return { days, hours, minutes, seconds };
}
