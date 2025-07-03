import { useState, useEffect, useCallback } from 'react';
import { useBeltProgressionStore, useBeltProgressionSelectors } from '../../../../stores';
import { PromoteStudentData } from '../../../../types';

export const useBeltProgression = () => {
  const [searchTerm, setSearchTerm] = useState('');
  
  // Store actions
  const {
    fetchPromotions,
    fetchBeltOverview,
    promoteStudent,
    clearError,
    setFilters,
  } = useBeltProgressionStore();

  // Store selectors
  const {
    promotions,
    beltOverview,
    isLoading,
    isPromoting,
    isLoadingOverview,
    error,
    pagination,
    filters,
    hasPromotions,
    hasError,
  } = useBeltProgressionSelectors();

  // Initialize data
  useEffect(() => {
    fetchPromotions();
    fetchBeltOverview();
  }, [fetchPromotions, fetchBeltOverview]);

  // Handle search
  const handleSearch = useCallback((term: string) => {
    setSearchTerm(term);
    setFilters({ search: term, page: 1 });
    fetchPromotions({ search: term, page: 1 });
  }, [setFilters, fetchPromotions]);

  // Handle promote student
  const handlePromoteStudent = useCallback(async (data: PromoteStudentData) => {
    try {
      const result = await promoteStudent(data);
      // Refresh overview after promotion
      await fetchBeltOverview();
      return result;
    } catch (error) {
      throw error;
    }
  }, [promoteStudent, fetchBeltOverview]);

  // Handle refresh
  const handleRefresh = useCallback(() => {
    fetchPromotions(filters);
    fetchBeltOverview();
  }, [fetchPromotions, fetchBeltOverview, filters]);

  return {
    // Data
    promotions,
    beltOverview,
    pagination,
    
    // State
    isLoading,
    isPromoting,
    isLoadingOverview,
    error,
    searchTerm,
    hasPromotions,
    hasError,
    
    // Actions
    handleSearch,
    handlePromoteStudent,
    clearError,
    fetchPromotions: handleRefresh,
  };
}; 