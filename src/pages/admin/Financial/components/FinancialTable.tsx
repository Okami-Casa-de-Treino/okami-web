import React from 'react';
import { 
  Calendar, 
  CheckCircle, 
  Clock, 
  XCircle, 
  Edit, 
  Trash2, 
  Eye, 
  MoreHorizontal,
  DollarSign,
  Plus
} from 'lucide-react';
import { Payment } from '../../../../types';
import { formatDate } from '../../../../utils/dateUtils';

interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

interface FinancialTableProps {
  payments: Payment[];
  loading: boolean;
  pagination: Pagination;
  currentPage: number;
  onPageChange: (page: number) => void;
  onMarkAsPaid: (payment: Payment) => void;
  onEdit: (paymentId: string, data: Partial<Payment>) => Promise<boolean>;
  onDelete: (paymentId: string) => Promise<boolean>;
}

export const FinancialTable: React.FC<FinancialTableProps> = ({
  payments,
  loading,
  pagination,
  currentPage,
  onPageChange,
  onMarkAsPaid,
  // onEdit,
  onDelete
}) => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(amount);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'overdue':
        return 'bg-red-100 text-red-800';
      case 'cancelled':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'paid':
        return <CheckCircle size={14} className="text-green-600" />;
      case 'pending':
        return <Clock size={14} className="text-yellow-600" />;
      case 'overdue':
        return <XCircle size={14} className="text-red-600" />;
      case 'cancelled':
        return <XCircle size={14} className="text-gray-600" />;
      default:
        return <Clock size={14} className="text-gray-600" />;
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'paid':
        return 'Pago';
      case 'pending':
        return 'Pendente';
      case 'overdue':
        return 'Atrasado';
      case 'cancelled':
        return 'Cancelado';
      default:
        return status;
    }
  };

  const getMethodIcon = (method?: string) => {
    switch (method) {
      case 'pix':
        return '💳';
      case 'card':
        return '💳';
      case 'bank_transfer':
        return '🏦';
      case 'cash':
        return '💵';
      default:
        return '💳';
    }
  };

  const getMethodLabel = (method?: string) => {
    switch (method) {
      case 'pix':
        return 'PIX';
      case 'card':
        return 'Cartão';
      case 'bank_transfer':
        return 'Transferência';
      case 'cash':
        return 'Dinheiro';
      default:
        return method || 'N/A';
    }
  };

  const getDaysOverdue = (dueDate: string) => {
    const today = new Date();
    const due = new Date(dueDate);
    const diffTime = today.getTime() - due.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 0;
  };

  const getStudentInitials = (studentName?: string) => {
    if (!studentName) return '?';
    return studentName
      .split(' ')
      .map(name => name.charAt(0))
      .join('')
      .substring(0, 2)
      .toUpperCase();
  };

  console.log(payments);

  if (loading) {
    return (
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
              {[...Array(5)].map((_, index) => (
                <tr key={index} className="animate-pulse">
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
                      <div className="space-y-1">
                        <div className="h-4 bg-gray-200 rounded w-32"></div>
                        <div className="h-3 bg-gray-200 rounded w-24"></div>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <div className="h-4 bg-gray-200 rounded w-20"></div>
                  </td>
                  <td className="py-4 px-6">
                    <div className="h-4 bg-gray-200 rounded w-24"></div>
                  </td>
                  <td className="py-4 px-6">
                    <div className="h-6 bg-gray-200 rounded w-16"></div>
                  </td>
                  <td className="py-4 px-6">
                    <div className="h-4 bg-gray-200 rounded w-16"></div>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex gap-2">
                      <div className="w-8 h-8 bg-gray-200 rounded"></div>
                      <div className="w-8 h-8 bg-gray-200 rounded"></div>
                      <div className="w-8 h-8 bg-gray-200 rounded"></div>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  return (
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
                      <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                        {getStudentInitials(payment.student?.full_name)}
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
                  </td>
                  <td className="py-4 px-6">
                    <p className="font-semibold text-gray-900">{formatCurrency(payment.amount)}</p>
                    {payment.due_date && (
                      <p className="text-sm text-gray-500">Pago em {formatDate(payment.due_date)}</p>
                    )}
                    {payment.discount > 0 && (
                      <p className="text-sm text-green-600">Desconto: {formatCurrency(payment.discount)}</p>
                    )}
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-2">
                      <Calendar size={16} className="text-gray-400" />
                      <span className="text-gray-900">{formatDate(payment.due_date)}</span>
                    </div>
                    {payment.status === 'overdue' && (
                      <p className="text-xs text-red-600 mt-1">
                        {getDaysOverdue(payment.due_date)} dias em atraso
                      </p>
                    )}
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-2">
                      {getStatusIcon(payment.status)}
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(payment.status)}`}>
                        {getStatusLabel(payment.status)}
                      </span>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-2">
                      <span className="text-lg">{getMethodIcon(payment.payment_method)}</span>
                      <span className="text-sm text-gray-900">{getMethodLabel(payment.payment_method)}</span>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-2">
                      <button 
                        className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="Visualizar detalhes"
                      >
                        <Eye size={16} />
                      </button>
                      <button 
                        className="p-1.5 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                        title="Editar pagamento"
                        onClick={() => {/* TODO: Handle edit */}}
                      >
                        <Edit size={16} />
                      </button>
                      {(payment.status === 'pending' || payment.status === 'overdue') && (
                        <button 
                          className="p-1.5 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                          title="Marcar como pago"
                          onClick={() => onMarkAsPaid(payment)}
                        >
                          <CheckCircle size={16} />
                        </button>
                      )}
                      <button 
                        className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Excluir pagamento"
                        onClick={() => {
                          if (window.confirm('Tem certeza que deseja excluir este pagamento?')) {
                            onDelete(payment.id);
                          }
                        }}
                      >
                        <Trash2 size={16} />
                      </button>
                      <button 
                        className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
                        title="Mais opções"
                      >
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
      
      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
          <div className="text-sm text-gray-500">
            Mostrando {((currentPage - 1) * pagination.limit) + 1} a {Math.min(currentPage * pagination.limit, pagination.total)} de {pagination.total} pagamentos
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => onPageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-3 py-1 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Anterior
            </button>
            {[...Array(pagination.totalPages)].map((_, index) => {
              const page = index + 1;
              return (
                <button
                  key={page}
                  onClick={() => onPageChange(page)}
                  className={`px-3 py-1 text-sm border rounded-lg ${
                    currentPage === page
                      ? 'bg-blue-600 text-white border-blue-600'
                      : 'border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  {page}
                </button>
              );
            })}
            <button
              onClick={() => onPageChange(currentPage + 1)}
              disabled={currentPage === pagination.totalPages}
              className="px-3 py-1 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Próxima
            </button>
          </div>
        </div>
      )}
    </div>
  );
}; 