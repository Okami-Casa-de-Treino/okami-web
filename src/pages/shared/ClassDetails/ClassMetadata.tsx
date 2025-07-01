import React from 'react';
import { Class } from '../../../types';

interface ClassMetadataProps {
  classData: Class;
}

const ClassMetadata: React.FC<ClassMetadataProps> = ({
  classData,
}) => {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Informações do Sistema</h3>
      <div className="space-y-4">
        <div>
          <label className="text-sm font-medium text-gray-500">Data de Criação</label>
          <p className="text-gray-900">{new Date(classData.created_at).toLocaleDateString('pt-BR')}</p>
        </div>
        
        <div>
          <label className="text-sm font-medium text-gray-500">Última Atualização</label>
          <p className="text-gray-900">{new Date(classData.updated_at).toLocaleDateString('pt-BR')}</p>
        </div>
      </div>
    </div>
  );
};

export default ClassMetadata; 