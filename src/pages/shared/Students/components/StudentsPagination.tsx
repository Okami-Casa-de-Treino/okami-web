import React from 'react';

interface StudentsPaginationProps {
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
  isLoading: boolean;
  onFetchStudents: (params?: { page: number }) => void;
}

export const StudentsPagination: React.FC<StudentsPaginationProps> = ({
  pagination,
  isLoading,
  onFetchStudents
}) => {
  if (pagination.totalPages <= 1) {
    return null;
  }

  console.log('pagination', pagination);

  // Calculate start and end items with proper validation
  const startItem = Math.max(1, ((pagination.page - 1) * pagination.limit) + 1);
  const endItem = Math.min(pagination.page * pagination.limit, pagination.total || 0);
  
  // Validate that we have valid numbers
  const isValidStart = !isNaN(startItem) && isFinite(startItem);
  const isValidEnd = !isNaN(endItem) && isFinite(endItem);
  const isValidTotal = pagination.total !== undefined && !isNaN(pagination.total) && isFinite(pagination.total);

  return (
    <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
      <div className="text-sm text-gray-700">
        {isValidStart && isValidEnd && isValidTotal ? (
          `Mostrando ${startItem} a ${endItem} de ${pagination.total} resultados`
        ) : isValidTotal ? (
          `${pagination.total} resultados`
        ) : (
          'Resultados'
        )}
      </div>
      <div className="flex items-center gap-2">
        <button
          onClick={() => onFetchStudents({ page: pagination.page - 1 })}
          disabled={pagination.page === 1 || isLoading}
          className="px-3 py-2 text-sm bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Anterior
        </button>
        <span className="px-3 py-2 text-sm text-gray-700">
          Página {pagination.page} de {pagination.totalPages}
        </span>
        <button
          onClick={() => onFetchStudents({ page: pagination.page + 1 })}
          disabled={pagination.page === pagination.totalPages || isLoading}
          className="px-3 py-2 text-sm bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Próxima
        </button>
      </div>
    </div>
  );
}; 