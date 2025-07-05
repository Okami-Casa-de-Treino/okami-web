import React from 'react';
import { useAuthStore } from '../../stores/authStore';
import { useSidebarStore } from '../../stores/sidebarStore';
import { LogOut, User, Menu } from 'lucide-react';

const Header: React.FC = () => {
  const { user, logout } = useAuthStore();
  const { toggleSidebar } = useSidebarStore();

  const handleLogout = () => {
    logout();
  };

  return (
    <header className="bg-white border-b border-gray-200 px-8 h-16 flex items-center justify-between shadow-sm">
      <div className="flex items-center gap-4">
        <button
          onClick={toggleSidebar}
          className="p-2 rounded-lg text-gray-500 hover:bg-gray-100 transition-colors duration-200"
          aria-label="Toggle sidebar"
        >
          <Menu size={20} />
        </button>
        <h1 className="text-2xl font-bold text-secondary tracking-tight">
          Okami Casa de Treino
        </h1>
      </div>
      
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-3 text-gray-600">
          <div className="p-2 bg-gray-100 rounded-full">
            <User size={20} className="text-gray-600" />
          </div>
          <div className="flex flex-col">
            <span className="font-medium text-gray-900">
              {typeof user?.name === 'string' ? user.name : 
               typeof user?.username === 'string' ? user.username : 
               typeof user?.reference === 'string' ? user.reference : 
               'Usuário'}
            </span>
            <span className="text-sm text-gray-500 capitalize">
              ({typeof user?.role === 'string' ? user.role : 'admin'})
            </span>
          </div>
        </div>
        
        <button 
          onClick={handleLogout}
          className="p-2 rounded-lg text-gray-500 hover:bg-red-50 hover:text-red-600 transition-all duration-200"
          title="Logout"
        >
          <LogOut size={20} />
        </button>
      </div>
    </header>
  );
};

export default Header; 