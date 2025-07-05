import React from 'react';
import { BeltProgressionHeader } from './components/BeltProgressionHeader';
import { BeltProgressionFilters } from './components/BeltProgressionFilters';
import { BeltProgressionStats } from './components/BeltProgressionStats';
import { BeltProgressionTable } from './components/BeltProgressionTable';
import { ErrorDisplay } from './components/ErrorDisplay';
import { useBeltProgression } from './hooks/useBeltProgression';

const BeltProgressionScreen: React.FC = () => {
  const {
    promotions,
    beltOverview,
    isLoading,
    isPromoting,
    error,
    pagination,
    searchTerm,
    handleSearch,
    handlePromoteStudent,
    clearError,
    fetchPromotions
  } = useBeltProgression();


  return (
    <div className="space-y-6">
      <BeltProgressionHeader />
      
      <ErrorDisplay error={error} onClearError={clearError} />
      
      <BeltProgressionFilters searchTerm={searchTerm} onSearch={handleSearch} />
      
      <BeltProgressionStats beltOverview={beltOverview} />
      
      <BeltProgressionTable
        promotions={promotions}
        isLoading={isLoading}
        isPromoting={isPromoting}
        pagination={pagination}
        onPromoteStudent={handlePromoteStudent}
        onFetchPromotions={fetchPromotions}
      />
    </div>
  );
};

export default BeltProgressionScreen; 