import React from 'react';
import { Plus, AlertTriangle, Calendar } from 'lucide-react';

interface FinancialHeaderProps {
  overdueCount: number;
  onCreatePayment: () => void;
  onGenerateMonthly: () => void;
}

export const FinancialHeader: React.FC<FinancialHeaderProps> = ({
  overdueCount,
  onCreatePayment,
  onGenerateMonthly
}) => {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Financeiro</h1>
        <p className="text-gray-600 mt-1">Gerenciar pagamentos e mensalidades</p>
      </div>
      <div className="flex gap-2">
        {overdueCount > 0 && (
          <button 
            className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-red-300 text-red-700 rounded-lg hover:bg-red-50 transition-colors"
            onClick={() => {/* TODO: Filter by overdue */}}
          >
            <AlertTriangle size={20} />
            Pendências ({overdueCount})
          </button>
        )}
        <button 
          className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-blue-300 text-blue-700 rounded-lg hover:bg-blue-50 transition-colors"
          onClick={onGenerateMonthly}
        >
          <Calendar size={20} />
          Gerar Mensalidades
        </button>
        <button 
          className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 shadow-sm"
          onClick={onCreatePayment}
        >
          <Plus size={20} />
          Nova Cobrança
        </button>
      </div>
    </div>
  );
}; 