import React from 'react';
import { Calendar } from 'lucide-react';
import { Class } from '../../../types';
import { formatDate } from '../../../utils';

interface ClassMetadataProps {
  classData: Class;
}

export const ClassMetadata: React.FC<ClassMetadataProps> = ({ classData }) => {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
        <Calendar size={20} className="text-blue-600" />
        Metadados da Turma
      </h3>
      
      <div className="space-y-4 text-sm">
        <div>
          <label className="block text-gray-500 mb-1">Criado em:</label>
          <p className="text-gray-900">{formatDate(classData.created_at)}</p>
        </div>
        
        <div>
          <label className="block text-gray-500 mb-1">Última atualização:</label>
          <p className="text-gray-900">{formatDate(classData.updated_at)}</p>
        </div>
        
        <div>
          <label className="block text-gray-500 mb-1">ID da turma:</label>
          <p className="text-gray-900 font-mono text-xs">{classData.id}</p>
        </div>
      </div>
    </div>
  );
}; 