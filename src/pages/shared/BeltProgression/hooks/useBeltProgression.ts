import { useState, useEffect, useCallback } from 'react';
import { useBeltProgressionStore, useBeltProgressionSelectors } from '../../../../stores';
import { PromoteStudentData, UpdatePromotionData } from '../../../../types';

export const useBeltProgression = () => {
  const [searchTerm, setSearchTerm] = useState('');
  
  // Store actions
  const {
    fetchPromotions,
    fetchBeltOverview,
    promoteStudent,
    updatePromotion,
    deletePromotion,
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
  const handlePromoteStudent = useCallback(async (data: unknown): Promise<unknown> => {
    // Cast data to PromoteStudentData
    const result = await promoteStudent(data as PromoteStudentData);
    await fetchBeltOverview();
    return result;
  }, [promoteStudent, fetchBeltOverview]);

  // Handle update promotion
  const handleUpdatePromotion = useCallback(async (id: string, data: UpdatePromotionData) => {
    const result = await updatePromotion(id, data);
    // Refresh overview after update
    await fetchBeltOverview();
    return result;
  }, [updatePromotion, fetchBeltOverview]);

  // Handle delete promotion
  const handleDeletePromotion = useCallback(async (id: string) => {
    await deletePromotion(id);
    // Refresh overview after deletion
    await fetchBeltOverview();
  }, [deletePromotion, fetchBeltOverview]);

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
    handleUpdatePromotion,
    handleDeletePromotion,
    clearError,
    fetchPromotions: handleRefresh,
  };
}; 