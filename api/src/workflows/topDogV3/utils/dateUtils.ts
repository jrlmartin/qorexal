/**
 * Utility functions for date/time in a market context.
 */

export function getLatestTradingDay(date = new Date()): string {
  const day = date.getDay();
  if (day === 0) { // Sunday
    date.setDate(date.getDate() - 2);
  } else if (day === 6) { // Saturday
    date.setDate(date.getDate() - 1);
  }
  return formatDateForApi(date);
}

export function getMarketOpenTime(): Date {
  const now = new Date();
  now.setHours(9, 30, 0, 0);
  return now;
}

export function getPreMarketStart(date = new Date()): string {
  const formatted = formatDateForApi(date);
  return `${formatted} 04:00:00`;
}

export function getMarketOpenDateTime(date = new Date()): string {
  const formatted = formatDateForApi(date);
  return `${formatted} 09:30:00`;
}

export function formatDateForApi(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function parseDateString(dateStr: string): Date {
  return new Date(dateStr);
}

export function getNow(): string {
  const now = new Date();
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  const seconds = String(now.getSeconds()).padStart(2, '0');
  return `${hours}:${minutes}:${seconds}`;
}

export function getDateRanges(date: Date | string) {
  const currentDate = typeof date === 'string' ? new Date(date) : new Date(date);

  const yesterday = new Date(currentDate);
  yesterday.setDate(yesterday.getDate() - 1);

  const oneWeekAgo = new Date(currentDate);
  oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

  const oneMonthAgo = new Date(currentDate);
  oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);

  const threeMonthsAgo = new Date(currentDate);
  threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);

  const sixMonthsAgo = new Date(currentDate);
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

  const oneYearAgo = new Date(currentDate);
  oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);

  return {
    today: formatDateForApi(currentDate),
    yesterday: formatDateForApi(yesterday),
    oneWeekAgo: formatDateForApi(oneWeekAgo),
    oneMonthAgo: formatDateForApi(oneMonthAgo),
    threeMonthsAgo: formatDateForApi(threeMonthsAgo),
    sixMonthsAgo: formatDateForApi(sixMonthsAgo),
    oneYearAgo: formatDateForApi(oneYearAgo)
  };
}