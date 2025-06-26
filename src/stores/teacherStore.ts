import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { Teacher, PaginatedResponse, FilterParams, Class } from '../types';
import { teacherService } from '../services/teacherService';

// ============================================================================
// TYPES AND INTERFACES
// ============================================================================

interface TeacherState {
  // Data
  teachers: Teacher[];
  selectedTeacher: Teacher | null;
  teacherClasses: Class[];
  
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
  isLoadingClasses: boolean;
  
  // Error handling
  error: string | null;
  
  // Filters
  filters: FilterParams;
}

interface TeacherActions {
  // CRUD operations
  fetchTeachers: (params?: FilterParams) => Promise<void>;
  fetchTeacherById: (id: string) => Promise<void>;
  createTeacher: (data: Omit<Teacher, 'id' | 'created_at' | 'updated_at'>) => Promise<void>;
  updateTeacher: (id: string, data: Partial<Teacher>) => Promise<void>;
  deleteTeacher: (id: string) => Promise<void>;
  
  // Teacher classes
  fetchTeacherClasses: (teacherId: string) => Promise<void>;
  
  // State management
  setSelectedTeacher: (teacher: Teacher | null) => void;
  setFilters: (filters: Partial<FilterParams>) => void;
  clearFilters: () => void;
  clearError: () => void;
  
  // Pagination
  setPage: (page: number) => void;
  setLimit: (limit: number) => void;
}

type TeacherStore = TeacherState & TeacherActions;

// ============================================================================
// INITIAL STATE
// ============================================================================

const initialState: TeacherState = {
  teachers: [],
  selectedTeacher: null,
  teacherClasses: [],
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
  isLoadingClasses: false,
  error: null,
  filters: {
    page: 1,
    limit: 10,
  },
};

// ============================================================================
// STORE IMPLEMENTATION
// ============================================================================

export const useTeacherStore = create<TeacherStore>()(
  devtools(
    (set, get) => ({
      ...initialState,

      // ========================================================================
      // CRUD OPERATIONS
      // ========================================================================

      fetchTeachers: async (params?: FilterParams) => {
        set({ isLoading: true, error: null });
        
        try {
          const filters = { ...get().filters, ...params };
          const response: PaginatedResponse<Teacher> = await teacherService.getTeachers(filters);
          
          set({
            teachers: response.data,
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
            error: error instanceof Error ? error.message : 'Failed to fetch teachers',
            isLoading: false,
          });
        }
      },

      fetchTeacherById: async (id: string) => {
        set({ isLoading: true, error: null });
        
        try {
          const teacher = await teacherService.getTeacherById(id);
          set({
            selectedTeacher: teacher.data,
            isLoading: false,
          });
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : 'Failed to fetch teacher',
            isLoading: false,
          });
        }
      },

      createTeacher: async (data: Omit<Teacher, 'id' | 'created_at' | 'updated_at'>) => {
        set({ isCreating: true, error: null });
        
        try {
          const newTeacher = await teacherService.createTeacher(data);
          
          set((state) => ({
            teachers: [newTeacher, ...state.teachers],
            pagination: {
              ...state.pagination,
              total: state.pagination.total + 1,
            },
            isCreating: false,
          }));
          
          // Refresh the list to ensure consistency
          get().fetchTeachers();
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : 'Failed to create teacher',
            isCreating: false,
          });
        }
      },

      updateTeacher: async (id: string, data: Partial<Teacher>) => {
        set({ isUpdating: true, error: null });
        
        try {
          const updatedTeacher = await teacherService.updateTeacher(id, data);
          
          set((state) => ({
            teachers: state.teachers.map((teacher) =>
              teacher.id === id ? updatedTeacher : teacher
            ),
            selectedTeacher: state.selectedTeacher?.id === id ? updatedTeacher : state.selectedTeacher,
            isUpdating: false,
          }));
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : 'Failed to update teacher',
            isUpdating: false,
          });
        }
      },

      deleteTeacher: async (id: string) => {
        set({ isDeleting: true, error: null });
        
        try {
          await teacherService.deleteTeacher(id);
          
          set((state) => ({
            teachers: state.teachers.filter((teacher) => teacher.id !== id),
            selectedTeacher: state.selectedTeacher?.id === id ? null : state.selectedTeacher,
            pagination: {
              ...state.pagination,
              total: Math.max(0, state.pagination.total - 1),
            },
            isDeleting: false,
          }));
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : 'Failed to delete teacher',
            isDeleting: false,
          });
        }
      },

      // ========================================================================
      // TEACHER CLASSES
      // ========================================================================

      fetchTeacherClasses: async (teacherId: string) => {
        set({ isLoadingClasses: true, error: null });
        
        try {
          const classes = await teacherService.getTeacherClasses(teacherId);
          set({
            teacherClasses: classes,
            isLoadingClasses: false,
          });
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : 'Failed to fetch teacher classes',
            isLoadingClasses: false,
          });
        }
      },

      // ========================================================================
      // STATE MANAGEMENT
      // ========================================================================

      setSelectedTeacher: (teacher: Teacher | null) => {
        set({ selectedTeacher: teacher });
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
        get().fetchTeachers();
      },

      setLimit: (limit: number) => {
        set((state) => ({
          filters: { ...state.filters, limit, page: 1 },
        }));
        get().fetchTeachers();
      },
    }),
    {
      name: 'teacher-store',
    }
  )
);

// ============================================================================
// SELECTORS
// ============================================================================

export const useTeacherSelectors = () => {
  const store = useTeacherStore();
  
  return {
    // Data selectors
    hasTeachers: store.teachers.length > 0,
    teacherCount: store.teachers.length,
    activeTeachers: store.teachers.filter(t => t.status === 'active'),
    
    // Loading state selectors
    isAnyLoading: store.isLoading || store.isCreating || store.isUpdating || store.isDeleting,
    
    // Error state
    hasError: !!store.error,
    
    // Pagination helpers
    hasNextPage: store.pagination.page < store.pagination.totalPages,
    hasPrevPage: store.pagination.page > 1,
    
    // Status helpers
    getStatusColor: (status: string) => {
      switch (status) {
        case 'active':
          return 'bg-green-100 text-green-800';
        case 'inactive':
          return 'bg-gray-100 text-gray-800';
        default:
          return 'bg-gray-100 text-gray-800';
      }
    },
  };
}; 