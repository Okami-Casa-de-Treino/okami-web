import { useState, useEffect, useMemo } from 'react';
import { usePaymentStore } from '../../../../stores/paymentStore';
import { useStudentStore } from '../../../../stores/studentStore';
import { Payment } from '../../../../types';

interface PaymentFilters {
  status?: 'pending' | 'paid' | 'overdue' | 'cancelled';
  studentId?: string;
  startDate?: string;
  endDate?: string;
  referenceMonth?: string;
}

interface PaymentStats {
  totalRevenue: number;
  pendingCount: number;
  pendingAmount: number;
  overdueCount: number;
  paymentRate: number;
}

interface CreatePaymentData {
  student_id: string;
  amount: number;
  due_date: string;
  reference_month: string;
  discount?: number | null;
  notes?: string | null;
}

interface MarkAsPaidData {
  paymentMethod: 'cash' | 'card' | 'pix' | 'bank_transfer';
  paymentDate?: string;
}

interface GenerateMonthlyData {
  reference_month: string; // Format: YYYY-MM-DD
  due_day: number;
}

interface GenerateMonthlyResponse {
  success: boolean;
  message: string;
  data: {
    reference_month: string;
    due_date: string;
    total_active_students: number;
    students_with_existing_payment: number;
    payments_generated: number;
    debug_info: {
      target_year: number;
      target_month: number;
      students_with_payments: string[];
    };
  };
}

export const useFinancial = () => {
  // Store states
  const {
    payments,
    overduePayments,
    loading,
    error,
    pagination,
    fetchPayments,
    fetchOverduePayments,
    createPayment,
    markAsPaid,
    updatePayment,
    deletePayment,
    generateMonthlyPayments,
    setFilters: setStoreFilters,
    clearFilters: clearStoreFilters,
    setPage,
    clearError
  } = usePaymentStore();

  const { students, fetchStudents } = useStudentStore();

  // Local state
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState<PaymentFilters>({});
  const [currentPage, setCurrentPage] = useState(1);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showMarkAsPaidModal, setShowMarkAsPaidModal] = useState(false);
  const [showGenerateModal, setShowGenerateModal] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null);

  // Initialize data
  useEffect(() => {
    fetchPayments();
    fetchOverduePayments();
    fetchStudents();
  }, [fetchPayments, fetchOverduePayments, fetchStudents]);

  // Update store filters when local filters change
  useEffect(() => {
    const storeFiltersUpdate = {
      ...filters,
      ...(searchTerm && { search: searchTerm })
    };
    setStoreFilters(storeFiltersUpdate);
  }, [filters, searchTerm, setStoreFilters]);

  // Update pagination
  useEffect(() => {
    setPage(currentPage);
  }, [currentPage, setPage]);

  // Computed stats
  const stats = useMemo((): PaymentStats => {
    const paymentsArray = Array.isArray(payments) ? payments : [];
    const overdueArray = Array.isArray(overduePayments) ? overduePayments : [];
    
    const paidPayments = paymentsArray.filter(p => p.status === 'paid');
    const pendingPayments = paymentsArray.filter(p => p.status === 'pending' || p.status === 'overdue');
    
    return {
      totalRevenue: paidPayments.reduce((sum, p) => {
        const amount = typeof p.amount === 'string' ? parseFloat(p.amount) : (p.amount || 0);
        const discount = typeof p.discount === 'string' ? parseFloat(p.discount) : (p.discount || 0);
        const lateFee = typeof p.late_fee === 'string' ? parseFloat(p.late_fee) : (p.late_fee || 0);
        return sum + (amount + lateFee - discount);
      }, 0),
      pendingCount: pendingPayments.length,
      pendingAmount: pendingPayments.reduce((sum, p) => {
        const amount = typeof p.amount === 'string' ? parseFloat(p.amount) : (p.amount || 0);
        const discount = typeof p.discount === 'string' ? parseFloat(p.discount) : (p.discount || 0);
        const lateFee = typeof p.late_fee === 'string' ? parseFloat(p.late_fee) : (p.late_fee || 0);
        return sum + (amount + lateFee - discount);
      }, 0),
      overdueCount: overdueArray.length,
      paymentRate: paymentsArray.length > 0 ? Math.round((paidPayments.length / paymentsArray.length) * 100) : 0
    };
  }, [payments, overduePayments]);

  // Handlers
  const handleCreatePayment = async (data: CreatePaymentData): Promise<boolean> => {
    try {
      const paymentData = {
        ...data,
        discount: data.discount ?? undefined,
        notes: data.notes ?? undefined
      };
      const result = await createPayment(paymentData);
      if (result) {
        setShowCreateModal(false);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error creating payment:', error);
      return false;
    }
  };

  const handleMarkAsPaid = async (paymentId: string, data: MarkAsPaidData): Promise<boolean> => {
    try {
      const result = await markAsPaid(paymentId, data.paymentMethod, data.paymentDate);
      if (result) {
        setShowMarkAsPaidModal(false);
        setSelectedPayment(null);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error marking payment as paid:', error);
      return false;
    }
  };

  const handleEditPayment = async (paymentId: string, data: Partial<Payment>): Promise<boolean> => {
    try {
      const result = await updatePayment(paymentId, data);
      if (result) {
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error updating payment:', error);
      return false;
    }
  };

  const handleDeletePayment = async (paymentId: string): Promise<boolean> => {
    try {
      const result = await deletePayment(paymentId);
      return result;
    } catch (error) {
      console.error('Error deleting payment:', error);
      return false;
    }
  };

  const handleGenerateMonthly = async (data: GenerateMonthlyData): Promise<GenerateMonthlyResponse> => {
    try {
      const result = await generateMonthlyPayments(data.reference_month, data.due_day);
      return result as unknown as GenerateMonthlyResponse;
    } catch (error) {
      console.error('Error generating monthly payments:', error);
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Erro ao gerar pagamentos mensais',
        data: {
          reference_month: '',
          due_date: '',
          total_active_students: 0,
          students_with_existing_payment: 0,
          payments_generated: 0,
          debug_info: {
            target_year: 0,
            target_month: 0,
            students_with_payments: []
          }
        }
      };
    }
  };

  const handleFiltersChange = (newFilters: Partial<PaymentFilters>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  };

  const handleClearFilters = () => {
    setFilters({});
    setSearchTerm('');
    clearStoreFilters();
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return {
    // Data
    payments,
    overduePayments,
    students,
    loading,
    error,
    pagination,
    
    // Filters and search
    filters,
    searchTerm,
    setSearchTerm,
    setFilters: handleFiltersChange,
    clearFilters: handleClearFilters,
    
    // Pagination
    currentPage,
    setCurrentPage: handlePageChange,
    
    // Actions
    handleCreatePayment,
    handleMarkAsPaid,
    handleEditPayment,
    handleDeletePayment,
    handleGenerateMonthly,
    
    // Modals
    showCreateModal,
    setShowCreateModal,
    showMarkAsPaidModal,
    setShowMarkAsPaidModal,
    showGenerateModal,
    setShowGenerateModal,
    selectedPayment,
    setSelectedPayment,
    
    // Stats
    stats,
    
    // Utilities
    clearError
  };
}; 