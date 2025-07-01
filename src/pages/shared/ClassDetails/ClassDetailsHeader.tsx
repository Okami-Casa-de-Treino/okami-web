import React from 'react';
import { ArrowLeft, Edit, Trash2 } from 'lucide-react';
import { Class } from '../../../types';

interface ClassDetailsHeaderProps {
  classData: Class;
  isDeleting: boolean;
  onEdit: () => void;
  onDelete: () => void;
  onBack: () => void;
  formatDaysOfWeek: (days: number[]) => string;
  formatTime: (time: string) => string;
}

const ClassDetailsHeader: React.FC<ClassDetailsHeaderProps> = ({
  classData,
  isDeleting,
  onEdit,
  onDelete,
  onBack,
  formatDaysOfWeek,
  formatTime,
}) => {
  return (
    <div className="mb-8">
      <button
        onClick={onBack}
        className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors mb-4"
      >
        <ArrowLeft size={20} />
        Voltar para Aulas
      </button>
      
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">{classData.name}</h1>
          <p className="text-gray-600 mt-1">
            {formatDaysOfWeek(classData.days_of_week)} • {formatTime(classData.start_time)} às {formatTime(classData.end_time)}
          </p>
        </div>
        
        <div className="flex gap-2">
          <button
            onClick={onEdit}
            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Edit size={16} />
            Editar
          </button>
          <button
            onClick={onDelete}
            disabled={isDeleting}
            className="inline-flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
          >
            <Trash2 size={16} />
            {isDeleting ? 'Excluindo...' : 'Excluir'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ClassDetailsHeader; 