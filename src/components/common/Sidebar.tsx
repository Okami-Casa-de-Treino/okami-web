import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  UserCheck, 
  Calendar,
  CheckSquare,
  DollarSign,
  BarChart3
} from 'lucide-react';

interface NavigationItem {
  path: string;
  label: string;
  icon: React.ReactNode;
}

const navigationItems: NavigationItem[] = [
  {
    path: '/dashboard',
    label: 'Dashboard',
    icon: <LayoutDashboard size={20} />
  },
  {
    path: '/students',
    label: 'Alunos',
    icon: <Users size={20} />
  },
  {
    path: '/teachers',
    label: 'Professores',
    icon: <UserCheck size={20} />
  },
  {
    path: '/classes',
    label: 'Aulas',
    icon: <Calendar size={20} />
  },
  {
    path: '/checkin',
    label: 'Check-in',
    icon: <CheckSquare size={20} />
  },
  {
    path: '/financial',
    label: 'Financeiro',
    icon: <DollarSign size={20} />
  },
  {
    path: '/reports',
    label: 'Relatórios',
    icon: <BarChart3 size={20} />
  }
];

const Sidebar: React.FC = () => {
  return (
    <aside className="w-64 bg-white border-r border-gray-200 py-6 overflow-y-auto">
      <nav className="flex flex-col gap-1 px-4">
        {navigationItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) => 
              `flex items-center gap-3 px-4 py-3 text-gray-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-all duration-200 font-medium ${
                isActive 
                  ? 'bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-700 border-r-2 border-blue-600 shadow-sm' 
                  : ''
              }`
            }
          >
            <span className="flex-shrink-0">{item.icon}</span>
            <span className="text-sm font-medium">{item.label}</span>
          </NavLink>
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar; 