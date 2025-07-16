import React from 'react';
import { Edit, Trash2, Eye, Calendar, DollarSign, Tag } from 'lucide-react';
import { Expense } from '../../../../types';
import { formatDate } from '../../../../utils';

interface ExpenseTableProps {
  expenses: Expense[];
  loading: boolean;
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
  currentPage: number;
  onPageChange: (page: number) => void;
  onEdit: (expense: Expense) => void;
  onDelete: (expenseId: string) => void;
  onView: (expense: Expense) => void;
}

const getCategoryLabel = (category: string) => {
  const labels: Record<string, string> = {
    rent: 'Aluguel',
    utilities: 'Contas',
    equipment: 'Equipamentos',
    maintenance: 'Manutenção',
    marketing: 'Marketing',
    insurance: 'Seguro',
    taxes: 'Impostos',
    salary: 'Salário',
    other: 'Outros'
  };
  return labels[category] || category;
};

const getStatusColor = (status: string) => {
  switch (status) {
    case 'paid':
      return 'bg-green-100 text-green-800';
    case 'pending':
      return 'bg-yellow-100 text-yellow-800';
    case 'cancelled':
      return 'bg-red-100 text-red-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

const getStatusLabel = (status: string) => {
  const labels: Record<string, string> = {
    paid: 'Pago',
    pending: 'Pendente',
    cancelled: 'Cancelado'
  };
  return labels[status] || status;
};


export const ExpenseTable: React.FC<ExpenseTableProps> = ({
  expenses,
  loading,
  pagination,
  currentPage,
  onPageChange,
  onEdit,
  onDelete,
  onView
}) => {
  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow">
        <div className="p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-gray-200 rounded w-1/4"></div>
            <div className="space-y-3">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-12 bg-gray-200 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  console.log(expenses)


  if (expenses.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow">
        <div className="p-6 text-center">
          <DollarSign className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhuma despesa encontrada</h3>
          <p className="text-gray-500">Não há despesas registradas no momento.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Despesa
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Categoria
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Valor
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Criado em
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Vencimento
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Ações
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {expenses.map((expense) => (
              <tr key={expense.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div>
                    <div className="text-sm font-medium text-gray-900">{expense.title}</div>
                    {expense.description && (
                      <div className="text-sm text-gray-500 truncate max-w-xs">
                        {expense.description}
                      </div>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <Tag className="w-4 h-4 text-gray-400 mr-2" />
                    <span className="text-sm text-gray-900">
                      {getCategoryLabel(expense.category)}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">
                    R$ {Number(expense.amount || 0).toFixed(2).replace('.', ',')}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <Calendar className="w-4 h-4 text-gray-400 mr-2" />
                    <span className="text-sm text-gray-900">
                      {formatDate(expense.created_at)}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <Calendar className="w-4 h-4 text-gray-400 mr-2" />
                    <span className="text-sm text-gray-900">
                      {formatDate(expense.due_date)}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(expense.status)}`}>
                    {getStatusLabel(expense.status)}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => onView(expense)}
                      className="text-blue-600 hover:text-blue-900 p-1"
                      title="Visualizar"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => onEdit(expense)}
                      className="text-indigo-600 hover:text-indigo-900 p-1"
                      title="Editar"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => onDelete(expense.id)}
                      className="text-red-600 hover:text-red-900 p-1"
                      title="Excluir"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
          <div className="flex-1 flex justify-between sm:hidden">
            <button
              onClick={() => onPageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Anterior
            </button>
            <button
              onClick={() => onPageChange(currentPage + 1)}
              disabled={currentPage === pagination.totalPages}
              className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Próxima
            </button>
          </div>
          <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-gray-700">
                Mostrando <span className="font-medium">{((currentPage - 1) * pagination.limit) + 1}</span> a{' '}
                <span className="font-medium">
                  {Math.min(currentPage * pagination.limit, pagination.total)}
                </span>{' '}
                de <span className="font-medium">{pagination.total}</span> resultados
              </p>
            </div>
            <div>
              <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                <button
                  onClick={() => onPageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Anterior
                </button>
                {[...Array(pagination.totalPages)].map((_, i) => {
                  const page = i + 1;
                  return (
                    <button
                      key={page}
                      onClick={() => onPageChange(page)}
                      className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                        page === currentPage
                          ? 'z-10 bg-blue-50 border-blue-500 text-blue-600'
                          : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                      }`}
                    >
                      {page}
                    </button>
                  );
                })}
                <button
                  onClick={() => onPageChange(currentPage + 1)}
                  disabled={currentPage === pagination.totalPages}
                  className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Próxima
                </button>
              </nav>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}; 