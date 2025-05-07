// src/utils/dateUtils.ts
import { format, subDays, addDays, isWeekend } from 'date-fns';

export const getLatestTradingDay = (date = new Date()): string => {
  // If weekend, go back to Friday
  let targetDate = date;
  while (isWeekend(targetDate)) {
    targetDate = subDays(targetDate, 1);
  }
  
  return format(targetDate, 'yyyy-MM-dd');
};

export const getMarketOpenTime = (date = new Date()): string => {
  // US market opens at 9:30 AM ET
  return '09:30:00';
};

export const formatDateForApi = (date: Date): string => {
  return format(date, 'yyyy-MM-dd');
};