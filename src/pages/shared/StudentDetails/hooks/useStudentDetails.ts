import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useStudentStore } from '../../../../stores/studentStore';
import { StudentClass, Checkin, Payment } from '../../../../types';
import { studentService } from '../../../../services/studentService';
import { checkinService } from '../../../../services/checkinService';
import { paymentService } from '../../../../services/paymentService';

export type TabType = 'details' | 'belt-progression' | 'classes' | 'checkins' | 'payments';

export const useStudentDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { 
    selectedStudent: student, 
    fetchStudentById, 
    deleteStudent,
    isLoading, 
    error, 
    clearError 
  } = useStudentStore();

  // Local state
  const [activeTab, setActiveTab] = useState<TabType>('details');
  const [classes, setClasses] = useState<StudentClass[]>([]);
  const [checkins, setCheckins] = useState<Checkin[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [isLoadingRelatedData, setIsLoadingRelatedData] = useState(false);

  // Load student data when component mounts
  useEffect(() => {
    if (id) {
      fetchStudentById(id);
    }
  }, [id, fetchStudentById]);

  // Load related data when student is loaded
  useEffect(() => {
    if (student?.id) {
      loadRelatedData(student.id);
    }
  }, [student?.id]);

  const loadRelatedData = async (studentId: string) => {
    setIsLoadingRelatedData(true);
    try {
      // Fetch student's related data in parallel
      const [classesResponse, checkinsResponse, paymentsResponse] = await Promise.all([
        studentService.getStudentClasses(studentId),
        checkinService.getByStudent(studentId),
        paymentService.getByStudent(studentId)
      ]);
      
      setClasses(classesResponse);
      setCheckins(checkinsResponse);
      setPayments(paymentsResponse);
    } catch (error) {
      console.error('Error loading related data:', error);
      // Set empty arrays on error to prevent UI issues
      setClasses([]);
      setCheckins([]);
      setPayments([]);
    } finally {
      setIsLoadingRelatedData(false);
    }
  };

  const refreshStudentData = () => {
    if (id) {
      fetchStudentById(id);
      if (student?.id) {
        loadRelatedData(student.id);
      }
    }
  };

  const refreshPaymentsData = async () => {
    if (student?.id) {
      try {
        const paymentsResponse = await paymentService.getByStudent(student.id);
        setPayments(paymentsResponse);
      } catch (error) {
        console.error('Error refreshing payments data:', error);
      }
    }
  };

  const handleEdit = () => {
    if (student?.id) {
      navigate(`/students/edit/${student.id}`);
    }
  };

  const handleDelete = async () => {
    if (student?.id && window.confirm('Tem certeza que deseja excluir este aluno?')) {
      try {
        await deleteStudent(student.id);
        navigate('/students', { 
          state: { message: 'Aluno excluído com sucesso!' }
        });
      } catch (error) {
        // Error is handled by the store
      }
    }
  };

  // Helper functions
  const getStatusColor = (status: string): string => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'inactive':
        return 'bg-gray-100 text-gray-800';
      case 'suspended':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getBeltDisplay = (belt?: string, degree?: number): string => {
    if (!belt) return 'Não definida';
    
    if (degree && degree > 0) {
      return `${belt} ${degree}º grau`;
    }
    
    return belt;
  };

  const getStatusText = (status: string): string => {
    switch (status) {
      case 'active':
        return 'Ativo';
      case 'inactive':
        return 'Inativo';
      case 'suspended':
        return 'Suspenso';
      default:
        return status;
    }
  };

  return {
    // Data
    student,
    classes,
    checkins,
    payments,
    
    // State
    activeTab,
    isLoading: isLoading || isLoadingRelatedData,
    error,
    
    // Actions
    setActiveTab,
    handleEdit,
    handleDelete,
    clearError,
    refreshStudentData,
    refreshPaymentsData,
    
    // Helpers
    getStatusColor,
    getStatusText,
    getBeltDisplay,
  };
}; 