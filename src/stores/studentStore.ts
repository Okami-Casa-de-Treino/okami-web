import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { Student, PaginatedResponse, FilterParams } from '../types';
import { studentService } from '../services/studentService';

// ============================================================================
// TYPES AND INTERFACES
// ============================================================================

interface StudentState {
  // Data
  students: Student[];
  selectedStudent: Student | null;
  
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
  
  // Error handling
  error: string | null;
  
  // Filters
  filters: FilterParams;
}

interface StudentActions {
  // CRUD operations
  fetchStudents: (params?: FilterParams) => Promise<void>;
  fetchStudentById: (id: string) => Promise<void>;
  createStudent: (data: Omit<Student, 'id' | 'created_at' | 'updated_at'>) => Promise<void>;
  updateStudent: (id: string, data: Partial<Student>) => Promise<void>;
  deleteStudent: (id: string) => Promise<void>;
  
  // Class enrollment
  enrollInClass: (studentId: string, classId: string) => Promise<void>;
  unenrollFromClass: (studentId: string, classId: string) => Promise<void>;
  
  // State management
  setSelectedStudent: (student: Student | null) => void;
  setFilters: (filters: Partial<FilterParams>) => void;
  clearFilters: () => void;
  clearError: () => void;
  
  // Pagination
  setPage: (page: number) => void;
  setLimit: (limit: number) => void;
}

type StudentStore = StudentState & StudentActions;

// ============================================================================
// INITIAL STATE
// ============================================================================

const initialState: StudentState = {
  students: [],
  selectedStudent: null,
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
  error: null,
  filters: {
    page: 1,
    limit: 10,
  },
};

// ============================================================================
// STORE IMPLEMENTATION
// ============================================================================

export const useStudentStore = create<StudentStore>()(
  devtools(
    (set, get) => ({
      ...initialState,

      // ========================================================================
      // CRUD OPERATIONS
      // ========================================================================

      fetchStudents: async (params?: FilterParams) => {
        set({ isLoading: true, error: null });
        
        try {
          const filters = { ...get().filters, ...params };
          const response: PaginatedResponse<Student> = await studentService.getStudents(filters);
          
          set({
            students: response.data,
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
            error: error instanceof Error ? error.message : 'Failed to fetch students',
            isLoading: false,
          });
        }
      },

      fetchStudentById: async (id: string) => {
        set({ isLoading: true, error: null });
        
        try {
          const student = await studentService.getStudentById(id);
          set({
            selectedStudent: student,
            isLoading: false,
          });
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : 'Failed to fetch student',
            isLoading: false,
          });
        }
      },

      createStudent: async (data: Omit<Student, 'id' | 'created_at' | 'updated_at'>) => {
        set({ isCreating: true, error: null });
        
        try {
          const newStudent = await studentService.createStudent(data);
          
          set((state) => ({
            students: [newStudent, ...state.students],
            pagination: {
              ...state.pagination,
              total: state.pagination.total + 1,
            },
            isCreating: false,
          }));
          
          // Refresh the list to ensure consistency
          get().fetchStudents();
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : 'Failed to create student',
            isCreating: false,
          });
        }
      },

      updateStudent: async (id: string, data: Partial<Student>) => {
        set({ isUpdating: true, error: null });
        
        try {
          const updatedStudent = await studentService.updateStudent(id, data);
          
          set((state) => ({
            students: state.students.map((student) =>
              student.id === id ? updatedStudent : student
            ),
            selectedStudent: state.selectedStudent?.id === id ? updatedStudent : state.selectedStudent,
            isUpdating: false,
          }));
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : 'Failed to update student',
            isUpdating: false,
          });
        }
      },

      deleteStudent: async (id: string) => {
        set({ isDeleting: true, error: null });
        
        try {
          await studentService.deleteStudent(id);
          
          set((state) => ({
            students: state.students.filter((student) => student.id !== id),
            selectedStudent: state.selectedStudent?.id === id ? null : state.selectedStudent,
            pagination: {
              ...state.pagination,
              total: Math.max(0, state.pagination.total - 1),
            },
            isDeleting: false,
          }));
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : 'Failed to delete student',
            isDeleting: false,
          });
        }
      },

      // ========================================================================
      // CLASS ENROLLMENT
      // ========================================================================

      enrollInClass: async (studentId: string, classId: string) => {
        set({ error: null });
        
        try {
          await studentService.enrollInClass(studentId, classId);
          // Optionally refresh student data or update local state
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : 'Failed to enroll student in class',
          });
        }
      },

      unenrollFromClass: async (studentId: string, classId: string) => {
        set({ error: null });
        
        try {
          await studentService.unenrollFromClass(studentId, classId);
          // Optionally refresh student data or update local state
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : 'Failed to unenroll student from class',
          });
        }
      },

      // ========================================================================
      // STATE MANAGEMENT
      // ========================================================================

      setSelectedStudent: (student: Student | null) => {
        set({ selectedStudent: student });
      },

      setFilters: (newFilters: Partial<FilterParams>) => {
        const filters = { ...get().filters, ...newFilters };
        set({ filters });
        get().fetchStudents(filters);
      },

      clearFilters: () => {
        const defaultFilters: FilterParams = { page: 1, limit: 10 };
        set({ filters: defaultFilters });
        get().fetchStudents(defaultFilters);
      },

      clearError: () => {
        set({ error: null });
      },

      // ========================================================================
      // PAGINATION
      // ========================================================================

      setPage: (page: number) => {
        get().setFilters({ page });
      },

      setLimit: (limit: number) => {
        get().setFilters({ limit, page: 1 });
      },
    }),
    {
      name: 'student-store',
      partialize: (state: StudentState) => ({
        filters: state.filters,
        pagination: state.pagination,
      }),
    }
  )
);

// ============================================================================
// SELECTORS (Optional - for better performance)
// ============================================================================

export const useStudentSelectors = () => {
  const store = useStudentStore();
  
  return {
    // Derived state
    hasStudents: store.students.length > 0,
    activeStudents: store.students.filter(s => s.status === 'active'),
    inactiveStudents: store.students.filter(s => s.status === 'inactive'),
    suspendedStudents: store.students.filter(s => s.status === 'suspended'),
    
    // Loading states
    isAnyLoading: store.isLoading || store.isCreating || store.isUpdating || store.isDeleting,
    
    // Pagination helpers
    hasNextPage: store.pagination.page < store.pagination.totalPages,
    hasPrevPage: store.pagination.page > 1,
    
    // Error state
    hasError: !!store.error,
  };
}; 