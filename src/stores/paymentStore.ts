import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { paymentService } from '../services/paymentService';
import { Payment } from '../types';

interface PaymentFilters {
  studentId?: string;
  status?: 'pending' | 'paid' | 'overdue' | 'cancelled';
  startDate?: string;
  endDate?: string;
  referenceMonth?: string;
}

interface PaymentState {
  // State
  payments: Payment[];
  currentPayment: Payment | null;
  overduePayments: Payment[];
  studentPayments: Payment[];
  filters: PaymentFilters;
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  
  // Loading states
  loading: {
    list: boolean;
    create: boolean;
    update: boolean;
    delete: boolean;
    getById: boolean;
    markPaid: boolean;
    overdue: boolean;
    student: boolean;
    generateMonthly: boolean;
  };
  
  // Error state
  error: string | null;
  
  // Actions
  setFilters: (filters: Partial<PaymentFilters>) => void;
  clearFilters: () => void;
  setPage: (page: number) => void;
  setLimit: (limit: number) => void;
  
  // CRUD operations
  fetchPayments: () => Promise<void>;
  fetchPaymentById: (id: string) => Promise<void>;
  createPayment: (data: {
    studentId: string;
    amount: number;
    dueDate: string;
    referenceMonth: string;
    discount?: number;
    notes?: string;
  }) => Promise<Payment | null>;
  updatePayment: (id: string, data: Partial<Payment>) => Promise<Payment | null>;
  deletePayment: (id: string) => Promise<boolean>;
  
  // Payment operations
  markAsPaid: (id: string, paymentMethod: string, paymentDate?: string) => Promise<Payment | null>;
  fetchOverduePayments: () => Promise<void>;
  fetchStudentPayments: (studentId: string) => Promise<void>;
  generateMonthlyPayments: (month: number, year: number) => Promise<Payment[]>;
  
  // Utility actions
  clearError: () => void;
  clearCurrentPayment: () => void;
  reset: () => void;
}

const initialState = {
  payments: [],
  currentPayment: null,
  overduePayments: [],
  studentPayments: [],
  filters: {},
  pagination: {
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  },
  loading: {
    list: false,
    create: false,
    update: false,
    delete: false,
    getById: false,
    markPaid: false,
    overdue: false,
    student: false,
    generateMonthly: false,
  },
  error: null,
};

