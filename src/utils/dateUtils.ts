import dayjs from 'dayjs';
import 'dayjs/locale/pt-br';
import relativeTime from 'dayjs/plugin/relativeTime';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import utc from 'dayjs/plugin/utc';

// Configure dayjs
dayjs.locale('pt-br');
dayjs.extend(relativeTime);
dayjs.extend(customParseFormat);
dayjs.extend(utc);

/**
 * Format date to Brazilian format (DD/MM/YYYY)
 */
export const formatDate = (date: string | Date): string => {
  return dayjs(date).format('DD/MM/YYYY');
};



/**
 * Format date and time to Brazilian format (DD/MM/YYYY HH:mm)
 */
export const formatDateTime = (date: string | Date): string => {
  return dayjs(date).format('DD/MM/YYYY HH:mm');
};

/**
 * Format time only (HH:mm)
 */
export const formatTime = (date: string | Date): string => {
  // If it's already a time string in HH:mm format, return as is
  if (typeof date === 'string' && date.match(/^\d{2}:\d{2}$/)) {
    return date;
  }
  // If it's an ISO string with timezone, use UTC to avoid timezone conversion
  if (typeof date === 'string' && date.includes('T') && date.includes('Z')) {
    return dayjs.utc(date).format('HH:mm');
  }
  return dayjs(date).format('HH:mm');
};

/**
 * Format date to month and year (Janeiro de 2024)
 */
export const formatMonthYear = (date: string | Date): string => {
  return dayjs(date).format('MMMM [de] YYYY');
};

/**
 * Format date to long format with weekday (Segunda-feira, 15 de Janeiro de 2024)
 */
export const formatLongDate = (date: string | Date): string => {
  return dayjs(date).format('dddd, DD [de] MMMM [de] YYYY');
};

/**
 * Format date to short format with weekday (Seg, 15/01)
 */
export const formatShortDateWithWeekday = (date: string | Date): string => {
  return dayjs(date).format('ddd, DD/MM');
};




/**
 * Calculate age from birth date
 */
export const calculateAge = (birthDate: string | Date): number => {
  return dayjs().diff(dayjs(birthDate), 'year');
};

/**
 * Get relative time (há 2 dias, em 3 horas, etc.)
 */
export const getRelativeTime = (date: string | Date): string => {
  return dayjs(date).fromNow();
};

/**
 * Check if date is today
 */
export const isToday = (date: string | Date): boolean => {
  return dayjs(date).isSame(dayjs(), 'day');
};

/**
 * Check if date is this week
 */
export const isThisWeek = (date: string | Date): boolean => {
  return dayjs(date).isSame(dayjs(), 'week');
};

/**
 * Check if date is this month
 */
export const isThisMonth = (date: string | Date): boolean => {
  return dayjs(date).isSame(dayjs(), 'month');
};

/**
 * Format date for API (YYYY-MM-DD)
 */
export const formatDateForAPI = (date: string | Date): string => {
  return dayjs(date).format('YYYY-MM-DD');
};

/**
 * Format datetime for API (YYYY-MM-DD HH:mm:ss)
 */
export const formatDateTimeForAPI = (date: string | Date): string => {
  return dayjs(date).format('YYYY-MM-DD HH:mm:ss');
};

/**
 * Parse time string (HH:mm) and return formatted time
 */
export const parseAndFormatTime = (timeString: string): string => {
  return dayjs(timeString, 'HH:mm').format('HH:mm');
};

/**
 * Get start of day
 */
export const getStartOfDay = (date: string | Date): Date => {
  return dayjs(date).startOf('day').toDate();
};

/**
 * Get end of day
 */
export const getEndOfDay = (date: string | Date): Date => {
  return dayjs(date).endOf('day').toDate();
};

/**
 * Get days of week in Portuguese (for class schedules)
 */
export const getDaysOfWeek = (): string[] => {
  return ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'];
};

/**
 * Get short days of week in Portuguese
 */
export const getShortDaysOfWeek = (): string[] => {
  return ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
};

/**
 * Format days of week array to readable string
 */
export const formatDaysOfWeek = (days: number[]): string => {
  const dayNames = getDaysOfWeek();
  return days.map(day => dayNames[day]).join(', ');
};

/**
 * Check if date is overdue (past due date)
 */
export const isOverdue = (dueDate: string | Date): boolean => {
  return dayjs(dueDate).isBefore(dayjs(), 'day');
};

/**
 * Get days until date
 */
export const getDaysUntil = (date: string | Date): number => {
  return dayjs(date).diff(dayjs(), 'day');
};

/**
 * Format duration in minutes to readable format (1h 30min)
 */
export const formatDuration = (minutes: number): string => {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  
  if (hours === 0) {
    return `${mins}min`;
  }
  
  if (mins === 0) {
    return `${hours}h`;
  }
  
  return `${hours}h ${mins}min`;
};

/**
 * Group items by date (for checkins, payments, etc.)
 */
export const groupByDate = <T extends { created_at?: string; checkin_date?: string; paymentDate?: string; date?: string }>(
  items: T[], 
  dateField: keyof T = 'created_at' as keyof T
): Record<string, T[]> => {
  return items.reduce((groups, item) => {
    const date = item[dateField] as string;
    if (!date) return groups;
    
    const monthYear = formatMonthYear(date);
    if (!groups[monthYear]) {
      groups[monthYear] = [];
    }
    groups[monthYear].push(item);
    return groups;
  }, {} as Record<string, T[]>);
}; 