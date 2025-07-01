import { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useClassStore, useTeacherStore } from '../../../stores';

import { TabType } from '../ClassDetails/types';

export const useClassDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const { 
    fetchClassById, 
    fetchClassStudents, 
    fetchClassCheckins,
    deleteClass,
    selectedClass,
    classStudents,
    classCheckins,
    isLoading,
    isDeleting,
    error,
    clearError 
  } = useClassStore();

  const { fetchTeachers } = useTeacherStore();

  const [activeTab, setActiveTab] = useState<TabType>('details');
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  // Load class data when component mounts
  useEffect(() => {
    if (id) {
      fetchClassById(id);
      fetchClassStudents(id);
      fetchClassCheckins(id);
    }
  }, [id, fetchClassById, fetchClassStudents, fetchClassCheckins]);

  // Load teachers for display
  useEffect(() => {
    fetchTeachers({ limit: 100 });
  }, [fetchTeachers]);

  const handleEdit = useCallback(() => {
    if (id) {
      navigate(`/classes/${id}/edit`);
    }
  }, [id, navigate]);

  const handleDelete = useCallback(async () => {
    if (id) {
      try {
        await deleteClass(id);
        navigate('/classes', {
          state: { message: 'Aula excluída com sucesso!' }
        });
      } catch (err) {
        console.error('Failed to delete class:', err);
      }
    }
  }, [id, deleteClass, navigate]);

  const confirmDelete = useCallback(() => {
    setShowDeleteModal(true);
  }, []);

  const cancelDelete = useCallback(() => {
    setShowDeleteModal(false);
  }, []);

  const dismissError = useCallback(() => {
    clearError();
  }, [clearError]);

  const refreshClassData = useCallback(() => {
    if (id) {
      fetchClassById(id);
      fetchClassStudents(id);
      fetchClassCheckins(id);
    }
  }, [id, fetchClassById, fetchClassStudents, fetchClassCheckins]);

  // Helper functions
  const formatDaysOfWeek = (days: number[]): string => {
    const dayNames = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
    return days.map(day => dayNames[day]).join(', ');
  };

  const formatTime = (timeString: string): string => {
    if (!timeString) return '';
    try {
      // Handle both ISO format and HH:MM format
      if (timeString.includes('T')) {
        const date = new Date(timeString);
        return date.toTimeString().slice(0, 5);
      }
      return timeString.slice(0, 5);
    } catch {
      return timeString;
    }
  };

  const getDuration = (startTime: string, endTime: string): string => {
    if (!startTime || !endTime) return '';
    try {
      const start = new Date(`2000-01-01T${formatTime(startTime)}:00`);
      const end = new Date(`2000-01-01T${formatTime(endTime)}:00`);
      const diffMs = end.getTime() - start.getTime();
      const diffMins = Math.round(diffMs / (1000 * 60));
      const hours = Math.floor(diffMins / 60);
      const mins = diffMins % 60;
      return hours > 0 ? `${hours}h ${mins}min` : `${mins}min`;
    } catch {
      return '';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'inactive':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStudentsFillPercentage = (currentStudents: number, maxStudents: number): number => {
    if (maxStudents === 0) return 0;
    return Math.round((currentStudents / maxStudents) * 100);
  };

  return {
    // Data
    classData: selectedClass,
    students: classStudents,
    checkins: classCheckins,
    
    // State
    activeTab,
    showDeleteModal,
    isLoading,
    isDeleting,
    error,
    
    // Actions
    setActiveTab,
    handleEdit,
    handleDelete,
    confirmDelete,
    cancelDelete,
    dismissError,
    refreshClassData,
    
    // Helpers
    formatDaysOfWeek,
    formatTime,
    getDuration,
    getStatusColor,
    getStudentsFillPercentage,
  };
}; 