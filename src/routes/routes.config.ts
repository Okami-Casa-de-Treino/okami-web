export interface RouteConfig {
  path: string;
  name: string;
  icon?: string;
  showInSidebar?: boolean;
  children?: RouteConfig[];
}

export const routes: RouteConfig[] = [
  {
    path: '/dashboard',
    name: 'Dashboard',
    icon: 'LayoutDashboard',
    showInSidebar: true,
  },
  {
    path: '/students',
    name: 'Alunos',
    icon: 'Users',
    showInSidebar: true,
    children: [
      {
        path: '/students/create',
        name: 'Novo Aluno',
        showInSidebar: false,
      },
    ],
  },
  {
    path: '/teachers',
    name: 'Professores',
    icon: 'UserCheck',
    showInSidebar: true,
    children: [
      {
        path: '/teachers/create',
        name: 'Novo Professor',
        showInSidebar: false,
      },
    ],
  },
  {
    path: '/classes',
    name: 'Turmas',
    icon: 'Calendar',
    showInSidebar: true,
  },
  {
    path: '/checkin',
    name: 'Check-in',
    icon: 'CheckCircle',
    showInSidebar: true,
  },
  {
    path: '/financial',
    name: 'Financeiro',
    icon: 'DollarSign',
    showInSidebar: true,
  },
  {
    path: '/reports',
    name: 'Relatórios',
    icon: 'BarChart3',
    showInSidebar: true,
  },
];

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
  
  flatten(routes);
  return allRoutes;
};

// Helper function to get sidebar routes only
export const getSidebarRoutes = (): RouteConfig[] => {
  return routes.filter(route => route.showInSidebar);
}; 