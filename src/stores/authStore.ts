import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { User, Student } from '../types';
import { httpClient } from '../services/httpClient';

// ============================================================================
// TYPES AND INTERFACES
// ============================================================================

interface AuthState {
  // User data
  user: User | null;
  isAuthenticated: boolean;
  
  // Loading states
  isLoading: boolean;
  isLoggingIn: boolean;
  isLoggingOut: boolean;
  
  // Error handling
  error: string | null;
}

interface AuthActions {
  // Authentication
  login: (credentials: { username: string; password: string }) => Promise<void>;
  logout: () => Promise<void>;
  refreshToken: () => Promise<void>;
  
  // User profile
  fetchProfile: () => Promise<void>;
  updateProfile: (data: Partial<User>) => Promise<void>;
  
  // State management
  clearError: () => void;
  setUser: (user: User | null) => void;
}

type AuthStore = AuthState & AuthActions;

// ============================================================================
// INITIAL STATE
// ============================================================================

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  isLoading: false,
  isLoggingIn: false,
  isLoggingOut: false,
  error: null,
};

// ============================================================================
// STORE IMPLEMENTATION
// ============================================================================

export const useAuthStore = create<AuthStore>()(
  devtools(
    persist(
      (set) => ({
        ...initialState,

        // ========================================================================
        // AUTHENTICATION
        // ========================================================================

        login: async (credentials: { username: string; password: string }) => {
          set({ isLoggingIn: true, error: null });
          
          try {
            const response = await httpClient.post('/auth/login', credentials);
            
            const responseData = response.data as { 
              data: { 
                user?: User; 
                student?: Student; 
                token: string 
              } 
            };
            
            const { token } = responseData.data;
            
            // Store the token
            httpClient.setToken(token);
            
            // Handle different response structures
            let user: User | null = null;
            
            if (responseData.data.student) {
              // Student login response
              const student = responseData.data.student;
              user = {
                id: student.id,
                username: student.email || student.full_name,
                name: student.full_name,
                email: student.email,
                role: 'student',
                studentId: student.id,
                student: student,
                status: student.status === 'suspended' ? 'inactive' : student.status,
                created_at: student.created_at,
                updated_at: student.updated_at,
              };
            } else if (responseData.data.user) {
              // Regular user login response
              user = responseData.data.user;
            }
            
            if (!user) {
              throw new Error('Invalid login response: no user data found');
            }
            
            set({
              user,
              isAuthenticated: true,
              isLoggingIn: false,
              error: null,
            });
          } catch (error) {
            set({
              error: error instanceof Error ? error.message : 'Login failed',
              isLoggingIn: false,
              isAuthenticated: false,
              user: null,
            });
            throw error;
          }
        },

        logout: async () => {
          set({ isLoggingOut: true, error: null });
          
          try {
            // Call logout endpoint if available
            try {
              await httpClient.post('/auth/logout');
            } catch {
              // Ignore logout endpoint errors
            }
            
            // Clear tokens and state
            httpClient.clearTokens();
            
            set({
              user: null,
              isAuthenticated: false,
              isLoggingOut: false,
              error: null,
            });
          } catch (error) {
            set({
              error: error instanceof Error ? error.message : 'Logout failed',
              isLoggingOut: false,
            });
          }
        },

        refreshToken: async () => {
          set({ isLoading: true, error: null });
          
          try {
            // Since the API doesn't seem to have separate refresh tokens,
            // we'll try to get a new token using the current token
            const response = await httpClient.post('/auth/refresh');
            const responseData = response.data as { data: { token: string } };
            const { token } = responseData.data;
            
            httpClient.setToken(token);
            
            set({ isLoading: false });
          } catch (error) {
            // If refresh fails, logout user
            httpClient.clearTokens();
            set({
              user: null,
              isAuthenticated: false,
              isLoading: false,
              error: 'Session expired. Please login again.',
            });
            throw error;
          }
        },

        // ========================================================================
        // USER PROFILE
        // ========================================================================

        fetchProfile: async () => {
          set({ isLoading: true, error: null });
          
          try {
            const response = await httpClient.get('/auth/profile');
            const responseData = response.data as { data: User };
            const user = responseData.data;
            
            set({
              user,
              isAuthenticated: true,
              isLoading: false,
            });
          } catch (error) {
            set({
              error: error instanceof Error ? error.message : 'Failed to fetch profile',
              isLoading: false,
            });
            throw error;
          }
        },

        updateProfile: async (data: Partial<User>) => {
          set({ isLoading: true, error: null });
          
          try {
            const response = await httpClient.put('/auth/profile', data);
            const responseData = response.data as { data: User };
            const updatedUser = responseData.data;
            
            set({
              user: updatedUser,
              isLoading: false,
            });
          } catch (error) {
            set({
              error: error instanceof Error ? error.message : 'Failed to update profile',
              isLoading: false,
            });
            throw error;
          }
        },

        // ========================================================================
        // STATE MANAGEMENT
        // ========================================================================

        clearError: () => {
          set({ error: null });
        },

        setUser: (user: User | null) => {
          set({ 
            user, 
            isAuthenticated: !!user 
          });
        },
      }),
      {
        name: 'auth-store',
        partialize: (state) => ({
          user: state.user,
          isAuthenticated: state.isAuthenticated,
        }),
      }
    ),
    {
      name: 'auth-store',
    }
  )
);

// ============================================================================
// SELECTORS
// ============================================================================

export const useAuthSelectors = () => {
  const store = useAuthStore();
  
  return {
    // User info
    isAdmin: store.user?.role === 'admin',
    isTeacher: store.user?.role === 'teacher',
    isReceptionist: store.user?.role === 'receptionist',
    isStudent: store.user?.role === 'student',
    
    // Loading states
    isAnyLoading: store.isLoading || store.isLoggingIn || store.isLoggingOut,
    
    // Authentication status
    canAccess: (roles: string[]) => {
      if (!store.user) return false;
      return roles.includes(store.user.role);
    },
    
    // Error state
    hasError: !!store.error,
  };
};

// ============================================================================
// INITIALIZATION
// ============================================================================

// Initialize auth state on app start
export const initializeAuth = async () => {
  const token = httpClient.getToken();
  
  if (token) {
    try {
      await useAuthStore.getState().fetchProfile();
    } catch (error) {
      // Token is invalid, clear it
      httpClient.clearTokens();
      useAuthStore.getState().setUser(null);
    }
  }
}; 