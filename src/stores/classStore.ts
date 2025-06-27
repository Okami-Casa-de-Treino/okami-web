import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { Class, PaginatedResponse, FilterParams, Student, Checkin } from '../types';
import { classService } from '../services/classService';

// ============================================================================
// TYPES AND INTERFACES
// ============================================================================

interface ClassState {
  // Data
  classes: Class[];
  selectedClass: Class | null;
  classStudents: Student[];
  classCheckins: Checkin[];
  schedule: Record<string, Class[]>;
  
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
  isUpdating: boolean;
  isDeleting: boolean;
  isLoadingStudents: boolean;
  isLoadingCheckins: boolean;
  isLoadingSchedule: boolean;
  
  // Error handling
  error: string | null;
  
  // Filters
  filters: FilterParams;
}

interface ClassActions {
  // CRUD operations
  fetchClasses: (params?: FilterParams) => Promise<void>;
  fetchClassById: (id: string) => Promise<void>;
  createClass: (data: Omit<Class, 'id' | 'created_at' | 'updated_at'>) => Promise<void>;
  updateClass: (id: string, data: Partial<Class>) => Promise<void>;
  deleteClass: (id: string) => Promise<void>;
  
  // Class related data
  fetchClassStudents: (classId: string) => Promise<void>;
  fetchClassCheckins: (classId: string) => Promise<void>;
  fetchSchedule: () => Promise<void>;
  
  // State management
  setSelectedClass: (classItem: Class | null) => void;
  setFilters: (filters: Partial<FilterParams>) => void;
  clearFilters: () => void;
  clearError: () => void;
  
  // Pagination
  setPage: (page: number) => void;
  setLimit: (limit: number) => void;
}

type ClassStore = ClassState & ClassActions;

// ============================================================================
// INITIAL STATE
// ============================================================================

const initialState: ClassState = {
  classes: [],
  selectedClass: null,
  classStudents: [],
  classCheckins: [],
  schedule: {},
  pagination: {
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 1,
  },
  isLoading: false,
  isCreating: false,
  isUpdating: false,
  isDeleting: false,
  isLoadingStudents: false,
  isLoadingCheckins: false,
  isLoadingSchedule: false,
  error: null,
  filters: {
    page: 1,
    limit: 10,
  },
};

// ============================================================================
// STORE IMPLEMENTATION
// ============================================================================

