import { useEffect, useMemo } from 'react';
import { useCheckinStore, useClassStore } from '../../../stores';
import { CheckinCreateData } from '../../../services/checkinService';

export const useCheckin = () => {
  const {
    todayCheckins,
    isLoadingToday,
    isCreating,
    error,
    fetchTodayCheckins,
    createCheckin,
    clearError,
  } = useCheckinStore();

  const {
    schedule,
    isLoadingSchedule,
    fetchSchedule,
  } = useClassStore();

  // Fetch data on mount
  useEffect(() => {
    fetchTodayCheckins();
    fetchSchedule();
  }, [fetchTodayCheckins, fetchSchedule]);

  // Process today's classes with checkin data
  const todayClasses = useMemo(() => {
    if (!schedule) return [];
    
    const today = new Date();
    const dayNames = ['Domingo', 'Segunda-feira', 'Terça-feira', 'Quarta-feira', 'Quinta-feira', 'Sexta-feira', 'Sábado'];
    const currentDayName = dayNames[today.getDay()];
    
    // Get classes for today from the schedule object
    const todayClassesFromSchedule = schedule[currentDayName] || [];
    
    return todayClassesFromSchedule
      .filter(classItem => classItem.status === 'active')
      .map(classItem => {
        const classCheckins = todayCheckins.filter(checkin => checkin.classId === classItem.id);
        const totalStudents = classItem.max_students || 0;
        const checkedInStudents = classCheckins.length;
        
        // Determine class status based on time
        const now = new Date();
        const startTime = new Date(classItem.start_time);
        const endTime = new Date(classItem.end_time);
        
        // Set times to today's date for comparison
        startTime.setFullYear(now.getFullYear(), now.getMonth(), now.getDate());
        endTime.setFullYear(now.getFullYear(), now.getMonth(), now.getDate());
        
        let status = 'Agendada';
        if (now >= startTime && now <= endTime) {
          status = 'Em Andamento';
        } else if (now > endTime) {
          status = 'Finalizada';
        }

        return {
          id: classItem.id,
          name: classItem.name,
          teacher: classItem.teacher?.full_name || 'N/A',
          time: `${formatTime(classItem.start_time)} - ${formatTime(classItem.end_time)}`,
          totalStudents,
          checkedInStudents,
          status,
          room: 'Dojo 1', // Default room - could be added to class model
          level: classItem.belt_requirement || 'Todos os níveis',
        };
      });
  }, [schedule, todayCheckins]);

  // Process recent checkins
  const recentCheckins = useMemo(() => {
    return todayCheckins
      .sort((a, b) => new Date(b.checkinTime).getTime() - new Date(a.checkinTime).getTime())
      .slice(0, 10)
      .map(checkin => ({
        id: checkin.id,
        studentName: checkin.student?.full_name || 'N/A',
        className: checkin.class?.name || 'N/A',
        time: formatTime(checkin.checkinTime),
        method: checkin.method === 'qr_code' ? 'QR Code' : 'Manual',
        avatar: getAvatarEmoji(checkin.student?.full_name || ''),
        status: 'success',
      }));
  }, [todayCheckins]);

  // Calculate stats
  const stats = useMemo(() => {
    const totalCheckins = todayCheckins.length;
    const totalStudentsToday = todayClasses.reduce((sum, cls) => sum + cls.totalStudents, 0);
    const totalCheckedIn = todayClasses.reduce((sum, cls) => sum + cls.checkedInStudents, 0);
    const activeClasses = todayClasses.filter(cls => cls.status === 'Em Andamento').length;

    return {
      totalCheckins,
      activeClasses,
      attendancePercentage: totalStudentsToday > 0 ? Math.round((totalCheckedIn / totalStudentsToday) * 100) : 0,
      totalClasses: todayClasses.length,
    };
  }, [todayCheckins, todayClasses]);

  // Handle checkin creation
  const handleCreateCheckin = async (data: CheckinCreateData) => {
    try {
      const checkinData = {
        studentId: data.student_id,
        classId: data.class_id,
        checkinDate: new Date().toISOString().split('T')[0],
        checkinTime: new Date().toISOString(),
        method: data.type,
        notes: data.notes,
      };
      
      await createCheckin(checkinData);
      return true;
    } catch (error) {
      console.error('Error creating checkin:', error);
      return false;
    }
  };

  // Utility functions
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Em Andamento':
        return 'bg-green-100 text-green-800';
      case 'Agendada':
        return 'bg-blue-100 text-blue-800';
      case 'Finalizada':
        return 'bg-gray-100 text-gray-800';
      case 'Cancelada':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getAttendancePercentage = (checkedIn: number, total: number) => {
    return total > 0 ? Math.round((checkedIn / total) * 100) : 0;
  };

  const getMethodIcon = (method: string) => {
    return method === 'QR Code' ? '📱' : '✋';
  };

  return {
    // Data
    todayClasses,
    recentCheckins,
    stats,
    
    // Loading states
    isLoading: isLoadingToday || isLoadingSchedule,
    isCreating,
    
    // Error handling
    error,
    clearError,
    
    // Actions
    handleCreateCheckin,
    
    // Utilities
    getStatusColor,
    getAttendancePercentage,
    getMethodIcon,
  };
};

// Helper functions
const formatTime = (timeString: string) => {
  try {
    const date = new Date(timeString);
    return date.toLocaleTimeString('pt-BR', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: false 
    });
  } catch {
    return timeString;
  }
};

const getAvatarEmoji = (name: string) => {
  // Simple avatar assignment based on name
  const emojis = ['👨', '👩', '👦', '👧', '🧑'];
  const index = name.length % emojis.length;
  return emojis[index];
}; 