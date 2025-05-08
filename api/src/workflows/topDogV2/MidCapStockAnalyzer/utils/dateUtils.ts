// src/utils/dateUtils.ts
import { format, subDays, addDays, isWeekend, parse } from 'date-fns';

export const getLatestTradingDay = (date = new Date()): string => {
  // If weekend, go back to Friday
  let targetDate = date;
  while (isWeekend(targetDate)) {
    targetDate = subDays(targetDate, 1);
  }
  
  return format(targetDate, 'yyyy-MM-dd');
};

export const getMarketOpenTime = (): string => {
  // US market opens at 9:30 AM ET
  return '09:30:00';
};

export const getPreMarketStart = (date = new Date()): string => {
  // Pre-market trading can start as early as 4:00 AM ET
  return format(date, 'yyyy-MM-dd') + ' 04:00:00';
};

export const getMarketOpenDateTime = (date = new Date()): string => {
  // US market opens at 9:30 AM ET
  return format(date, 'yyyy-MM-dd') + ' 09:30:00';
};

export const formatDateForApi = (date: Date): string => {
  return format(date, 'yyyy-MM-dd');
};

export const parseDateString = (dateStr: string): Date => {
  // Handle different date formats
  if (dateStr.includes('-')) {
    return parse(dateStr, 'yyyy-MM-dd', new Date());
  } else {
    return parse(dateStr, 'MM/dd/yyyy', new Date());
  }
};

export const getNow = (): string => {
  // Returns the current date and time in a format compatible with the stock system
  // Format: 'yyyy-MM-dd HH:mm:ss'
  return format(new Date(), 'yyyy-MM-dd HH:mm:ss');
};

export const getDateRanges = (date: Date | string) => {
  // Convert string to Date if needed
  const targetDate = typeof date === 'string' ? parseDateString(date) : date;
  
  return {
    today: format(targetDate, 'yyyy-MM-dd'),
    yesterday: format(subDays(targetDate, 1), 'yyyy-MM-dd'),
    oneWeekAgo: format(subDays(targetDate, 7), 'yyyy-MM-dd'),
    twoWeeksAgo: format(subDays(targetDate, 14), 'yyyy-MM-dd'),
    oneMonthAgo: format(subDays(targetDate, 30), 'yyyy-MM-dd'),
    nextWeek: format(addDays(targetDate, 7), 'yyyy-MM-dd')
  };
};