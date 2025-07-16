import { useEffect, useMemo, useState } from 'react';
import { useAuthStore } from '../../../stores/authStore';
import { studentService } from '../../../services/studentService';
import { StudentClass } from '../../../types';
import { formatTime, formatDaysOfWeek } from '../../../utils/dateUtils';
import dayjs from 'dayjs';
import isBetween from 'dayjs/plugin/isBetween';

dayjs.extend(isBetween);

interface UseStudentClassesReturn {
  // Data
  enrolledClasses: StudentClass[];
  upcomingClasses: StudentClass[];
  pastClasses: StudentClass[];
  
  // Loading states
  isLoading: boolean;
  
  // Error handling
  error: string | null;
  clearError: () => void;
  
  // Actions
  refreshClasses: () => Promise<void>;
  
  // Utilities
  formatTime: (timeString: string) => string;
  formatDaysOfWeek: (days: number[]) => string;
  getClassStatus: (classItem: StudentClass) => string;
}

export const useStudentClasses = (): UseStudentClassesReturn => {
  const { user } = useAuthStore();
  const [enrolledClasses, setEnrolledClasses] = useState<StudentClass[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const studentId = user?.studentId || user?.student?.id || user?.id;

  const fetchStudentClasses = async () => {
    if (!studentId) {
      setError('Student ID not found');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const classes = await studentService.getStudentClasses(studentId);
      setEnrolledClasses(classes);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch classes');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchStudentClasses();
  }, [studentId]);

  // Process classes into upcoming and past
  const { upcomingClasses, pastClasses } = useMemo(() => {
    if (!enrolledClasses.length) {
      return { upcomingClasses: [], pastClasses: [] };
    }

    const now = new Date();

    return enrolledClasses.reduce(
      (acc: { upcomingClasses: StudentClass[]; pastClasses: StudentClass[] }, classItem: StudentClass) => {
        if (!classItem.class) return acc;

        // For recurring classes, we need to check if the class day is today or in the future
        // Since classes have days_of_week, we'll consider classes that occur on today or future days of the week
        const todayDayOfWeek = now.getDay();
        const classDaysOfWeek = classItem.class.days_of_week || [];
        
        // Check if this class occurs on today or future days of the week
        const hasUpcomingOccurrence = classDaysOfWeek.some(day => day >= todayDayOfWeek);
        
        if (hasUpcomingOccurrence) {
          acc.upcomingClasses.push(classItem);
        } else {
          acc.pastClasses.push(classItem);
        }

        return acc;
      },
      { upcomingClasses: [] as StudentClass[], pastClasses: [] as StudentClass[] }
    );
  }, [enrolledClasses]);

  const clearError = () => setError(null);

  const refreshClasses = async () => {
    await fetchStudentClasses();
  };

  const getClassStatus = (classItem: StudentClass): string => {
    if (!classItem.class) return 'Desconhecido';

    const now = dayjs();
    const todayDayOfWeek = now.day();
    const classDaysOfWeek = classItem.class.days_of_week || [];
    
    // Check if class occurs today
    const isToday = classDaysOfWeek.includes(todayDayOfWeek);
    
    if (!isToday) {
      return 'Agendada';
    }

    // If it's today, check the time
    const startTime = dayjs(classItem.class.start_time);
    const endTime = dayjs(classItem.class.end_time);

    // Set times to today's date for comparison
    const today = now.startOf('day');
    const classStartTime = today.hour(startTime.hour()).minute(startTime.minute());
    const classEndTime = today.hour(endTime.hour()).minute(endTime.minute());

    if (now.isBefore(classStartTime)) {
      return 'Agendada';
    } else if (now.isBetween(classStartTime, classEndTime, null, '[]')) {
      return 'Em Andamento';
    } else {
      return 'Finalizada';
    }
  };

  return {
    enrolledClasses,
    upcomingClasses,
    pastClasses,
    isLoading,
    error,
    clearError,
    refreshClasses,
    formatTime: (timeString: string) => formatTime(timeString),
    formatDaysOfWeek,
    getClassStatus,
  };
}; 