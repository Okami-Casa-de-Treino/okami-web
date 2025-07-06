import { AppRoutes } from './routes.constants';

export interface RouteConfig {
  path: string;
  name: string;
  icon?: string;
  showInSidebar?: boolean;
  roles?: ('admin' | 'teacher' | 'receptionist' | 'student')[];
  children?: RouteConfig[];
}

// Admin routes - full access
export const adminRoutes: RouteConfig[] = [
  {
    path: AppRoutes.DASHBOARD,
    name: 'Dashboard',
    icon: 'LayoutDashboard',
    showInSidebar: true,
    roles: ['admin'],
  },
  {
    path: AppRoutes.STUDENTS,
    name: 'Alunos',
    icon: 'Users',
    showInSidebar: true,
    roles: ['admin', 'receptionist'],
    children: [
      {
        path: AppRoutes.STUDENTS_CREATE,
        name: 'Novo Aluno',
        showInSidebar: false,
        roles: ['admin', 'receptionist'],
      },
    ],
  },
  {
    path: AppRoutes.TEACHERS,
    name: 'Professores',
    icon: 'UserCheck',
    showInSidebar: true,
    roles: ['admin'],
    children: [
      {
        path: AppRoutes.TEACHERS_CREATE,
        name: 'Novo Professor',
        showInSidebar: false,
        roles: ['admin'],
      },
      {
        path: `${AppRoutes.TEACHERS}/:id`,
        name: 'Ver Professor',
        showInSidebar: false,
        roles: ['admin'],
      },
      {
        path: `${AppRoutes.TEACHERS_EDIT}/:id`,
        name: 'Editar Professor',
        showInSidebar: false,
        roles: ['admin'],
      },
    ],
  },
  {
    path: AppRoutes.CLASSES,
    name: 'Turmas',
    icon: 'Calendar',
    showInSidebar: true,
    roles: ['admin', 'teacher'],
    children: [
      {
        path: AppRoutes.CLASSES_CREATE,
        name: 'Nova Turma',
        showInSidebar: false,
        roles: ['admin'],
      },
      {
        path: `${AppRoutes.CLASSES}/:id`,
        name: 'Ver Turma',
        showInSidebar: false,
        roles: ['admin', 'teacher'],
      },
      {
        path: `${AppRoutes.CLASSES_EDIT}/:id`,
        name: 'Editar Turma',
        showInSidebar: false,
        roles: ['admin'],
      },
    ],
  },
  {
    path: AppRoutes.CHECKIN,
    name: 'Check-in',
    icon: 'CheckCircle',
    showInSidebar: true,
    roles: ['admin', 'teacher', 'receptionist'],
  },
  {
    path: AppRoutes.BELT_PROGRESSION,
    name: 'Progressão de Faixas',
    icon: 'TrendingUp',
    showInSidebar: true,
    roles: ['admin', 'teacher'],
  },
  {
    path: AppRoutes.VIDEO_CONTENT,
    name: 'Conteúdo de Vídeo',
    icon: 'Video',
    showInSidebar: true,
    roles: ['admin', 'teacher'],
  },

  {
    path: AppRoutes.FINANCIAL,
    name: 'Financeiro',
    icon: 'DollarSign',
    showInSidebar: true,
    roles: ['admin'],
  },
  {
    path: AppRoutes.REPORTS,
    name: 'Relatórios',
    icon: 'BarChart3',
    showInSidebar: true,
    roles: ['admin'],
  },
];

// Teacher routes - limited access
export const teacherRoutes: RouteConfig[] = [
  {
    path: AppRoutes.DASHBOARD,
    name: 'Dashboard',
    icon: 'LayoutDashboard',
    showInSidebar: true,
    roles: ['teacher'],
  },
  {
    path: AppRoutes.MY_CLASSES,
    name: 'Minhas Turmas',
    icon: 'Calendar',
    showInSidebar: true,
    roles: ['teacher'],
  },
  {
    path: AppRoutes.CHECKIN,
    name: 'Check-in',
    icon: 'CheckCircle',
    showInSidebar: true,
    roles: ['teacher'],
  },
  {
    path: AppRoutes.BELT_PROGRESSION,
    name: 'Progressão de Faixas',
    icon: 'Award',
    showInSidebar: true,
    roles: ['teacher'],
  },
  {
    path: AppRoutes.VIDEO_CONTENT,
    name: 'Conteúdo de Vídeo',
    icon: 'Video',
    showInSidebar: true,
    roles: ['teacher'],
  },
  {
    path: AppRoutes.STUDENTS,
    name: 'Alunos',
    icon: 'Users',
    showInSidebar: true,
    roles: ['teacher'],
  },
  {
    path: AppRoutes.PROFILE,
    name: 'Meu Perfil',
    icon: 'User',
    showInSidebar: true,
    roles: ['teacher'],
  },
];

// Student routes - very limited access
export const studentRoutes: RouteConfig[] = [
  {
    path: AppRoutes.DASHBOARD,
    name: 'Dashboard',
    icon: 'LayoutDashboard',
    showInSidebar: true,
    roles: ['student'],
  },
  {
    path: AppRoutes.MY_CLASSES,
    name: 'Minhas Turmas',
    icon: 'Calendar',
    showInSidebar: true,
    roles: ['student'],
  },
  {
    path: AppRoutes.MY_CHECKINS,
    name: 'Minhas Presenças',
    icon: 'CheckCircle',
    showInSidebar: true,
    roles: ['student'],
  },
  {
    path: AppRoutes.MY_PAYMENTS,
    name: 'Mensalidades',
    icon: 'DollarSign',
    showInSidebar: true,
    roles: ['student'],
  },
  {
    path: AppRoutes.PROFILE,
    name: 'Meu Perfil',
    icon: 'User',
    showInSidebar: true,
    roles: ['student'],
  },
];

// Legacy routes for backward compatibility
export const routes: RouteConfig[] = adminRoutes;

// Helper function to get routes based on user role
export const getRoutesByRole = (role: 'admin' | 'teacher' | 'receptionist' | 'student'): RouteConfig[] => {
  switch (role) {
    case 'admin':
    case 'receptionist':
      return adminRoutes;
    case 'teacher':
      return teacherRoutes;
    case 'student':
      return studentRoutes;
    default:
      return [];
  }
};

// Helper function to get all routes (including nested ones)
export const getAllRoutes = (): RouteConfig[] => {
  const allRoutes: RouteConfig[] = [];
  
  const flatten = (routeList: RouteConfig[]) => {
    routeList.forEach(route => {
      allRoutes.push(route);
      if (route.children) {
        flatten(route.children);
      }
    });
  };
  
  flatten([...adminRoutes, ...teacherRoutes, ...studentRoutes]);
  return allRoutes;
};

// Helper function to get sidebar routes for a specific role
export const getSidebarRoutes = (role: 'admin' | 'teacher' | 'receptionist' | 'student'): RouteConfig[] => {
  const roleRoutes = getRoutesByRole(role);
  return roleRoutes.filter(route => route.showInSidebar);
};

// Helper function to check if user can access a route
export const canAccessRoute = (route: RouteConfig, userRole: string): boolean => {
  if (!route.roles || route.roles.length === 0) {
    return true; // No role restriction
  }
  return route.roles.includes(userRole as 'admin' | 'teacher' | 'receptionist' | 'student');
};

// Helper function to get default route for a role
export const getDefaultRouteForRole = (): string => {
  return AppRoutes.DASHBOARD; // All roles start at dashboard, but will see different content
}; 