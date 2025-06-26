import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  UserCheck, 
  Calendar,
  CheckCircle,
  DollarSign,
  BarChart3,
  User
} from 'lucide-react';
import { useAuthStore } from '../../stores/authStore';
import { getSidebarRoutes, canAccessRoute } from '../../routes/routes.config';

// Icon mapping for dynamic icon rendering
const iconMap = {
  LayoutDashboard,
  Users,
  UserCheck,
  Calendar,
  CheckCircle,
  DollarSign,
  BarChart3,
  User,
};

const Sidebar: React.FC = () => {
  const { user } = useAuthStore();
  
  if (!user) {
    return null;
  }

  const sidebarRoutes = getSidebarRoutes(user.role);
  const accessibleRoutes = sidebarRoutes.filter(route => canAccessRoute(route, user.role));

  const getIcon = (iconName?: string) => {
    if (!iconName || !(iconName in iconMap)) {
      return <LayoutDashboard size={20} />;
    }
    const IconComponent = iconMap[iconName as keyof typeof iconMap];
    return <IconComponent size={20} />;
  };

  return (
    <aside className="w-64 bg-white border-r border-gray-200 py-6 overflow-y-auto">
      <nav className="flex flex-col gap-1 px-4">
        {accessibleRoutes.map((route) => (
          <NavLink
            key={route.path}
            to={route.path}
            className={({ isActive }) => 
              `flex items-center gap-3 px-4 py-3 text-gray-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-all duration-200 font-medium ${
                isActive 
                  ? 'bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-700 border-r-2 border-blue-600 shadow-sm' 
                  : ''
              }`
            }
          >
            <span className="flex-shrink-0">{getIcon(route.icon)}</span>
            <span className="text-sm font-medium">{route.name}</span>
          </NavLink>
        ))}
      </nav>
      
      {/* Role indicator at the bottom */}
      <div className="mt-auto px-4 pt-4 border-t border-gray-200">
        <div className="flex items-center gap-2 text-xs text-gray-500">
          <User size={14} />
          <span className="capitalize">{user.role}</span>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar; 