export const usePaymentStore = create<PaymentState>()(
  devtools(
    (set, get) => ({
      ...initialState,

      // Filter and pagination actions
      setFilters: (filters) => {
        set((state) => ({
          filters: { ...state.filters, ...filters },
          pagination: { ...state.pagination, page: 1 }, // Reset to first page
        }));
        get().fetchPayments();
      },

      clearFilters: () => {
        set((state) => ({
          filters: {},
          pagination: { ...state.pagination, page: 1 },
        }));
        get().fetchPayments();
      },

      setPage: (page) => {
        set((state) => ({
          pagination: { ...state.pagination, page },
        }));
        get().fetchPayments();
      },

      setLimit: (limit) => {
        set((state) => ({
          pagination: { ...state.pagination, limit, page: 1 },
        }));
        get().fetchPayments();
      },

      // CRUD operations
      fetchPayments: async () => {
        const { filters, pagination } = get();
        
        set((state) => ({
          loading: { ...state.loading, list: true },
          error: null,
        }));

        try {
          const response = await paymentService.getAll({
            page: pagination.page,
            limit: pagination.limit,
            ...filters,
          });

          set((state) => ({
            payments: response.data,
            pagination: {
              ...state.pagination,
              total: response.total,
              totalPages: response.totalPages,
            },
            loading: { ...state.loading, list: false },
          }));
        } catch (error) {
          set((state) => ({
            error: error instanceof Error ? error.message : 'Erro ao carregar pagamentos',
            loading: { ...state.loading, list: false },
          }));
        }
      },

      fetchPaymentById: async (id) => {
        set((state) => ({
          loading: { ...state.loading, getById: true },
          error: null,
        }));

        try {
          const payment = await paymentService.getById(id);
          set((state) => ({
            currentPayment: payment,
            loading: { ...state.loading, getById: false },
          }));
        } catch (error) {
          set((state) => ({
            error: error instanceof Error ? error.message : 'Erro ao carregar pagamento',
            loading: { ...state.loading, getById: false },
          }));
        }
      },

      createPayment: async (data) => {
        set((state) => ({
          loading: { ...state.loading, create: true },
          error: null,
        }));

        try {
          const newPayment = await paymentService.create({
            ...data,
            status: 'pending',
            discount: data.discount || 0,
            lateFee: 0,
          });
          
          set((state) => ({
            payments: [newPayment, ...state.payments],
            loading: { ...state.loading, create: false },
          }));

          // Refresh the list to get updated pagination
          get().fetchPayments();
          
          return newPayment;
        } catch (error) {
          set((state) => ({
            error: error instanceof Error ? error.message : 'Erro ao criar pagamento',
            loading: { ...state.loading, create: false },
          }));
          return null;
        }
      },

      updatePayment: async (id, data) => {
        set((state) => ({
          loading: { ...state.loading, update: true },
          error: null,
        }));

        try {
          const updatedPayment = await paymentService.update(id, data);
          
          set((state) => ({
            payments: state.payments.map((payment) =>
              payment.id === id ? updatedPayment : payment
            ),
            currentPayment: state.currentPayment?.id === id ? updatedPayment : state.currentPayment,
            loading: { ...state.loading, update: false },
          }));

          return updatedPayment;
        } catch (error) {
          set((state) => ({
            error: error instanceof Error ? error.message : 'Erro ao atualizar pagamento',
            loading: { ...state.loading, update: false },
          }));
          return null;
        }
      },

      deletePayment: async (id) => {
        set((state) => ({
          loading: { ...state.loading, delete: true },
          error: null,
        }));

        try {
          await paymentService.delete(id);
          
          set((state) => ({
            payments: state.payments.filter((payment) => payment.id !== id),
            currentPayment: state.currentPayment?.id === id ? null : state.currentPayment,
            loading: { ...state.loading, delete: false },
          }));

          // Refresh the list to get updated pagination
          get().fetchPayments();
          
          return true;
        } catch (error) {
          set((state) => ({
            error: error instanceof Error ? error.message : 'Erro ao excluir pagamento',
            loading: { ...state.loading, delete: false },
          }));
          return false;
        }
      },

      // Payment operations
      markAsPaid: async (id, paymentMethod, paymentDate) => {
        set((state) => ({
          loading: { ...state.loading, markPaid: true },
          error: null,
        }));

        try {
          const updatedPayment = await paymentService.markAsPaid(id, paymentMethod, paymentDate);
          
          set((state) => ({
            payments: state.payments.map((payment) =>
              payment.id === id ? updatedPayment : payment
            ),
            currentPayment: state.currentPayment?.id === id ? updatedPayment : state.currentPayment,
            overduePayments: state.overduePayments.filter((payment) => payment.id !== id),
            loading: { ...state.loading, markPaid: false },
          }));

          return updatedPayment;
        } catch (error) {
          set((state) => ({
            error: error instanceof Error ? error.message : 'Erro ao marcar pagamento como pago',
            loading: { ...state.loading, markPaid: false },
          }));
          return null;
        }
      },

      fetchOverduePayments: async () => {
        set((state) => ({
          loading: { ...state.loading, overdue: true },
          error: null,
        }));

        try {
          const payments = await paymentService.getOverdue();
          set((state) => ({
            overduePayments: payments,
            loading: { ...state.loading, overdue: false },
          }));
        } catch (error) {
          set((state) => ({
            error: error instanceof Error ? error.message : 'Erro ao carregar pagamentos em atraso',
            loading: { ...state.loading, overdue: false },
          }));
        }
      },

      fetchStudentPayments: async (studentId) => {
        set((state) => ({
          loading: { ...state.loading, student: true },
          error: null,
        }));

        try {
          const payments = await paymentService.getByStudent(studentId);
          set((state) => ({
            studentPayments: payments,
            loading: { ...state.loading, student: false },
          }));
        } catch (error) {
          set((state) => ({
            error: error instanceof Error ? error.message : 'Erro ao carregar pagamentos do aluno',
            loading: { ...state.loading, student: false },
          }));
        }
      },

      generateMonthlyPayments: async (month, year) => {
        set((state) => ({
          loading: { ...state.loading, generateMonthly: true },
          error: null,
        }));

        try {
          const payments = await paymentService.generateMonthlyPayments(`${year}-${month.toString().padStart(2, '0')}`);
          
          // Add generated payments to the list
          set((state) => ({
            payments: [...payments, ...state.payments],
            loading: { ...state.loading, generateMonthly: false },
          }));

          // Refresh the list
          get().fetchPayments();
          
          return payments;
        } catch (error) {
          set((state) => ({
            error: error instanceof Error ? error.message : 'Erro ao gerar pagamentos mensais',
            loading: { ...state.loading, generateMonthly: false },
          }));
          return [];
        }
      },

      // Utility actions
      clearError: () => {
        set({ error: null });
      },

      clearCurrentPayment: () => {
        set({ currentPayment: null });
      },

      reset: () => {
        set(initialState);
      },
    }),
    {
      name: 'payment-store',
    }
  )
); 