export const useClassStore = create<ClassStore>()(
  devtools(
    (set, get) => ({
      ...initialState,

      // ========================================================================
      // CRUD OPERATIONS
      // ========================================================================

      fetchClasses: async (params?: FilterParams) => {
        set({ isLoading: true, error: null });
        
        try {
          const filters = { ...get().filters, ...params };
          const response: PaginatedResponse<Class> = await classService.getAll(filters);
          
          set({
            classes: response.data,
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
            error: error instanceof Error ? error.message : 'Failed to fetch classes',
            isLoading: false,
          });
        }
      },

      fetchClassById: async (id: string) => {
        set({ isLoading: true, error: null });
        
        try {
          const classItem = await classService.getById(id);
          set({
            selectedClass: classItem,
            isLoading: false,
          });
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : 'Failed to fetch class',
            isLoading: false,
          });
        }
      },

      createClass: async (data: Omit<Class, 'id' | 'created_at' | 'updated_at'>) => {
        set({ isCreating: true, error: null });
        
        try {
          const newClass = await classService.create(data);
          
          set((state) => ({
            classes: [newClass, ...state.classes],
            pagination: {
              ...state.pagination,
              total: state.pagination.total + 1,
            },
            isCreating: false,
          }));
          
          // Refresh the list to ensure consistency
          get().fetchClasses();
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : 'Failed to create class',
            isCreating: false,
          });
        }
      },

      updateClass: async (id: string, data: Partial<Class>) => {
        set({ isUpdating: true, error: null });
        
        try {
          const updatedClass = await classService.update(id, data);
          
          set((state) => ({
            classes: state.classes.map((classItem) =>
              classItem.id === id ? updatedClass : classItem
            ),
            selectedClass: state.selectedClass?.id === id ? updatedClass : state.selectedClass,
            isUpdating: false,
          }));
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : 'Failed to update class',
            isUpdating: false,
          });
        }
      },

      deleteClass: async (id: string) => {
        set({ isDeleting: true, error: null });
        
        try {
          await classService.delete(id);
          
          set((state) => ({
            classes: state.classes.filter((classItem) => classItem.id !== id),
            selectedClass: state.selectedClass?.id === id ? null : state.selectedClass,
            pagination: {
              ...state.pagination,
              total: state.pagination.total - 1,
            },
            isDeleting: false,
          }));
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : 'Failed to delete class',
            isDeleting: false,
          });
        }
      },

      // ========================================================================
      // CLASS RELATED DATA
      // ========================================================================

      fetchClassStudents: async (classId: string) => {
        set({ isLoadingStudents: true, error: null });
        
        try {
          const students = await classService.getStudents(classId);
          set({
            classStudents: students,
            isLoadingStudents: false,
          });
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : 'Failed to fetch class students',
            isLoadingStudents: false,
          });
        }
      },

      fetchClassCheckins: async (classId: string) => {
        set({ isLoadingCheckins: true, error: null });
        
        try {
          const checkins = await classService.getCheckins(classId);
          set({
            classCheckins: checkins,
            isLoadingCheckins: false,
          });
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : 'Failed to fetch class checkins',
            isLoadingCheckins: false,
          });
        }
      },

      fetchSchedule: async () => {
        set({ isLoadingSchedule: true, error: null });
        
        try {
          const schedule = await classService.getSchedule();
          set({
            schedule,
            isLoadingSchedule: false,
          });
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : 'Failed to fetch schedule',
            isLoadingSchedule: false,
          });
        }
      },

      // ========================================================================
      // STATE MANAGEMENT
      // ========================================================================

      setSelectedClass: (classItem: Class | null) => {
        set({ selectedClass: classItem });
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

      // ========================================================================
      // PAGINATION
      // ========================================================================

      setPage: (page: number) => {
        set((state) => ({
          filters: { ...state.filters, page },
        }));
        get().fetchClasses();
      },

      setLimit: (limit: number) => {
        set((state) => ({
          filters: { ...state.filters, limit, page: 1 },
        }));
        get().fetchClasses();
      },
    }),
    {
      name: 'class-store',
    }
  )
);

// ============================================================================
// SELECTORS
// ============================================================================

export const useClassSelectors = () => {
  const store = useClassStore();
  
  return {
    // Data selectors
    classes: store.classes,
    selectedClass: store.selectedClass,
    classStudents: store.classStudents,
    classCheckins: store.classCheckins,
    schedule: store.schedule,
    
    // Pagination selectors
    pagination: store.pagination,
    currentPage: store.pagination.page,
    totalPages: store.pagination.totalPages,
    totalClasses: store.pagination.total,
    
    // Loading selectors
    isLoading: store.isLoading,
    isCreating: store.isCreating,
    isUpdating: store.isUpdating,
    isDeleting: store.isDeleting,
    isLoadingStudents: store.isLoadingStudents,
    isLoadingCheckins: store.isLoadingCheckins,
    isLoadingSchedule: store.isLoadingSchedule,
    
    // State selectors
    error: store.error,
    filters: store.filters,
    hasError: !!store.error,
    isEmpty: store.classes.length === 0 && !store.isLoading,
    
    // Computed selectors
    activeClasses: store.classes.filter(c => c.status === 'active'),
    inactiveClasses: store.classes.filter(c => c.status === 'inactive'),
    classesWithStudentCount: store.classes.map(c => ({
      ...c,
      currentStudents: store.classStudents.filter(s => 
        store.classCheckins.some(ch => ch.classId === c.id && ch.studentId === s.id)
      ).length
    })),
  };
}; 