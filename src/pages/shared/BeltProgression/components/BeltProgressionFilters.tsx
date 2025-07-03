import React from 'react';
import { Search, Filter } from 'lucide-react';

interface BeltProgressionFiltersProps {
  searchTerm: string;
  onSearch: (term: string) => void;
}

export const BeltProgressionFilters: React.FC<BeltProgressionFiltersProps> = ({
  searchTerm,
  onSearch,
}) => {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <div className="flex flex-col sm:flex-row gap-4">
        {/* Search */}
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Buscar por aluno, CPF ou faixa..."
              value={searchTerm}
              onChange={(e) => onSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
            />
          </div>
        </div>

        {/* Filter Button */}
        <button
          type="button"
          className="inline-flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
        >
          <Filter size={20} />
          Filtros
        </button>
      </div>
    </div>
  );
}; 