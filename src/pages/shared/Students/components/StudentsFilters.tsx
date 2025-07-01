import React from 'react';
import { Search, Filter } from 'lucide-react';

interface StudentsFiltersProps {
  searchTerm: string;
  onSearch: (term: string) => void;
}

export const StudentsFilters: React.FC<StudentsFiltersProps> = ({ searchTerm, onSearch }) => {
  return (
    <div className="flex flex-col sm:flex-row gap-4">
      <div className="relative flex-1 max-w-md">
        <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
        <input 
          type="text" 
          placeholder="Buscar alunos..." 
          value={searchTerm}
          onChange={(e) => onSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
        />
      </div>
      <button className="inline-flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
        <Filter size={20} />
        Filtros
      </button>
    </div>
  );
}; 