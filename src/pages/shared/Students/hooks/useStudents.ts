import { useEffect, useState } from 'react';
import { useStudentStore } from '../../../../stores/studentStore';

export const useStudents = () => {
  const {
    students,
    isLoading,
    isDeleting,
    error,
    pagination,
    fetchStudents,
    deleteStudent,
    setFilters,
    clearError
  } = useStudentStore();

  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchStudents();
  }, [fetchStudents]);

  const handleSearch = (term: string) => {
    setSearchTerm(term);
    setFilters({ search: term });
  };

  const handleDeleteStudent = async (id: string) => {
    if (window.confirm('Tem certeza que deseja excluir este aluno?')) {
      try {
        await deleteStudent(id);
        // Student deleted successfully
      } catch (error) {
        // Error is handled by the store
      }
    }
  };

  return {
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
  };
}; 