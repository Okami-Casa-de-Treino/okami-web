import React from 'react';
import { StudentsHeader } from './components/StudentsHeader';
import { StudentsFilters } from './components/StudentsFilters';
import { StudentsStats } from './components/StudentsStats';
import { StudentsTable } from './components/StudentsTable';
import { ErrorDisplay } from './components/ErrorDisplay';
import { useStudents } from './hooks/useStudents';

const StudentsScreen: React.FC = () => {
  const {
    students,
    isLoading,
    isDeleting,
    error,
    pagination,
    searchTerm,
    handleSearch,
    handleDeleteStudent,
    clearError,
    fetchStudents
  } = useStudents();

  return (
    <div className="space-y-6">
      <StudentsHeader />
      
      <ErrorDisplay error={error} onClearError={clearError} />
      
      <StudentsFilters searchTerm={searchTerm} onSearch={handleSearch} />
      
      <StudentsStats students={students} pagination={pagination} />
      
      <StudentsTable
        students={students}
        isLoading={isLoading}
        isDeleting={isDeleting}
        pagination={pagination}
        onDeleteStudent={handleDeleteStudent}
        onFetchStudents={fetchStudents}
      />
    </div>
  );
};

export default StudentsScreen; 