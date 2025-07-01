import React, { useState } from 'react';
import { X, Loader2, Calendar } from 'lucide-react';

interface GenerateMonthlyData {
  month: number;
  year: number;
}

interface GenerateMonthlyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: GenerateMonthlyData) => Promise<boolean>;
  loading: boolean;
}

export const GenerateMonthlyModal: React.FC<GenerateMonthlyModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  loading
}) => {
  const currentDate = new Date();
  const [formData, setFormData] = useState<GenerateMonthlyData>({
    month: currentDate.getMonth() + 1,
    year: currentDate.getFullYear()
  });

  const months = [
    { value: 1, label: 'Janeiro' },
    { value: 2, label: 'Fevereiro' },
    { value: 3, label: 'Março' },
    { value: 4, label: 'Abril' },
    { value: 5, label: 'Maio' },
    { value: 6, label: 'Junho' },
    { value: 7, label: 'Julho' },
    { value: 8, label: 'Agosto' },
    { value: 9, label: 'Setembro' },
    { value: 10, label: 'Outubro' },
    { value: 11, label: 'Novembro' },
    { value: 12, label: 'Dezembro' }
  ];

  const years = Array.from({ length: 5 }, (_, i) => currentDate.getFullYear() + i);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const success = await onSubmit(formData);
    if (success) {
      onClose();
    }
  };

  const handleChange = (field: keyof GenerateMonthlyData, value: number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Calendar size={20} className="text-blue-600" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900">Gerar Mensalidades</h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        <div className="p-6">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <p className="text-sm text-blue-800">
              <strong>Atenção:</strong> Esta ação irá gerar cobranças mensais para todos os alunos ativos 
              do mês/ano selecionado. Certifique-se de que as mensalidades ainda não foram geradas 
              para evitar duplicatas.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Mês *
              </label>
              <select
                value={formData.month}
                onChange={(e) => handleChange('month', parseInt(e.target.value))}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              >
                {months.map((month) => (
                  <option key={month.value} value={month.value}>
                    {month.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Ano *
              </label>
              <select
                value={formData.year}
                onChange={(e) => handleChange('year', parseInt(e.target.value))}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              >
                {years.map((year) => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </select>
            </div>

            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="font-medium text-gray-900 mb-2">Resumo da Geração</h4>
              <div className="space-y-1 text-sm text-gray-600">
                <p>• Período: {months.find(m => m.value === formData.month)?.label} de {formData.year}</p>
                <p>• Serão geradas cobranças para todos os alunos ativos</p>
                <p>• Data de vencimento: último dia do mês selecionado</p>
                <p>• Status inicial: Pendente</p>
              </div>
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
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading && <Loader2 size={16} className="animate-spin" />}
                Gerar Mensalidades
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}; 