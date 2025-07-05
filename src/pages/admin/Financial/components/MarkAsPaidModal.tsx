import React, { useState } from 'react';
import { X, Loader2 } from 'lucide-react';
import { Payment } from '../../../../types';
import { useToast } from '../../../../hooks/useToast';

interface MarkAsPaidData {
  paymentMethod: 'cash' | 'card' | 'pix' | 'bank_transfer';
  paymentDate?: string;
}

interface MarkAsPaidModalProps {
  isOpen: boolean;
  onClose: () => void;
  payment: Payment;
  onSubmit: (paymentId: string, data: MarkAsPaidData) => Promise<boolean>;
  loading: boolean;
}

export const MarkAsPaidModal: React.FC<MarkAsPaidModalProps> = ({
  isOpen,
  onClose,
  payment,
  onSubmit,
  loading
}) => {
  const [formData, setFormData] = useState<MarkAsPaidData>({
    paymentMethod: 'pix',
    paymentDate: new Date().toISOString().split('T')[0]
  });

  const { success, error: showError } = useToast();

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(amount);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const isSuccess = await onSubmit(payment.id, formData);
      if (isSuccess) {
        success('Pagamento marcado como pago com sucesso!');
        onClose();
      } else {
        showError('Erro ao marcar pagamento como pago');
      }
    } catch (err) {
      showError(
        err instanceof Error ? err.message : 'Erro ao marcar pagamento como pago'
      );
    }
  };

  const handleChange = (field: keyof MarkAsPaidData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Marcar como Pago</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        <div className="p-6">
          {/* Payment Info */}
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                {payment.student?.full_name?.split(' ').map(n => n.charAt(0)).join('').substring(0, 2).toUpperCase() || '?'}
              </div>
              <div>
                <p className="font-medium text-gray-900">
                  {payment.student?.full_name || 'Aluno não encontrado'}
                </p>
                <p className="text-sm text-gray-500">
                  {payment.reference_month} - {payment.notes || 'Mensalidade'}
                </p>
              </div>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Valor:</span>
              <span className="font-semibold text-lg text-gray-900">
                {formatCurrency(payment.amount)}
              </span>
            </div>
            {payment.discount > 0 && (
              <div className="flex justify-between items-center mt-1">
                <span className="text-sm text-gray-600">Desconto:</span>
                <span className="text-sm text-green-600">
                  -{formatCurrency(payment.discount)}
                </span>
              </div>
            )}
            <div className="flex justify-between items-center mt-2 pt-2 border-t border-gray-200">
              <span className="text-sm font-medium text-gray-600">Total a receber:</span>
              <span className="font-bold text-lg text-green-600">
                {formatCurrency(payment.amount - payment.discount)}
              </span>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Método de Pagamento *
              </label>
              <select
                value={formData.paymentMethod}
                onChange={(e) => handleChange('paymentMethod', e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              >
                <option value="pix">PIX</option>
                <option value="card">Cartão</option>
                <option value="cash">Dinheiro</option>
                <option value="bank_transfer">Transferência Bancária</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Data do Pagamento *
              </label>
              <input
                type="date"
                value={formData.paymentDate}
                onChange={(e) => handleChange('paymentDate', e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
                max={new Date().toISOString().split('T')[0]}
              />
            </div>

            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading && <Loader2 size={16} className="animate-spin" />}
                Confirmar Pagamento
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}; 