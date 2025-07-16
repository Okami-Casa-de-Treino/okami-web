import { create } from 'zustand';
import { Expense, PaginatedResponse, FilterParams } from '../types';
import { expenseService } from '../services/expenseService';

interface ExpenseState {
  // Data
  expenses: Expense[];
  loading: {
    list: boolean;
    create: boolean;
    update: boolean;
    delete: boolean;
  };
  error: string | null;
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };

  // Actions
  fetchExpenses: (params?: FilterParams) => Promise<void>;
  createExpense: (expenseData: Omit<Expense, 'id' | 'created_at' | 'updated_at'>) => Promise<boolean>;
  updateExpense: (id: string, expenseData: Partial<Expense>) => Promise<boolean>;
  deleteExpense: (id: string) => Promise<boolean>;
  setFilters: (filters: FilterParams) => void;
  clearFilters: () => void;
  setPage: (page: number) => void;
  clearError: () => void;
}

export const useExpenseStore = create<ExpenseState>((set, get) => ({
  // Initial state
  expenses: [],
  loading: {
    list: false,
    create: false,
    update: false,
    delete: false,
  },
  error: null,
  pagination: {
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 0,
  },

  // Actions
  fetchExpenses: async (params?: FilterParams) => {
    set({ loading: { ...get().loading, list: true }, error: null });
    
    try {
      const response: PaginatedResponse<Expense> = await expenseService.getAll(params);
      set({
        expenses: response.data,
        pagination: {
          total: response.total,
          page: response.page,
          limit: response.limit,
          totalPages: response.totalPages,
        },
        loading: { ...get().loading, list: false },
      });
    } catch (error) {
      console.error('Error fetching expenses:', error);
      set({
        error: error instanceof Error ? error.message : 'Erro ao carregar despesas',
        loading: { ...get().loading, list: false },
      });
    }
  },

  createExpense: async (expenseData) => {
    set({ loading: { ...get().loading, create: true }, error: null });
    
    try {
      await expenseService.create(expenseData);
      await get().fetchExpenses(); // Refresh the list
      set({ loading: { ...get().loading, create: false } });
      return true;
    } catch (error) {
      console.error('Error creating expense:', error);
      set({
        error: error instanceof Error ? error.message : 'Erro ao criar despesa',
        loading: { ...get().loading, create: false },
      });
      return false;
    }
  },

  updateExpense: async (id, expenseData) => {
    set({ loading: { ...get().loading, update: true }, error: null });
    
    try {
      await expenseService.update(id, expenseData);
      await get().fetchExpenses(); // Refresh the list
      set({ loading: { ...get().loading, update: false } });
      return true;
    } catch (error) {
      console.error('Error updating expense:', error);
      set({
        error: error instanceof Error ? error.message : 'Erro ao atualizar despesa',
        loading: { ...get().loading, update: false },
      });
      return false;
    }
  },

  deleteExpense: async (id) => {
    set({ loading: { ...get().loading, delete: true }, error: null });
    
    try {
      await expenseService.delete(id);
      await get().fetchExpenses(); // Refresh the list
      set({ loading: { ...get().loading, delete: false } });
      return true;
    } catch (error) {
      console.error('Error deleting expense:', error);
      set({
        error: error instanceof Error ? error.message : 'Erro ao excluir despesa',
        loading: { ...get().loading, delete: false },
      });
      return false;
    }
  },

  setFilters: () => {
    // This will be handled by the hook that calls fetchExpenses with filters
  },

  clearFilters: () => {
    // This will be handled by the hook that calls fetchExpenses without filters
  },

  setPage: (page) => {
    set({ pagination: { ...get().pagination, page } });
  },

  clearError: () => {
    set({ error: null });
  },
})); 