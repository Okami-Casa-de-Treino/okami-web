import React from 'react';
import { DollarSign, Clock, AlertTriangle, CheckCircle } from 'lucide-react';

interface PaymentStats {
  totalRevenue: number;
  pendingCount: number;
  pendingAmount: number;
  overdueCount: number;
  paymentRate: number;
}

interface FinancialStatsProps {
  stats: PaymentStats;
  loading: boolean;
}

export const FinancialStats: React.FC<FinancialStatsProps> = ({
  stats,
  loading
}) => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(amount);
  };
  console.log('stats', stats);

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        {[...Array(4)].map((_, index) => (
          <div key={index} className="bg-white rounded-lg border border-gray-200 p-4 animate-pulse">
            <div className="flex items-center justify-between">
              <div className="space-y-2">
                <div className="h-4 bg-gray-200 rounded w-20"></div>
                <div className="h-8 bg-gray-200 rounded w-16"></div>
              </div>
              <div className="p-2 bg-gray-100 rounded-lg">
                <div className="w-5 h-5 bg-gray-200 rounded"></div>
              </div>
            </div>
            <div className="mt-2">
              <div className="h-3 bg-gray-200 rounded w-24"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600">Receita Mensal</p>
            <p className="text-2xl font-bold text-green-600">
              {formatCurrency(stats.totalRevenue)}
            </p>
          </div>
          <div className="p-2 bg-green-100 rounded-lg">
            <DollarSign size={20} className="text-green-600" />
          </div>
        </div>
        <div className="mt-2">
          <span className="text-xs text-green-600 font-medium">
            Pagamentos recebidos
          </span>
        </div>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600">Pagamentos Pendentes</p>
            <p className="text-2xl font-bold text-yellow-600">{stats.pendingCount}</p>
          </div>
          <div className="p-2 bg-yellow-100 rounded-lg">
            <Clock size={20} className="text-yellow-600" />
          </div>
        </div>
        <div className="mt-2">
          <span className="text-xs text-gray-500">
            {formatCurrency(stats.pendingAmount)} em aberto
          </span>
        </div>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600">Pagamentos em Atraso</p>
            <p className="text-2xl font-bold text-red-600">{stats.overdueCount}</p>
          </div>
          <div className="p-2 bg-red-100 rounded-lg">
            <AlertTriangle size={20} className="text-red-600" />
          </div>
        </div>
        <div className="mt-2">
          <span className="text-xs text-red-600 font-medium">
            {stats.overdueCount > 0 ? 'Requer atenção' : 'Nenhum atraso'}
          </span>
        </div>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600">Taxa de Pagamento</p>
            <p className="text-2xl font-bold text-blue-600">{stats.paymentRate}%</p>
          </div>
          <div className="p-2 bg-blue-100 rounded-lg">
            <CheckCircle size={20} className="text-blue-600" />
          </div>
        </div>
        <div className="mt-2">
          <span className={`text-xs font-medium ${
            stats.paymentRate >= 95 ? 'text-green-600' : 
            stats.paymentRate >= 80 ? 'text-yellow-600' : 'text-red-600'
          }`}>
            Meta: 95%
          </span>
        </div>
      </div>
    </div>
  );
}; 