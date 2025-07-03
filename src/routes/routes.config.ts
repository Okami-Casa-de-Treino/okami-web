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
    path: '/dashboard',
    name: 'Dashboard',
    icon: 'LayoutDashboard',
    showInSidebar: true,
    roles: ['admin'],
  },
  {
    path: '/students',
    name: 'Alunos',
    icon: 'Users',
    showInSidebar: true,
    roles: ['admin', 'receptionist'],
    children: [
      {
        path: '/students/create',
        name: 'Novo Aluno',
        showInSidebar: false,
        roles: ['admin', 'receptionist'],
      },
    ],
  },
  {
    path: '/teachers',
    name: 'Professores',
    icon: 'UserCheck',
    showInSidebar: true,
    roles: ['admin'],
    children: [
      {
        path: '/teachers/create',
        name: 'Novo Professor',
        showInSidebar: false,
        roles: ['admin'],
      },
      {
        path: '/teachers/:id',
        name: 'Ver Professor',
        showInSidebar: false,
        roles: ['admin'],
      },
      {
        path: '/teachers/:id/edit',
        name: 'Editar Professor',
        showInSidebar: false,
        roles: ['admin'],
      },
    ],
  },
  {
    path: '/classes',
    name: 'Turmas',
    icon: 'Calendar',
    showInSidebar: true,
    roles: ['admin', 'teacher'],
    children: [
      {
        path: '/classes/create',
        name: 'Nova Turma',
        showInSidebar: false,
        roles: ['admin'],
      },
      {
        path: '/classes/:id',
        name: 'Ver Turma',
        showInSidebar: false,
        roles: ['admin', 'teacher'],
      },
      {
        path: '/classes/:id/edit',
        name: 'Editar Turma',
        showInSidebar: false,
        roles: ['admin'],
      },
    ],
  },
  {
    path: '/checkin',
    name: 'Check-in',
    icon: 'CheckCircle',
    showInSidebar: true,
    roles: ['admin', 'teacher', 'receptionist'],
  },
  {
    path: '/belt-progression',
    name: 'Progressão de Faixas',
    icon: 'Award',
    showInSidebar: true,
    roles: ['admin', 'teacher'],
  },
  {
    path: '/financial',
    name: 'Financeiro',
    icon: 'DollarSign',
    showInSidebar: true,
    roles: ['admin'],
  },
  {
    path: '/reports',
    name: 'Relatórios',
    icon: 'BarChart3',
    showInSidebar: true,
    roles: ['admin'],
  },
];

// Teacher routes - limited access
export const teacherRoutes: RouteConfig[] = [
  {
    path: '/dashboard',
    name: 'Dashboard',
    icon: 'LayoutDashboard',
    showInSidebar: true,
    roles: ['teacher'],
  },
  {
    path: '/my-classes',
    name: 'Minhas Turmas',
    icon: 'Calendar',
    showInSidebar: true,
    roles: ['teacher'],
  },
  {
    path: '/checkin',
    name: 'Check-in',
    icon: 'CheckCircle',
    showInSidebar: true,
    roles: ['teacher'],
  },
  {
    path: '/belt-progression',
    name: 'Progressão de Faixas',
    icon: 'Award',
    showInSidebar: true,
    roles: ['teacher'],
  },
  {
    path: '/students',
    name: 'Alunos',
    icon: 'Users',
    showInSidebar: true,
    roles: ['teacher'],
  },
  {
    path: '/profile',
    name: 'Meu Perfil',
    icon: 'User',
    showInSidebar: true,
    roles: ['teacher'],
  },
];

// Student routes - very limited access
export const studentRoutes: RouteConfig[] = [
  {
    path: '/dashboard',
    name: 'Dashboard',
    icon: 'LayoutDashboard',
    showInSidebar: true,
    roles: ['student'],
  },
  {
    path: '/my-classes',
    name: 'Minhas Turmas',
    icon: 'Calendar',
    showInSidebar: true,
    roles: ['student'],
  },
  {
    path: '/my-checkins',
    name: 'Minhas Presenças',
    icon: 'CheckCircle',
    showInSidebar: true,
    roles: ['student'],
  },
  {
    path: '/my-payments',
    name: 'Mensalidades',
    icon: 'DollarSign',
    showInSidebar: true,
    roles: ['student'],
  },
  {
    path: '/profile',
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
  return '/dashboard'; // All roles start at dashboard, but will see different content
}; 