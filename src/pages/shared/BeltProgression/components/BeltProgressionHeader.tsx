import React, { useState } from 'react';
import { Award, Plus, TrendingUp } from 'lucide-react';
import { PromoteStudentModal } from './PromoteStudentModal';

export const BeltProgressionHeader: React.FC = () => {
  const [showPromoteModal, setShowPromoteModal] = useState(false);

  return (
    <>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-yellow-100 rounded-lg">
            <Award className="text-yellow-600" size={24} />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Progressão de Faixas</h1>
            <p className="text-gray-600">Gerencie promoções e acompanhe o progresso dos alunos</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            onClick={() => setShowPromoteModal(true)}
          >
            <Plus size={20} />
            Promover Aluno
          </button>
        </div>
      </div>

      {/* Quick Stats Bar */}
      <div className="bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200 rounded-lg p-4">
        <div className="flex items-center gap-2 text-yellow-800">
          <TrendingUp size={20} />
          <span className="font-medium">Sistema de Progressão BJJ</span>
        </div>
        <p className="text-sm text-yellow-700 mt-1">
          Acompanhe o desenvolvimento dos alunos através do sistema tradicional de faixas do Jiu-Jitsu brasileiro
        </p>
      </div>

      <PromoteStudentModal
        isOpen={showPromoteModal}
        onClose={() => setShowPromoteModal(false)}
      />
    </>
  );
}; 