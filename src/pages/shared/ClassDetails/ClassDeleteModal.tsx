import React from 'react';
import { Trash2 } from 'lucide-react';
import { Class } from '../../../types';
import { StudentEnrollment } from './types';

interface ClassDeleteModalProps {
  isOpen: boolean;
  classData: Class;
  students: StudentEnrollment[];
  isDeleting: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

const ClassDeleteModal: React.FC<ClassDeleteModalProps> = ({
  isOpen,
  classData,
  students,
  isDeleting,
  onConfirm,
  onCancel,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
            <Trash2 size={20} className="text-red-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Excluir Aula</h3>
            <p className="text-gray-600">Esta ação não pode ser desfeita.</p>
          </div>
        </div>
        
        <p className="text-gray-700 mb-6">
          Tem certeza de que deseja excluir a aula <strong>{classData.name}</strong>?
          {students.length > 0 && (
            <span className="text-red-600 block mt-2">
              Atenção: Esta aula possui {students.length} aluno(s) matriculado(s).
            </span>
          )}
        </p>
        
        <div className="flex gap-3 justify-end">
          <button
            onClick={onCancel}
            className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
          >
            Cancelar
          </button>
          <button
            onClick={onConfirm}
            disabled={isDeleting}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
          >
            {isDeleting ? 'Excluindo...' : 'Excluir'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ClassDeleteModal; 