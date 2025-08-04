import { useEffect, useState, useCallback } from 'react';
import { useClassStore, useClassSelectors } from '../../../stores';
import { FilterParams } from '../../../types';
import { formatTime } from '../../../utils/dateUtils';

export const useClasses = () => {
  // Store actions
  const { 
    fetchClasses, 
    deleteClass, 
    setFilters, 
    clearError,
    setPage,
    setLimit 
  } = useClassStore();

  // Store selectors
  const {
    classes,
    isLoading,
    isDeleting,
    error,
    hasError,
    isEmpty,
    pagination,
    // filters,
    activeClasses,
    totalClasses
  } = useClassSelectors();

  console.log('classes', classes);

  // Local state for search and filters
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  // Stats computation
  const stats = {
    totalClasses: totalClasses,
    activeClasses: activeClasses.length,
    totalStudents: classes.reduce((sum, classItem) => sum + (classItem.max_students || 0), 0),
    todayClasses: classes.filter(classItem => {
      const today = new Date().getDay();
      return classItem.days_of_week.includes(today) && classItem.status === 'active';
    }).length
  };

  // Helper functions
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'inactive':
        return 'bg-yellow-100 text-yellow-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      case 'planned':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'Iniciante':
        return 'bg-green-100 text-green-800';
      case 'Intermediário':
        return 'bg-yellow-100 text-yellow-800';
      case 'Avançado':
        return 'bg-red-100 text-red-800';
      case 'Todos os níveis':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatSchedule = (daysOfWeek: number[], startTime: string, endTime: string) => {
    const dayNames = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
    const daysList = daysOfWeek.map(day => dayNames[day]).join(', ');
    
    const start = formatTime(startTime);
    const end = formatTime(endTime);
    return `${daysList} - ${start}-${end}`;
  };

  const getStudentsFillPercentage = (current: number, max: number) => {
    return max > 0 ? (current / max) * 100 : 0;
  };

  // Actions
  const handleSearch = useCallback((term: string) => {
    setSearchTerm(term);
    const filters: FilterParams = { 
      search: term || undefined,
      status: statusFilter !== 'all' ? statusFilter : undefined,
      page: 1 
    };
    setFilters(filters);
    fetchClasses(filters);
  }, [statusFilter, setFilters, fetchClasses]);

  const handleStatusFilter = useCallback((status: string) => {
    setStatusFilter(status);
    const filters: FilterParams = { 
      search: searchTerm || undefined,
      status: status !== 'all' ? status : undefined,
      page: 1 
    };
    setFilters(filters);
    fetchClasses(filters);
  }, [searchTerm, setFilters, fetchClasses]);

  const handleDelete = useCallback(async (id: string) => {
    if (window.confirm('Tem certeza que deseja excluir esta aula?')) {
      await deleteClass(id);
    }
  }, [deleteClass]);

  const handlePageChange = useCallback((page: number) => {
    setPage(page);
  }, [setPage]);

  const handleLimitChange = useCallback((limit: number) => {
    setLimit(limit);
  }, [setLimit]);

  const refreshClasses = useCallback(() => {
    fetchClasses();
  }, [fetchClasses]);

  const dismissError = useCallback(() => {
    clearError();
  }, [clearError]);

  // Effects
  useEffect(() => {
    fetchClasses();
  }, [fetchClasses]);

  return {
    // Data
    classes,
    stats,
    
    // State
    isLoading,
    isDeleting,
    error,
    hasError,
    isEmpty,
    pagination,
    searchTerm,
    statusFilter,
    
    // Actions
    handleSearch,
    handleStatusFilter,
    handleDelete,
    handlePageChange,
    handleLimitChange,
    refreshClasses,
    dismissError,
    setSearchTerm,
    setStatusFilter,
    
    // Helpers
    getStatusColor,
    getLevelColor,
    formatSchedule,
    getStudentsFillPercentage,
  };
}; 