import React from 'react';
import { Award, User, Calendar, FileText, Eye } from 'lucide-react';
import { BeltPromotion } from '../../../../types';
import { formatDate } from '../../../../utils';

interface BeltProgressionTableProps {
  promotions: BeltPromotion[];
  isLoading: boolean;
  isPromoting: boolean;
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
  onPromoteStudent: (data: any) => Promise<any>;
  onFetchPromotions: () => void;
}

export const BeltProgressionTable: React.FC<BeltProgressionTableProps> = ({
  promotions,
  isLoading,
  pagination,
  onFetchPromotions,
}) => {
  const getBeltColor = (belt: string) => {
    const colors: Record<string, string> = {
      'Branca': 'bg-gray-100 text-gray-800',
      'Azul': 'bg-blue-100 text-blue-800',
      'Roxa': 'bg-purple-100 text-purple-800',
      'Marrom': 'bg-amber-100 text-amber-800',
      'Preta': 'bg-gray-900 text-white',
      'Coral': 'bg-red-100 text-red-800',
      'Vermelha': 'bg-red-600 text-white',
    };
    return colors[belt] || 'bg-gray-100 text-gray-800';
  };

  const getPromotionTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      'regular': 'Regular',
      'skip_degree': 'Pular Grau',
      'honorary': 'Honorária',
      'correction': 'Correção',
    };
    return labels[type] || type;
  };

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="animate-pulse space-y-4">
          {[...Array(5)].map((_, index) => (
            <div key={index} className="h-16 bg-gray-200 rounded"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">Histórico de Promoções</h3>
          <button
            onClick={onFetchPromotions}
            className="text-blue-600 hover:text-blue-800 text-sm font-medium"
          >
            Atualizar
          </button>
        </div>
      </div>

      {promotions.length === 0 ? (
        <div className="p-12 text-center">
          <Award className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhuma promoção encontrada</h3>
          <p className="text-gray-600">Não há promoções registradas no sistema.</p>
        </div>
      ) : (
        <>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Aluno
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Promoção
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tipo
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Data
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Promovido por
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Ações
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {promotions.map((promotion) => (
                  <tr key={promotion.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-semibold">
                          <User size={16} />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">
                            {promotion.student?.full_name || 'Nome não disponível'}
                          </p>
                          <p className="text-sm text-gray-600">
                            {promotion.student?.email || 'Email não disponível'}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getBeltColor(promotion.previous_belt)}`}>
                          {promotion.previous_belt} {promotion.previous_degree}°
                        </span>
                        <span className="text-gray-400">→</span>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getBeltColor(promotion.new_belt)}`}>
                          {promotion.new_belt} {promotion.new_degree}°
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {getPromotionTypeLabel(promotion.promotion_type)}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-sm text-gray-900">
                        <Calendar size={16} className="text-gray-400" />
                        {formatDate(promotion.promotion_date)}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm text-gray-900">
                        {promotion.promoted_by_user?.username || 'Não informado'}
                      </p>
                      <p className="text-xs text-gray-500 capitalize">
                        {promotion.promoted_by_user?.role || ''}
                      </p>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <button
                          className="text-blue-600 hover:text-blue-800 transition-colors"
                          title="Ver detalhes"
                        >
                          <Eye size={16} />
                        </button>
                        {promotion.notes && (
                          <button
                            className="text-gray-600 hover:text-gray-800 transition-colors"
                            title="Ver observações"
                          >
                            <FileText size={16} />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {pagination.totalPages > 1 && (
            <div className="px-6 py-4 border-t border-gray-200">
              <div className="flex items-center justify-between">
                <p className="text-sm text-gray-700">
                  Mostrando <span className="font-medium">{((pagination.page - 1) * pagination.limit) + 1}</span> a{' '}
                  <span className="font-medium">
                    {Math.min(pagination.page * pagination.limit, pagination.total)}
                  </span>{' '}
                  de <span className="font-medium">{pagination.total}</span> resultados
                </p>
                <div className="flex items-center gap-2">
                  <button
                    disabled={pagination.page === 1}
                    className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Anterior
                  </button>
                  <span className="px-3 py-1 text-sm bg-blue-600 text-white rounded">
                    {pagination.page}
                  </span>
                  <button
                    disabled={pagination.page === pagination.totalPages}
                    className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Próxima
                  </button>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}; 