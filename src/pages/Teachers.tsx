import React, { useEffect, useState } from 'react';
import { Plus, Search, Filter, MoreHorizontal, Edit, Trash2, Eye, Award } from 'lucide-react';
import { useTeacherStore, useTeacherSelectors } from '../stores';

const Teachers: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  
  // Store hooks
  const {
    teachers,
    isLoading,
    error,
    pagination,
    fetchTeachers,
    deleteTeacher,
    clearError,
  } = useTeacherStore();
  
  const { hasTeachers, getStatusColor, activeTeachers } = useTeacherSelectors();

  // Load teachers on component mount
  useEffect(() => {
    fetchTeachers();
  }, [fetchTeachers]);

  // Handle search
  const handleSearch = (term: string) => {
    setSearchTerm(term);
    fetchTeachers({ search: term, page: 1 });
  };

  // Handle delete teacher
  const handleDeleteTeacher = async (id: string) => {
    if (window.confirm('Tem certeza que deseja excluir este professor?')) {
      await deleteTeacher(id);
    }
  };

  // Calculate experience years from created date
  const calculateExperience = (createdAt: string) => {
    const created = new Date(createdAt);
    const now = new Date();
    const years = now.getFullYear() - created.getFullYear();
    return years > 0 ? `${years} anos` : 'Menos de 1 ano';
  };

  // Format belt display
  const formatBelt = (belt: string | null | undefined, beltDegree: number | null | undefined) => {
    if (!belt) return 'Sem faixa';
    if (beltDegree) return `${belt} ${beltDegree}º Dan`;
    return belt;
  };

  // Format specialties
  const formatSpecialties = (specialties: string[] | null | undefined) => {
    if (!specialties || specialties.length === 0) return ['Não informado'];
    return specialties;
  };

  // Format status for display
  const formatStatus = (status: string) => {
    switch (status) {
      case 'active':
        return 'Ativo';
      case 'inactive':
        return 'Inativo';
      default:
        return 'Desconhecido';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Professores</h1>
          <p className="text-gray-600 mt-1">Gerenciar professores cadastrados</p>
        </div>
        <button className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 shadow-sm">
          <Plus size={20} />
          Novo Professor
        </button>
      </div>

      {/* Error Display */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <p className="text-red-800">{error}</p>
            <button
              onClick={clearError}
              className="text-red-600 hover:text-red-800"
            >
              ✕
            </button>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1 max-w-md">
          <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input 
            type="text" 
            placeholder="Buscar professores..." 
            value={searchTerm}
            onChange={(e) => handleSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
          />
        </div>
        <button className="inline-flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
          <Filter size={20} />
          Filtros
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total de Professores</p>
              <p className="text-2xl font-bold text-gray-900">{pagination.total}</p>
            </div>
            <div className="p-2 bg-blue-100 rounded-lg">
              <Award size={20} className="text-blue-600" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Professores Ativos</p>
              <p className="text-2xl font-bold text-green-600">{activeTeachers.length}</p>
            </div>
            <div className="p-2 bg-green-100 rounded-lg">
              <Award size={20} className="text-green-600" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Especialidades</p>
              <p className="text-2xl font-bold text-purple-600">
                {Array.from(new Set(teachers.flatMap(t => formatSpecialties(t.specialties)))).length}
              </p>
            </div>
            <div className="p-2 bg-purple-100 rounded-lg">
              <Award size={20} className="text-purple-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="flex items-center gap-3">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
              <p className="text-gray-600">Carregando professores...</p>
            </div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="text-left py-4 px-6 font-semibold text-gray-900">Professor</th>
                  <th className="text-left py-4 px-6 font-semibold text-gray-900">Faixa</th>
                  <th className="text-left py-4 px-6 font-semibold text-gray-900">Especialidades</th>
                  <th className="text-left py-4 px-6 font-semibold text-gray-900">Status</th>
                  <th className="text-left py-4 px-6 font-semibold text-gray-900">Telefone</th>
                  <th className="text-left py-4 px-6 font-semibold text-gray-900">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {hasTeachers ? (
                  teachers.map((teacher) => (
                    <tr key={teacher.id} className="hover:bg-gray-50 transition-colors">
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center text-white font-semibold">
                            🥋
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">{teacher.full_name}</p>
                            <p className="text-sm text-gray-500">{calculateExperience(teacher.createdAt)} de experiência</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                          {formatBelt(teacher.belt, teacher.belt_degree)}
                        </span>
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex flex-wrap gap-1">
                          {formatSpecialties(teacher.specialties).map((specialty, index) => (
                            <span 
                              key={index}
                              className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-blue-100 text-blue-800"
                            >
                              {specialty}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(teacher.status)}`}>
                          {formatStatus(teacher.status)}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-gray-900">{teacher.phone || 'Não informado'}</td>
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-2">
                          <button className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                            <Eye size={16} />
                          </button>
                          <button className="p-1.5 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors">
                            <Edit size={16} />
                          </button>
                          <button 
                            onClick={() => handleDeleteTeacher(teacher.id)}
                            className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          >
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
                          <Award size={24} className="text-gray-400" />
                        </div>
                        <div>
                          <p className="text-gray-900 font-medium">Nenhum professor encontrado</p>
                          <p className="text-gray-500 text-sm">Comece adicionando seu primeiro professor</p>
                        </div>
                        <button className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                          <Plus size={16} />
                          Adicionar Professor
                        </button>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Teachers; 