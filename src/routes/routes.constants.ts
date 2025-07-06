// Route constants for centralized route management
export enum AppRoutes {
  // Main routes
  DASHBOARD = '/dashboard',
  LOGIN = '/login',
  
  // Student routes
  STUDENTS = '/alunos',
  STUDENTS_CREATE = '/alunos/criar',
  STUDENTS_EDIT = '/alunos/editar',
  
  // Teacher routes
  TEACHERS = '/professores',
  TEACHERS_CREATE = '/professores/criar',
  TEACHERS_EDIT = '/professores/editar',
  
  // Class routes
  CLASSES = '/turmas',
  CLASSES_CREATE = '/turmas/criar',
  CLASSES_EDIT = '/turmas/editar',
  MY_CLASSES = '/minhas-turmas',
  
  // Check-in routes
  CHECKIN = '/checkin',
  MY_CHECKINS = '/minhas-presencas',
  
  // Belt progression routes
  BELT_PROGRESSION = '/progressao-faixas',
  
  // Video content routes
  VIDEO_CONTENT = '/conteudo-video',
  
  // Financial routes
  FINANCIAL = '/financeiro',
  MY_PAYMENTS = '/minhas-mensalidades',
  
  // Reports routes
  REPORTS = '/relatorios',
  
  // Profile routes
  PROFILE = '/perfil',
}

// Helper functions for dynamic routes
export const RouteHelpers = {
  // Student routes with ID
  studentEdit: (id: string | number) => `${AppRoutes.STUDENTS_EDIT}/${id}`,
  studentDetails: (id: string | number) => `${AppRoutes.STUDENTS}/${id}`,
  
  // Teacher routes with ID
  teacherDetails: (id: string | number) => `${AppRoutes.TEACHERS}/${id}`,
  teacherEdit: (id: string | number) => `${AppRoutes.TEACHERS_EDIT}/${id}`,
  
  // Class routes with ID
  classDetails: (id: string | number) => `${AppRoutes.CLASSES}/${id}`,
  classEdit: (id: string | number) => `${AppRoutes.CLASSES_EDIT}/${id}`,
};

// Route groups for easier management
export const RouteGroups = {
  // Admin routes
  admin: [
    AppRoutes.DASHBOARD,
    AppRoutes.STUDENTS,
    AppRoutes.TEACHERS,
    AppRoutes.CLASSES,
    AppRoutes.CHECKIN,
    AppRoutes.BELT_PROGRESSION,
    AppRoutes.VIDEO_CONTENT,
    AppRoutes.FINANCIAL,
    AppRoutes.REPORTS,
    AppRoutes.PROFILE,
  ],
  
  // Teacher routes
  teacher: [
    AppRoutes.DASHBOARD,
    AppRoutes.MY_CLASSES,
    AppRoutes.CHECKIN,
    AppRoutes.BELT_PROGRESSION,
    AppRoutes.VIDEO_CONTENT,
    AppRoutes.STUDENTS,
    AppRoutes.PROFILE,
  ],
  
  // Student routes
  student: [
    AppRoutes.DASHBOARD,
    AppRoutes.MY_CLASSES,
    AppRoutes.MY_CHECKINS,
    AppRoutes.MY_PAYMENTS,
    AppRoutes.PROFILE,
  ],
  
  // Receptionist routes
  receptionist: [
    AppRoutes.DASHBOARD,
    AppRoutes.STUDENTS,
    AppRoutes.CHECKIN,
    AppRoutes.PROFILE,
  ],
};

// Type for route parameters
export type RouteParams = {
  id?: string | number;
  [key: string]: string | number | undefined;
};

// Helper function to build routes with parameters
export const buildRoute = (route: string, params?: RouteParams): string => {
  if (!params) return route;
  
  let result = route;
  Object.entries(params).forEach(([key, value]) => {
    result = result.replace(`:${key}`, String(value));
  });
  
  return result;
};

// Default route for each role
export const getDefaultRouteForRole = (): string => {
  return AppRoutes.DASHBOARD;
}; 