import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus } from 'lucide-react';

export const StudentsHeader: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Alunos</h1>
        <p className="text-gray-600 mt-1">Gerenciar alunos cadastrados</p>
      </div>
      <button 
        onClick={() => navigate('/students/create')}
        className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 shadow-sm"
      >
        <Plus size={20} />
        Novo Aluno
      </button>
    </div>
  );
}; 