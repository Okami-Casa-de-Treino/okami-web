import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { 
  BeltPromotion, 
  BeltProgress, 
  BeltOverview, 
  PromoteStudentData, 
  UpdatePromotionData,
  PromotionResponse,
  PaginatedResponse,
  FilterParams 
} from '../types';
import { beltProgressionService } from '../services/beltProgressionService';

// ============================================================================
// TYPES AND INTERFACES
// ============================================================================

interface BeltProgressionState {
  // Data
  promotions: BeltPromotion[];
  selectedPromotion: BeltPromotion | null;
  studentProgress: BeltProgress | null;
  beltOverview: BeltOverview | null;
  
  // Pagination
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
  
  // Loading states
  isLoading: boolean;
  isPromoting: boolean;
  isLoadingProgress: boolean;
  isLoadingOverview: boolean;
  
  // Error handling
  error: string | null;
  
  // Filters
  filters: FilterParams;
}

interface BeltProgressionActions {
  // Promotions
  fetchPromotions: (params?: FilterParams) => Promise<void>;
  fetchPromotionById: (id: string) => Promise<void>;
  promoteStudent: (data: PromoteStudentData) => Promise<PromotionResponse>;
  updatePromotion: (id: string, data: UpdatePromotionData) => Promise<BeltPromotion>;
  deletePromotion: (id: string) => Promise<void>;
  
  // Student progress
  fetchStudentProgress: (studentId: string) => Promise<void>;
  
  // Overview
  fetchBeltOverview: () => Promise<void>;
  
  // State management
  setSelectedPromotion: (promotion: BeltPromotion | null) => void;
  setFilters: (filters: Partial<FilterParams>) => void;
  clearFilters: () => void;
  clearError: () => void;
  clearStudentProgress: () => void;
  
  // Pagination
  setPage: (page: number) => void;
  setLimit: (limit: number) => void;
}

type BeltProgressionStore = BeltProgressionState & BeltProgressionActions;

// ============================================================================
// INITIAL STATE
// ============================================================================

const initialState: BeltProgressionState = {
  promotions: [],
  selectedPromotion: null,
  studentProgress: null,
  beltOverview: null,
  pagination: {
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 1,
  },
  isLoading: false,
  isPromoting: false,
  isLoadingProgress: false,
  isLoadingOverview: false,
  error: null,
  filters: {
    page: 1,
    limit: 10,
  },
};

// ============================================================================
// STORE IMPLEMENTATION
// ============================================================================

export const useBeltProgressionStore = create<BeltProgressionStore>()(
  devtools(
    (set, get) => ({
      ...initialState,

      // ========================================================================
      // PROMOTIONS
      // ========================================================================

      fetchPromotions: async (params?: FilterParams) => {
        set({ isLoading: true, error: null });
        
        try {
          const filters = { ...get().filters, ...params };
          const response: PaginatedResponse<BeltPromotion> = await beltProgressionService.getAllPromotions(filters);
          
          set({
            promotions: response.data,
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
            error: error instanceof Error ? error.message : 'Failed to fetch promotions',
            isLoading: false,
          });
        }
      },

      fetchPromotionById: async (id: string) => {
        set({ isLoading: true, error: null });
        
        try {
          const promotion = await beltProgressionService.getPromotionById(id);
          set({
            selectedPromotion: promotion,
            isLoading: false,
          });
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : 'Failed to fetch promotion',
            isLoading: false,
          });
        }
      },

      promoteStudent: async (data: PromoteStudentData) => {
        set({ isPromoting: true, error: null });
        
        try {
          const result = await beltProgressionService.promoteStudent(data);
          
          // Refresh promotions list
          await get().fetchPromotions();
          
          set({ isPromoting: false });
          return result;
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : 'Failed to promote student',
            isPromoting: false,
          });
          throw error;
        }
      },

      updatePromotion: async (id: string, data: UpdatePromotionData) => {
        set({ isPromoting: true, error: null });
        
        try {
          const result = await beltProgressionService.updatePromotion(id, data);
          
          // Refresh promotions list
          await get().fetchPromotions();
          
          set({ isPromoting: false });
          return result;
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : 'Failed to update promotion',
            isPromoting: false,
          });
          throw error;
        }
      },

      deletePromotion: async (id: string) => {
        set({ isPromoting: true, error: null });
        
        try {
          await beltProgressionService.deletePromotion(id);
          
          // Refresh promotions list
          await get().fetchPromotions();
          
          set({ isPromoting: false });
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : 'Failed to delete promotion',
            isPromoting: false,
          });
          throw error;
        }
      },

      // ========================================================================
      // STUDENT PROGRESS
      // ========================================================================

      fetchStudentProgress: async (studentId: string) => {
        set({ isLoadingProgress: true, error: null });
        
        try {
          const progress = await beltProgressionService.getStudentProgress(studentId);
          set({
            studentProgress: progress,
            isLoadingProgress: false,
          });
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : 'Failed to fetch student progress',
            isLoadingProgress: false,
          });
        }
      },

      // ========================================================================
      // OVERVIEW
      // ========================================================================

      fetchBeltOverview: async () => {
        set({ isLoadingOverview: true, error: null });
        
        try {
          const overview = await beltProgressionService.getBeltOverview();
          set({
            beltOverview: overview.data,
            isLoadingOverview: false,
          });
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : 'Failed to fetch belt overview',
            isLoadingOverview: false,
          });
        }
      },

      // ========================================================================
      // STATE MANAGEMENT
      // ========================================================================

      setSelectedPromotion: (promotion: BeltPromotion | null) => {
        set({ selectedPromotion: promotion });
      },

      setFilters: (filters: Partial<FilterParams>) => {
        set((state) => ({
          filters: { ...state.filters, ...filters },
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

      clearStudentProgress: () => {
        set({ studentProgress: null });
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
    {
      name: 'belt-progression-store',
    }
  )
);

// ============================================================================
// SELECTORS
// ============================================================================

export const useBeltProgressionSelectors = () => {
  const store = useBeltProgressionStore();
  
  return {
    // Data selectors
    promotions: store.promotions,
    selectedPromotion: store.selectedPromotion,
    studentProgress: store.studentProgress,
    beltOverview: store.beltOverview,
    
    // State selectors
    isLoading: store.isLoading,
    isPromoting: store.isPromoting,
    isLoadingProgress: store.isLoadingProgress,
    isLoadingOverview: store.isLoadingOverview,
    error: store.error,
    
    // Pagination selectors
    pagination: store.pagination,
    filters: store.filters,
    
    // Computed selectors
    hasPromotions: store.promotions.length > 0,
    hasError: !!store.error,
    totalPromotions: store.pagination.total,
    
    // Belt distribution helpers
    getBeltDistribution: () => store.beltOverview?.belt_distribution || [],
    getRecentPromotions: () => store.beltOverview?.recent_promotions || [],
    getSummaryStats: () => store.beltOverview?.summary || null,
  };
}; 