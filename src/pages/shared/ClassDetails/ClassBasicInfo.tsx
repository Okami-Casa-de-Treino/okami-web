import React from 'react';
import { User } from 'lucide-react';
import { Class } from '../../../types';

interface ClassBasicInfoProps {
  classData: Class;
  getStatusColor: (status: string) => string;
}

const ClassBasicInfo: React.FC<ClassBasicInfoProps> = ({
  classData,
  getStatusColor,
}) => {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Informações Básicas</h3>
      <div className="space-y-4">
        <div>
          <label className="text-sm font-medium text-gray-500">Nome da Aula</label>
          <p className="text-gray-900 font-medium">{classData.name}</p>
        </div>
        
        {classData.description && (
          <div>
            <label className="text-sm font-medium text-gray-500">Descrição</label>
            <p className="text-gray-900">{classData.description}</p>
          </div>
        )}
        
        <div>
          <label className="text-sm font-medium text-gray-500">Professor</label>
          <div className="flex items-center gap-2 mt-1">
            <User size={16} className="text-gray-400" />
            <p className="text-gray-900">
              {classData.teacher?.full_name || 'Não definido'}
              {classData.teacher?.belt && (
                <span className="ml-2 text-gray-500 text-sm">
                  Faixa {classData.teacher.belt}
                  {classData.teacher.belt_degree && ` ${classData.teacher.belt_degree}º Grau`}
                </span>
              )}
            </p>
          </div>
        </div>

        <div>
          <label className="text-sm font-medium text-gray-500">Status</label>
          <div className="mt-1">
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(classData.status)}`}>
              {classData.status === 'active' ? 'Ativa' : 'Inativa'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClassBasicInfo; 