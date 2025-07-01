import React from 'react';
import { Plus } from 'lucide-react';
import { Student } from '../../../../types';

interface StudentsStatsProps {
  students: Student[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export const StudentsStats: React.FC<StudentsStatsProps> = ({ students, pagination }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600">Total de Alunos</p>
            <p className="text-2xl font-bold text-gray-900">{students.length}</p>
          </div>
          <div className="p-2 bg-blue-100 rounded-lg">
            <Plus size={20} className="text-blue-600" />
          </div>
        </div>
      </div>
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600">Alunos Ativos</p>
            <p className="text-2xl font-bold text-green-600">
              {students.filter(s => s.status === 'active').length}
            </p>
          </div>
          <div className="p-2 bg-green-100 rounded-lg">
            <Plus size={20} className="text-green-600" />
          </div>
        </div>
      </div>
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600">Página Atual</p>
            <p className="text-2xl font-bold text-purple-600">{pagination.page}</p>
          </div>
          <div className="p-2 bg-purple-100 rounded-lg">
            <Plus size={20} className="text-purple-600" />
          </div>
        </div>
      </div>
    </div>
  );
}; 