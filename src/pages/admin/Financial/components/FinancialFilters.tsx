import React, { useState } from 'react';
import { Search, Filter, X } from 'lucide-react';

interface PaymentFilters {
  status?: 'pending' | 'paid' | 'overdue' | 'cancelled';
  studentId?: string;
  startDate?: string;
  endDate?: string;
  referenceMonth?: string;
}

interface FinancialFiltersProps {
  searchTerm: string;
  onSearchChange: (term: string) => void;
  filters: PaymentFilters;
  onFiltersChange: (filters: Partial<PaymentFilters>) => void;
  onClearFilters: () => void;
}

export const FinancialFilters: React.FC<FinancialFiltersProps> = ({
  searchTerm,
  onSearchChange,
  filters,
  onFiltersChange,
  onClearFilters
}) => {
  const [showFilters, setShowFilters] = useState(false);

  const hasActiveFilters = Object.values(filters).some(value => value !== undefined && value !== '');

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1 max-w-md">
          <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input 
            type="text" 
            placeholder="Buscar por aluno, ID ou descrição..." 
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
          />
        </div>
        <div className="flex gap-2">
          <button 
            className={`inline-flex items-center gap-2 px-4 py-2.5 border rounded-lg transition-colors ${
              showFilters || hasActiveFilters
                ? 'bg-blue-50 border-blue-300 text-blue-700'
                : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
            }`}
            onClick={() => setShowFilters(!showFilters)}
          >
            <Filter size={20} />
            Filtros
            {hasActiveFilters && (
              <span className="bg-blue-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {Object.values(filters).filter(v => v).length}
              </span>
            )}
          </button>
          {hasActiveFilters && (
            <button 
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              onClick={onClearFilters}
            >
              <X size={20} />
              Limpar
            </button>
          )}
        </div>
      </div>

      {showFilters && (
        <div className="bg-white border border-gray-200 rounded-lg p-4 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Status
              </label>
              <select
                value={filters.status || ''}
                onChange={(e) => onFiltersChange({ 
                  status: e.target.value as 'pending' | 'paid' | 'overdue' | 'cancelled' || undefined 
                })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Todos os status</option>
                <option value="pending">Pendente</option>
                <option value="paid">Pago</option>
                <option value="overdue">Atrasado</option>
                <option value="cancelled">Cancelado</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Data Inicial
              </label>
              <input
                type="date"
                value={filters.startDate || ''}
                onChange={(e) => onFiltersChange({ startDate: e.target.value || undefined })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Data Final
              </label>
              <input
                type="date"
                value={filters.endDate || ''}
                onChange={(e) => onFiltersChange({ endDate: e.target.value || undefined })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Mês de Referência
              </label>
              <input
                type="month"
                value={filters.referenceMonth || ''}
                onChange={(e) => onFiltersChange({ referenceMonth: e.target.value || undefined })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}; 