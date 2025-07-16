import { useState, useEffect, useMemo } from 'react';
import { useExpenseStore } from '../../../../stores/expenseStore';
import { Expense } from '../../../../types';

interface ExpenseFilters {
  category?: 'rent' | 'utilities' | 'equipment' | 'maintenance' | 'marketing' | 'insurance' | 'taxes' | 'salary' | 'other';
  status?: 'pending' | 'paid' | 'cancelled';
  startDate?: string;
  endDate?: string;
}

interface ExpenseStats {
  totalExpenses: number;
  pendingCount: number;
  pendingAmount: number;
  paidCount: number;
  paidAmount: number;
  averageExpense: number;
}

interface CreateExpenseData {
  title: string;
  description?: string;
  amount: number | string;
  category: 'rent' | 'utilities' | 'equipment' | 'maintenance' | 'marketing' | 'insurance' | 'taxes' | 'salary' | 'other';
  expense_date: string;
  due_date: string;
  payment_method?: 'cash' | 'card' | 'bank_transfer';
  status?: 'pending' | 'paid' | 'cancelled';
  receipt_url?: string;
  notes?: string;
}

export const useExpenses = () => {
  // Store states
  const {
    expenses,
    loading,
    error,
    pagination,
    fetchExpenses,
    createExpense,
    updateExpense,
    deleteExpense,
    setPage
  } = useExpenseStore();

  // Local state
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState<ExpenseFilters>({});
  const [currentPage, setCurrentPage] = useState(1);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedExpense, setSelectedExpense] = useState<Expense | null>(null);

  // Initialize data
  useEffect(() => {
    fetchExpenses();
  }, [fetchExpenses]);

  // Update filters and fetch data
  useEffect(() => {
    const params = {
      page: currentPage,
      ...filters,
      ...(searchTerm && { search: searchTerm })
    };
    fetchExpenses(params);
  }, [filters, searchTerm, currentPage, fetchExpenses]);

  // Computed stats
  const stats = useMemo((): ExpenseStats => {
    const expensesArray = Array.isArray(expenses) ? expenses : [];
    
    const paidExpenses = expensesArray.filter(e => e.status === 'paid');
    const pendingExpenses = expensesArray.filter(e => e.status === 'pending');
    
    const totalAmount = expensesArray.reduce((sum, e) => sum + Number(e.amount || 0), 0);
    const paidAmount = paidExpenses.reduce((sum, e) => sum + Number(e.amount || 0), 0);
    const pendingAmount = pendingExpenses.reduce((sum, e) => sum + Number(e.amount || 0), 0);
    
    return {
      totalExpenses: expensesArray.length,
      pendingCount: pendingExpenses.length,
      pendingAmount,
      paidCount: paidExpenses.length,
      paidAmount,
      averageExpense: expensesArray.length > 0 ? totalAmount / expensesArray.length : 0
    };
  }, [expenses]);

  // Handlers
  const handleCreateExpense = async (data: CreateExpenseData): Promise<boolean> => {
    try {
      const expenseData = {
        ...data,
        description: data.description || undefined,
        payment_method: data.payment_method || undefined,
        status: data.status || 'pending',
        receipt_url: data.receipt_url || undefined,
        notes: data.notes || undefined
      };
      const result = await createExpense(expenseData);
      if (result) {
        setShowCreateModal(false);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error creating expense:', error);
      return false;
    }
  };

  const handleEditExpense = async (expenseId: string, data: Partial<Expense>): Promise<boolean> => {
    try {
      const result = await updateExpense(expenseId, data);
      if (result) {
        setShowEditModal(false);
        setSelectedExpense(null);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error updating expense:', error);
      return false;
    }
  };

  const handleDeleteExpense = async (expenseId: string): Promise<boolean> => {
    try {
      const result = await deleteExpense(expenseId);
      return result;
    } catch (error) {
      console.error('Error deleting expense:', error);
      return false;
    }
  };

  const handleFiltersChange = (newFilters: Partial<ExpenseFilters>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
    setCurrentPage(1); // Reset to first page when filters change
  };

  const handleClearFilters = () => {
    setFilters({});
    setSearchTerm('');
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    setPage(page);
  };

  return {
    // Data
    expenses,
    loading,
    error,
    pagination,
    
    // Filters
    filters,
    searchTerm,
    setSearchTerm,
    setFilters: handleFiltersChange,
    clearFilters: handleClearFilters,
    
    // Pagination
    currentPage,
    setCurrentPage: handlePageChange,
    
    // Actions
    handleCreateExpense,
    handleEditExpense,
    handleDeleteExpense,
    
    // Modals
    showCreateModal,
    setShowCreateModal,
    showEditModal,
    setShowEditModal,
    selectedExpense,
    setSelectedExpense,
    
    // Stats
    stats
  };
}; 