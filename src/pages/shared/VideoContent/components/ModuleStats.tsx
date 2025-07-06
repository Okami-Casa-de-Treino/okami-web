import React from 'react';
import { Module } from '../../../../types';

interface ModuleStatsProps {
  modules: Module[];
}

export const ModuleStats: React.FC<ModuleStatsProps> = ({ modules }) => {
  const totalVideos = modules.reduce((sum, module) => sum + (module._count?.videos || 0), 0);
  const activeModules = modules.length;
  const averageVideosPerModule = activeModules > 0 ? Math.round(totalVideos / activeModules) : 0;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
              <span className="text-blue-600 font-semibold text-sm">{activeModules}</span>
            </div>
          </div>
          <div className="ml-4">
            <p className="text-sm font-medium text-gray-500">Módulos Ativos</p>
            <p className="text-2xl font-bold text-gray-900">{activeModules}</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
              <span className="text-green-600 font-semibold text-sm">{totalVideos}</span>
            </div>
          </div>
          <div className="ml-4">
            <p className="text-sm font-medium text-gray-500">Total de Vídeos</p>
            <p className="text-2xl font-bold text-gray-900">{totalVideos}</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
              <span className="text-purple-600 font-semibold text-sm">{averageVideosPerModule}</span>
            </div>
          </div>
          <div className="ml-4">
            <p className="text-sm font-medium text-gray-500">Média por Módulo</p>
            <p className="text-2xl font-bold text-gray-900">{averageVideosPerModule}</p>
          </div>
        </div>
      </div>
    </div>
  );
}; 