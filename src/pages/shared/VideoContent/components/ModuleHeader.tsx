import React from 'react';
import { Plus, FolderOpen } from 'lucide-react';

interface ModuleHeaderProps {
  onCreateClick: () => void;
  totalModules: number;
}

export const ModuleHeader: React.FC<ModuleHeaderProps> = ({
  onCreateClick,
  totalModules,
}) => {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="flex items-center justify-center w-12 h-12 bg-green-100 rounded-lg">
            <FolderOpen className="w-6 h-6 text-green-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Gerenciamento de Módulos</h1>
            <p className="text-sm text-gray-500">
              Organize e gerencie os módulos de conteúdo de vídeo
            </p>
          </div>
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="text-right">
            <p className="text-sm text-gray-500">Total de Módulos</p>
            <p className="text-2xl font-bold text-gray-900">{totalModules}</p>
          </div>
          
          <button
            onClick={onCreateClick}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors"
          >
            <Plus className="w-4 h-4 mr-2" />
            Criar Módulo
          </button>
        </div>
      </div>
    </div>
  );
}; 