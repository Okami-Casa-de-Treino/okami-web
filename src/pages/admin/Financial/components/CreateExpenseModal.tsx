import React, { useState } from 'react';
import { X, DollarSign, Calendar, Tag, CreditCard } from 'lucide-react';

interface CreateExpenseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreateExpenseData) => Promise<boolean>;
  loading: boolean;
}

interface CreateExpenseData {
  title: string;
  description?: string;
  amount: number | string;
  category: 'rent' | 'utilities' | 'equipment' | 'maintenance' | 'marketing' | 'insurance' | 'taxes' | 'salary' | 'other';
  expense_date: string;
  due_date: string;
  payment_method?: 'cash' | 'card' | 'bank_transfer';
  status?: 'pending' | 'paid' | 'cancelled';
  receipt_url?: string;
  notes?: string;
}

const categories = [
  { value: 'rent', label: 'Aluguel' },
  { value: 'utilities', label: 'Contas' },
  { value: 'equipment', label: 'Equipamentos' },
  { value: 'maintenance', label: 'Manutenção' },
  { value: 'marketing', label: 'Marketing' },
  { value: 'insurance', label: 'Seguro' },
  { value: 'taxes', label: 'Impostos' },
  { value: 'salary', label: 'Salário' },
  { value: 'other', label: 'Outros' }
];

const paymentMethods = [
  { value: 'cash', label: 'Dinheiro' },
  { value: 'card', label: 'Cartão' },
  { value: 'bank_transfer', label: 'Transferência' }
];

const statusOptions = [
  { value: 'pending', label: 'Pendente' },
  { value: 'paid', label: 'Pago' },
  { value: 'cancelled', label: 'Cancelado' }
];

export const CreateExpenseModal: React.FC<CreateExpenseModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  loading
}) => {
  const [formData, setFormData] = useState<CreateExpenseData>({
    title: '',
    description: '',
    amount: '',
    category: 'other',
    expense_date: new Date().toISOString().split('T')[0],
    due_date: new Date().toISOString().split('T')[0],
    payment_method: 'cash',
    status: 'pending',
    receipt_url: '',
    notes: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title || Number(formData.amount) <= 0) {
      return;
    }

    // Ensure amount is sent as a number
    const success = await onSubmit({ ...formData, amount: Number(formData.amount) });
    if (success) {
      // Reset form
      setFormData({
        title: '',
        description: '',
        amount: '',
        category: 'other',
        expense_date: new Date().toISOString().split('T')[0],
        due_date: new Date().toISOString().split('T')[0],
        payment_method: 'cash',
        status: 'pending',
        receipt_url: '',
        notes: ''
      });
    }
  };

  const handleClose = () => {
    if (!loading) {
      setFormData({
        title: '',
        description: '',
        amount: '',
        category: 'other',
        expense_date: new Date().toISOString().split('T')[0],
        due_date: new Date().toISOString().split('T')[0],
        payment_method: 'cash',
        status: 'pending',
        receipt_url: '',
        notes: ''
      });
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[95vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-red-100 rounded-lg">
              <DollarSign className="w-6 h-6 text-red-600" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Nova Despesa</h2>
              <p className="text-sm text-gray-600">Registrar uma nova despesa</p>
            </div>
          </div>
          <button
            onClick={handleClose}
            disabled={loading}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col flex-1 overflow-hidden">
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {/* Title */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Título da Despesa *
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                placeholder="Ex: Aluguel do mês"
                required
                disabled={loading}
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Descrição
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 resize-none"
                placeholder="Descrição detalhada da despesa..."
                rows={3}
                disabled={loading}
              />
            </div>

            {/* Amount and Category */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Valor (R$) *
                </label>
                <div className="relative">
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={formData.amount}
                    onChange={(e) => setFormData(prev => ({ ...prev, amount: e.target.value }))}
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                    placeholder="0,00"
                    required
                    disabled={loading}
                  />
                  <DollarSign className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Categoria *
                </label>
                <div className="relative">
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value as 'rent' | 'utilities' | 'equipment' | 'maintenance' | 'marketing' | 'insurance' | 'taxes' | 'salary' | 'other' }))}
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 appearance-none"
                    required
                    disabled={loading}
                  >
                    {categories.map(category => (
                      <option key={category.value} value={category.value}>
                        {category.label}
                      </option>
                    ))}
                  </select>
                  <Tag className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" />
                </div>
              </div>
            </div>

            {/* Date and Payment Method */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Data da Despesa *
                </label>
                <div className="relative">
                  <input
                    type="date"
                    value={formData.expense_date}
                    onChange={(e) => setFormData(prev => ({ ...prev, expense_date: e.target.value }))}
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                    required
                    disabled={loading}
                  />
                  <Calendar className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Data de Vencimento *
                </label>
                <div className="relative">
                  <input
                    type="date"
                    value={formData.due_date}
                    onChange={(e) => setFormData(prev => ({ ...prev, due_date: e.target.value }))}
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                    required
                    disabled={loading}
                  />
                  <Calendar className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" />
                </div>
              </div>
            </div>

            {/* Payment Method */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Método de Pagamento
              </label>
              <div className="relative">
                <select
                  value={formData.payment_method}
                  onChange={(e) => setFormData(prev => ({ ...prev, payment_method: e.target.value as 'cash' | 'card' | 'bank_transfer' }))}
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 appearance-none"
                  disabled={loading}
                >
                  {paymentMethods.map(method => (
                    <option key={method.value} value={method.value}>
                      {method.label}
                    </option>
                  ))}
                </select>
                <CreditCard className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" />
              </div>
            </div>

            {/* Status */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Status
              </label>
              <select
                value={formData.status}
                onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value as 'pending' | 'paid' | 'cancelled' }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                disabled={loading}
              >
                {statusOptions.map(status => (
                  <option key={status.value} value={status.value}>
                    {status.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Receipt URL */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                URL do Comprovante
              </label>
              <input
                type="url"
                value={formData.receipt_url}
                onChange={(e) => setFormData(prev => ({ ...prev, receipt_url: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                placeholder="https://..."
                disabled={loading}
              />
            </div>

            {/* Notes */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Observações
              </label>
              <textarea
                value={formData.notes}
                onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 resize-none"
                placeholder="Observações adicionais..."
                rows={3}
                disabled={loading}
              />
            </div>
          </div>

          {/* Footer */}
          <div className="flex gap-3 p-6 border-t border-gray-200 bg-gray-50">
            <button
              type="button"
              onClick={handleClose}
              disabled={loading}
              className="flex-1 px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading || !formData.title || Number(formData.amount) <= 0}
              className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Criando...
                </>
              ) : (
                <>
                  <DollarSign className="w-4 h-4" />
                  Criar Despesa
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}; 