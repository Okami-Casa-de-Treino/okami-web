import React from 'react';
import { Plus, Search, Filter, DollarSign, AlertTriangle, MoreHorizontal, Edit, Trash2, Eye, Calendar, CheckCircle, Clock, XCircle } from 'lucide-react';

const Financial: React.FC = () => {
  // Mock data for demonstration
  const payments = [
    {
      id: '1',
      studentName: 'João Silva',
      studentId: 'ALU001',
      amount: 200.00,
      dueDate: '2024-01-15',
      paymentDate: '2024-01-12',
      status: 'Pago',
      method: 'PIX',
      description: 'Mensalidade Janeiro 2024',
      avatar: '👨'
    },
    {
      id: '2',
      studentName: 'Maria Santos',
      studentId: 'ALU002',
      amount: 200.00,
      dueDate: '2024-01-15',
      paymentDate: null,
      status: 'Pendente',
      method: 'Cartão',
      description: 'Mensalidade Janeiro 2024',
      avatar: '👩'
    },
    {
      id: '3',
      studentName: 'Pedro Lima',
      studentId: 'ALU003',
      amount: 150.00,
      dueDate: '2024-01-10',
      paymentDate: null,
      status: 'Atrasado',
      method: 'Boleto',
      description: 'Mensalidade Janeiro 2024',
      avatar: '👦'
    },
    {
      id: '4',
      studentName: 'Ana Costa',
      studentId: 'ALU004',
      amount: 200.00,
      dueDate: '2024-01-20',
      paymentDate: '2024-01-18',
      status: 'Pago',
      method: 'Débito Automático',
      description: 'Mensalidade Janeiro 2024',
      avatar: '👩'
    },
    {
      id: '5',
      studentName: 'Carlos Oliveira',
      studentId: 'ALU005',
      amount: 180.00,
      dueDate: '2024-01-25',
      paymentDate: null,
      status: 'Pendente',
      method: 'PIX',
      description: 'Mensalidade Janeiro 2024',
      avatar: '👨'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Pago':
        return 'bg-green-100 text-green-800';
      case 'Pendente':
        return 'bg-yellow-100 text-yellow-800';
      case 'Atrasado':
        return 'bg-red-100 text-red-800';
      case 'Cancelado':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Pago':
        return <CheckCircle size={14} className="text-green-600" />;
      case 'Pendente':
        return <Clock size={14} className="text-yellow-600" />;
      case 'Atrasado':
        return <XCircle size={14} className="text-red-600" />;
      case 'Cancelado':
        return <XCircle size={14} className="text-gray-600" />;
      default:
        return <Clock size={14} className="text-gray-600" />;
    }
  };

  const getMethodIcon = (method: string) => {
    switch (method) {
      case 'PIX':
        return '💳';
      case 'Cartão':
        return '💳';
      case 'Débito Automático':
        return '🏦';
      case 'Boleto':
        return '📄';
      case 'Dinheiro':
        return '💵';
      default:
        return '💳';
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  const totalRevenue = payments
    .filter(p => p.status === 'Pago')
    .reduce((sum, p) => sum + p.amount, 0);

  const pendingPayments = payments.filter(p => p.status === 'Pendente' || p.status === 'Atrasado');
  const overduePayments = payments.filter(p => p.status === 'Atrasado');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Financeiro</h1>
          <p className="text-gray-600 mt-1">Gerenciar pagamentos e mensalidades</p>
        </div>
        <div className="flex gap-2">
          <button className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-red-300 text-red-700 rounded-lg hover:bg-red-50 transition-colors">
            <AlertTriangle size={20} />
            Pendências ({pendingPayments.length})
          </button>
          <button className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 shadow-sm">
            <Plus size={20} />
            Nova Cobrança
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1 max-w-md">
          <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input 
            type="text" 
            placeholder="Buscar pagamentos..." 
            className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
          />
        </div>
        <button className="inline-flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
          <Filter size={20} />
          Filtros
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Receita Mensal</p>
              <p className="text-2xl font-bold text-green-600">{formatCurrency(totalRevenue)}</p>
            </div>
            <div className="p-2 bg-green-100 rounded-lg">
              <DollarSign size={20} className="text-green-600" />
            </div>
          </div>
          <div className="mt-2">
            <span className="text-xs text-green-600 font-medium">+15% vs mês anterior</span>
          </div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Pagamentos Pendentes</p>
              <p className="text-2xl font-bold text-yellow-600">{pendingPayments.length}</p>
            </div>
            <div className="p-2 bg-yellow-100 rounded-lg">
              <Clock size={20} className="text-yellow-600" />
            </div>
          </div>
          <div className="mt-2">
            <span className="text-xs text-gray-500">
              {formatCurrency(pendingPayments.reduce((sum, p) => sum + p.amount, 0))} em aberto
            </span>
          </div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Pagamentos em Atraso</p>
              <p className="text-2xl font-bold text-red-600">{overduePayments.length}</p>
            </div>
            <div className="p-2 bg-red-100 rounded-lg">
              <AlertTriangle size={20} className="text-red-600" />
            </div>
          </div>
          <div className="mt-2">
            <span className="text-xs text-red-600 font-medium">Requer atenção</span>
          </div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Taxa de Pagamento</p>
              <p className="text-2xl font-bold text-blue-600">
                {Math.round((payments.filter(p => p.status === 'Pago').length / payments.length) * 100)}%
              </p>
            </div>
            <div className="p-2 bg-blue-100 rounded-lg">
              <CheckCircle size={20} className="text-blue-600" />
            </div>
          </div>
          <div className="mt-2">
            <span className="text-xs text-blue-600 font-medium">Meta: 95%</span>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left py-4 px-6 font-semibold text-gray-900">Aluno</th>
                <th className="text-left py-4 px-6 font-semibold text-gray-900">Valor</th>
                <th className="text-left py-4 px-6 font-semibold text-gray-900">Vencimento</th>
                <th className="text-left py-4 px-6 font-semibold text-gray-900">Status</th>
                <th className="text-left py-4 px-6 font-semibold text-gray-900">Método</th>
                <th className="text-left py-4 px-6 font-semibold text-gray-900">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {payments.length > 0 ? (
                payments.map((payment) => (
                  <tr key={payment.id} className="hover:bg-gray-50 transition-colors">
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full flex items-center justify-center text-white font-semibold">
                          {payment.avatar}
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{payment.studentName}</p>
                          <p className="text-sm text-gray-500">{payment.description}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <p className="font-semibold text-gray-900">{formatCurrency(payment.amount)}</p>
                      {payment.paymentDate && (
                        <p className="text-sm text-gray-500">Pago em {formatDate(payment.paymentDate)}</p>
                      )}
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-2">
                        <Calendar size={16} className="text-gray-400" />
                        <span className="text-gray-900">{formatDate(payment.dueDate)}</span>
                      </div>
                      {payment.status === 'Atrasado' && (
                        <p className="text-xs text-red-600 mt-1">
                          {Math.ceil((new Date().getTime() - new Date(payment.dueDate).getTime()) / (1000 * 3600 * 24))} dias em atraso
                        </p>
                      )}
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-2">
                        {getStatusIcon(payment.status)}
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(payment.status)}`}>
                          {payment.status}
                        </span>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-2">
                        <span className="text-lg">{getMethodIcon(payment.method)}</span>
                        <span className="text-sm text-gray-900">{payment.method}</span>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-2">
                        <button className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                          <Eye size={16} />
                        </button>
                        <button className="p-1.5 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors">
                          <Edit size={16} />
                        </button>
                        {payment.status === 'Pendente' && (
                          <button className="p-1.5 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors">
                            <CheckCircle size={16} />
                          </button>
                        )}
                        <button className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                          <Trash2 size={16} />
                        </button>
                        <button className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-lg transition-colors">
                          <MoreHorizontal size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="py-12 text-center">
                    <div className="flex flex-col items-center gap-3">
                      <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                        <DollarSign size={24} className="text-gray-400" />
                      </div>
                      <div>
                        <p className="text-gray-900 font-medium">Nenhum pagamento encontrado</p>
                        <p className="text-gray-500 text-sm">Comece criando sua primeira cobrança</p>
                      </div>
                      <button className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                        <Plus size={16} />
                        Nova Cobrança
                      </button>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Financial; 