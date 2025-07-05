import React, { useState } from 'react';
import { X, Loader2, Calendar } from 'lucide-react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { format } from 'date-fns';
import { useToast } from '../../../../hooks/useToast';

interface GenerateMonthlyData {
  reference_month: string; // Format: YYYY-MM-DD (first day of month)
  due_day: number;
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
  const toast = useToast();
  const currentDate = new Date();
  const [selectedMonth, setSelectedMonth] = useState(new Date(currentDate.getFullYear(), currentDate.getMonth(), 1));
  const [dueDate, setDueDate] = useState(new Date(currentDate.getFullYear(), currentDate.getMonth(), 10));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Format the data for the API
    const apiData: GenerateMonthlyData = {
      reference_month: format(selectedMonth, 'yyyy-MM-dd'),
      due_day: dueDate.getDate()
    };
    
    try {
      const success = await onSubmit(apiData);
      if (success) {
        toast.success('Mensalidades geradas com sucesso!', {
          autoClose: 5000,
          position: 'top-right'
        });
        onClose();
      } else {
        toast.error('Erro ao gerar mensalidades. Tente novamente.', {
          autoClose: 5000,
          position: 'top-right'
        });
      }
    } catch (error) {
      toast.error('Erro inesperado ao gerar mensalidades. Tente novamente.', {
        autoClose: 5000,
        position: 'top-right'
      });
    }
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
                Mês de Referência *
              </label>
              <DatePicker
                selected={selectedMonth}
                onChange={(date: Date | null) => date && setSelectedMonth(date)}
                dateFormat="MMMM yyyy"
                showMonthYearPicker
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholderText="Selecione o mês"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Data de Vencimento *
              </label>
              <DatePicker
                selected={dueDate}
                onChange={(date: Date | null) => date && setDueDate(date)}
                dateFormat="dd/MM/yyyy"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholderText="Selecione a data de vencimento"
                required
              />
              <p className="text-xs text-gray-500 mt-1">
                Escolha qualquer data - apenas o dia será usado como vencimento mensal
              </p>
            </div>

            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="font-medium text-gray-900 mb-2">Resumo da Geração</h4>
              <div className="space-y-1 text-sm text-gray-600">
                <p>• Período: {format(selectedMonth, 'MMMM yyyy')}</p>
                <p>• Serão geradas cobranças para todos os alunos ativos</p>
                <p>• Data de vencimento: Dia {dueDate.getDate()} de cada mês</p>
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