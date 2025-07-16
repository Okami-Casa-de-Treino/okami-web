import React from 'react';
import { X, Trash2, AlertTriangle, Award } from 'lucide-react';
import { BeltPromotion } from '../../../../types';
import { useBeltProgressionStore } from '../../../../stores';
import { useToast } from '../../../../hooks/useToast';
import { formatDate } from '../../../../utils';

interface DeletePromotionModalProps {
  isOpen: boolean;
  onClose: () => void;
  promotion: BeltPromotion | null;
}

export const DeletePromotionModal: React.FC<DeletePromotionModalProps> = ({ 
  isOpen, 
  onClose, 
  promotion 
}) => {
  const { deletePromotion, isPromoting, error } = useBeltProgressionStore();
  const toast = useToast();

  // Display store errors via toast
  React.useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error, toast]);

  const handleDelete = async () => {
    if (!promotion) return;

    try {
      await deletePromotion(promotion.id);
      toast.success(`Promoção de ${promotion.student?.full_name} excluída com sucesso!`);
      onClose();
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erro ao excluir promoção';
      toast.error(errorMessage);
    }
  };

  if (!isOpen || !promotion) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-md w-full">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-red-100 rounded-lg">
              <Trash2 className="text-red-600" size={20} />
            </div>
            <h2 className="text-xl font-semibold text-gray-900">Excluir Promoção</h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        <div className="p-6">
          {/* Warning Alert */}
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <div className="flex items-center gap-3">
              <AlertTriangle className="text-red-600" size={20} />
              <div>
                <h3 className="font-medium text-red-900">Atenção!</h3>
                <p className="text-sm text-red-700 mt-1">
                  Esta ação não pode ser desfeita. A promoção será permanentemente removida do sistema.
                </p>
              </div>
            </div>
          </div>

          {/* Promotion Details */}
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-6">
            <h3 className="font-medium text-gray-900 mb-3">Detalhes da Promoção</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Aluno:</span>
                <span className="font-medium">{promotion.student?.full_name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Promoção:</span>
                <span className="font-medium">
                  {promotion.previous_belt} {promotion.previous_degree}° → {promotion.new_belt} {promotion.new_degree}°
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Data:</span>
                <span className="font-medium">{formatDate(promotion.promotion_date)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Tipo:</span>
                <span className="font-medium capitalize">{promotion.promotion_type}</span>
              </div>
              {promotion.notes && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Observações:</span>
                  <span className="font-medium text-gray-900 max-w-xs truncate" title={promotion.notes}>
                    {promotion.notes}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Impact Warning */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
            <div className="flex items-start gap-3">
              <Award className="text-yellow-600 mt-0.5" size={16} />
              <div>
                <h4 className="font-medium text-yellow-900">Impacto da Exclusão</h4>
                <ul className="text-sm text-yellow-700 mt-2 space-y-1">
                  <li>• A promoção será removida do histórico do aluno</li>
                  <li>• Se for a promoção mais recente, a faixa atual do aluno pode ser afetada</li>
                  <li>• Todos os dados associados serão perdidos permanentemente</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancelar
            </button>
            <button
              onClick={handleDelete}
              disabled={isPromoting}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isPromoting ? 'Excluindo...' : 'Excluir Promoção'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}; 