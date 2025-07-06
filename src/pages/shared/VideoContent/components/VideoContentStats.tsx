import React from 'react';
import { Video, FolderOpen, Clock } from 'lucide-react';
import { Module } from '../../../../types';


interface VideoContentStatsProps {
  totalVideos: number;
  selectedModule: string;
  modules: Module[];
}

export const VideoContentStats: React.FC<VideoContentStatsProps> = ({
  totalVideos,
  selectedModule,
  modules,
}) => {
  const stats = [
    {
      name: 'Total Videos',
      value: totalVideos,
      icon: Video,
      color: 'bg-blue-500',
      bgColor: 'bg-blue-100',
      textColor: 'text-blue-600',
    },
    {
      name: 'Total Modules',
      value: Array.isArray(modules) ? modules.length : 0,
      icon: FolderOpen,
      color: 'bg-green-500',
      bgColor: 'bg-green-100',
      textColor: 'text-green-600',
    },
    {
      name: 'Active Filter',
      value: selectedModule === 'all' ? 'All Modules' : 'Filtered',
      icon: Clock,
      color: 'bg-purple-500',
      bgColor: 'bg-purple-100',
      textColor: 'text-purple-600',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {stats.map((stat) => (
        <div
          key={stat.name}
          className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
        >
          <div className="flex items-center">
            <div className={`flex-shrink-0 ${stat.bgColor} rounded-lg p-3`}>
              <stat.icon className={`w-6 h-6 ${stat.textColor}`} />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">{stat.name}</p>
              <p className="text-2xl font-bold text-gray-900">
                {typeof stat.value === 'number' ? stat.value.toLocaleString() : stat.value}
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}; 