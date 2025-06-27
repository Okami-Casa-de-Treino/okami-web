import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { Checkin, PaginatedResponse, FilterParams } from '../types';
import { checkinService } from '../services/checkinService';

// ============================================================================
// TYPES AND INTERFACES
// ============================================================================

interface CheckinState {
  // Data
  checkins: Checkin[];
  todayCheckins: Checkin[];
  studentCheckins: Checkin[];
  classCheckins: Checkin[];
  selectedCheckin: Checkin | null;
  
  // Pagination
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
  
  // Loading states
  isLoading: boolean;
  isCreating: boolean;
  isDeleting: boolean;
  isLoadingToday: boolean;
  isLoadingStudent: boolean;
  isLoadingClass: boolean;
  
  // Error handling
  error: string | null;
  
  // Filters
  filters: FilterParams;
}

interface CheckinActions {
  // CRUD operations
  fetchCheckins: (params?: FilterParams) => Promise<void>;
  createCheckin: (data: Omit<Checkin, 'id' | 'created_at'>) => Promise<void>;
  deleteCheckin: (id: string) => Promise<void>;
  
  // Specific fetches
  fetchTodayCheckins: () => Promise<void>;
  fetchStudentCheckins: (studentId: string) => Promise<void>;
  fetchClassCheckins: (classId: string) => Promise<void>;
  
  // State management
  setSelectedCheckin: (checkin: Checkin | null) => void;
  setFilters: (filters: Partial<FilterParams>) => void;
  clearFilters: () => void;
  clearError: () => void;
  
  // Pagination
  setPage: (page: number) => void;
  setLimit: (limit: number) => void;
}

type CheckinStore = CheckinState & CheckinActions;

// ============================================================================
// INITIAL STATE
// ============================================================================

const initialState: CheckinState = {
  checkins: [],
  todayCheckins: [],
  studentCheckins: [],
  classCheckins: [],
  selectedCheckin: null,
  pagination: {
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 1,
  },
  isLoading: false,
  isCreating: false,
  isDeleting: false,
  isLoadingToday: false,
  isLoadingStudent: false,
  isLoadingClass: false,
  error: null,
  filters: {
    page: 1,
    limit: 10,
  },
};

// ============================================================================
// STORE IMPLEMENTATION
// ============================================================================

