import React from 'react';
import { GraduationCap, Users } from 'lucide-react';
import { Class } from '../../../types';

interface ClassRequirementsProps {
  classData: Class;
}

const ClassRequirements: React.FC<ClassRequirementsProps> = ({
  classData,
}) => {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Requisitos</h3>
      <div className="space-y-4">
        <div>
          <label className="text-sm font-medium text-gray-500">Requisito de Faixa</label>
          <div className="flex items-center gap-2 mt-1">
            <GraduationCap size={16} className="text-gray-400" />
            <p className="text-gray-900">{classData.belt_requirement || 'Todas as faixas'}</p>
          </div>
        </div>
        
        <div>
          <label className="text-sm font-medium text-gray-500">Faixa Etária</label>
          <div className="flex items-center gap-2 mt-1">
            <Users size={16} className="text-gray-400" />
            <p className="text-gray-900">{classData.age_group || 'Todas as idades'}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClassRequirements; 