import React from 'react';
import { X, AlertTriangle } from 'lucide-react';
import { useModuleStore } from '../../../../stores/moduleStore';
import { Module } from '../../../../types';

interface DeleteModuleModalProps {
  isOpen: boolean;
  module: Module;
  onClose: () => void;
  onSuccess: () => void;
}

export const DeleteModuleModal: React.FC<DeleteModuleModalProps> = ({
  isOpen,
  module,
  onClose,
  onSuccess,
}) => {
  const { deleteModule, loading } = useModuleStore();

  const handleDelete = async () => {
    try {
      await deleteModule(module.id);
      onSuccess();
    } catch (error) {
      // Error is handled by the store
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
        <div className="mt-3">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-gray-900">
              Excluir Módulo
            </h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="flex items-start mb-4">
            <div className="flex-shrink-0">
              <AlertTriangle className="h-6 w-6 text-red-400" />
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">
                Confirmar exclusão
              </h3>
              <div className="mt-2 text-sm text-red-700">
                <p>
                  Tem certeza que deseja excluir o módulo <strong>"{module.name}"</strong>?
                </p>
                {module._count?.videos && module._count.videos > 0 && (
                  <p className="mt-2">
                    <strong>Atenção:</strong> Este módulo contém {module._count.videos} vídeo(s) que também serão removidos.
                  </p>
                )}
                <p className="mt-2">
                  Esta ação não pode ser desfeita.
                </p>
              </div>
            </div>
          </div>

          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Cancelar
            </button>
            <button
              type="button"
              onClick={handleDelete}
              disabled={loading}
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Excluindo...' : 'Excluir Módulo'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}; 