export const useCheckinStore = create<CheckinStore>()(
  devtools(
    (set, get) => ({
      ...initialState,

      // ========================================================================
      // CRUD OPERATIONS
      // ========================================================================

      fetchCheckins: async (params?: FilterParams) => {
        set({ isLoading: true, error: null });
        
        try {
          const filters = { ...get().filters, ...params };
          const response: PaginatedResponse<Checkin> = await checkinService.getAll(filters);
          
          set({
            checkins: response.data,
            pagination: {
              total: response.total,
              page: response.page,
              limit: response.limit,
              totalPages: response.totalPages,
            },
            filters,
            isLoading: false,
          });
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : 'Failed to fetch checkins',
            isLoading: false,
          });
        }
      },

      createCheckin: async (data: Omit<Checkin, 'id' | 'created_at'>) => {
        set({ isCreating: true, error: null });
        
        try {
          const newCheckin = await checkinService.create(data);
          
          set((state) => ({
            checkins: [newCheckin, ...state.checkins],
            todayCheckins: [newCheckin, ...state.todayCheckins],
            pagination: {
              ...state.pagination,
              total: state.pagination.total + 1,
            },
            isCreating: false,
          }));
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : 'Failed to create checkin',
            isCreating: false,
          });
        }
      },

      deleteCheckin: async (id: string) => {
        set({ isDeleting: true, error: null });
        
        try {
          await checkinService.delete(id);
          
          set((state) => ({
            checkins: state.checkins.filter((checkin) => checkin.id !== id),
            todayCheckins: state.todayCheckins.filter((checkin) => checkin.id !== id),
            studentCheckins: state.studentCheckins.filter((checkin) => checkin.id !== id),
            classCheckins: state.classCheckins.filter((checkin) => checkin.id !== id),
            selectedCheckin: state.selectedCheckin?.id === id ? null : state.selectedCheckin,
            pagination: {
              ...state.pagination,
              total: state.pagination.total - 1,
            },
            isDeleting: false,
          }));
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : 'Failed to delete checkin',
            isDeleting: false,
          });
        }
      },

      // ========================================================================
      // SPECIFIC FETCHES
      // ========================================================================

      fetchTodayCheckins: async () => {
        set({ isLoadingToday: true, error: null });
        
        try {
          const checkins = await checkinService.getTodayCheckins();
          set({
            todayCheckins: checkins,
            isLoadingToday: false,
          });
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : 'Failed to fetch today checkins',
            isLoadingToday: false,
          });
        }
      },

      fetchStudentCheckins: async (studentId: string) => {
        set({ isLoadingStudent: true, error: null });
        
        try {
          const checkins = await checkinService.getByStudent(studentId);
          set({
            studentCheckins: checkins,
            isLoadingStudent: false,
          });
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : 'Failed to fetch student checkins',
            isLoadingStudent: false,
          });
        }
      },

      fetchClassCheckins: async (classId: string) => {
        set({ isLoadingClass: true, error: null });
        
        try {
          const checkins = await checkinService.getByClass(classId);
          set({
            classCheckins: checkins,
            isLoadingClass: false,
          });
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : 'Failed to fetch class checkins',
            isLoadingClass: false,
          });
        }
      },

      // ========================================================================
      // STATE MANAGEMENT
      // ========================================================================

      setSelectedCheckin: (checkin: Checkin | null) => {
        set({ selectedCheckin: checkin });
      },

      setFilters: (newFilters: Partial<FilterParams>) => {
        set((state) => ({
          filters: { ...state.filters, ...newFilters },
        }));
      },

      clearFilters: () => {
        set({
          filters: {
            page: 1,
            limit: 10,
          },
        });
      },

      clearError: () => {
        set({ error: null });
      },

      // ========================================================================
      // PAGINATION
      // ========================================================================

      setPage: (page: number) => {
        set((state) => ({
          filters: { ...state.filters, page },
        }));
      },

      setLimit: (limit: number) => {
        set((state) => ({
          filters: { ...state.filters, limit, page: 1 },
        }));
      },
    }),
    { name: 'checkin-store' }
  )
);

// ============================================================================
// SELECTORS
// ============================================================================

export const useCheckinSelectors = () => {
  const store = useCheckinStore();
  
  return {
    // Data selectors
    checkins: store.checkins,
    todayCheckins: store.todayCheckins,
    studentCheckins: store.studentCheckins,
    classCheckins: store.classCheckins,
    selectedCheckin: store.selectedCheckin,
    
    // Pagination selectors
    pagination: store.pagination,
    currentPage: store.pagination.page,
    totalPages: store.pagination.totalPages,
    totalCheckins: store.pagination.total,
    
    // Loading selectors
    isLoading: store.isLoading,
    isCreating: store.isCreating,
    isDeleting: store.isDeleting,
    isLoadingToday: store.isLoadingToday,
    isLoadingStudent: store.isLoadingStudent,
    isLoadingClass: store.isLoadingClass,
    
    // State selectors
    error: store.error,
    filters: store.filters,
    hasError: !!store.error,
    isEmpty: store.checkins.length === 0 && !store.isLoading,
    
    // Computed selectors
    todayCheckinsCount: store.todayCheckins.length,
    recentCheckins: store.todayCheckins.slice(0, 10),
    checkinsByMethod: store.todayCheckins.reduce((acc, checkin) => {
      acc[checkin.method] = (acc[checkin.method] || 0) + 1;
      return acc;
    }, {} as Record<string, number>),
  };
}; 