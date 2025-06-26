import React from 'react';
import { 
  ArrowLeft, 
  Edit, 
  Trash2, 
  Users, 
  Calendar, 
  Clock, 
  User, 
  GraduationCap,
  AlertCircle,
  CheckCircle,
  X
} from 'lucide-react';
import { useClassDetails } from './hooks/useClassDetails';

const ClassDetails: React.FC = () => {
  const {
    // Data
    classData,
    students,
    checkins,
    
    // State
    activeTab,
    showDeleteModal,
    isLoading,
    isDeleting,
    error,
    
    // Actions
    setActiveTab,
    handleEdit,
    handleDelete,
    confirmDelete,
    cancelDelete,
    dismissError,
    
    // Helpers
    formatDaysOfWeek,
    formatTime,
    getDuration,
    getStatusColor,
    getStudentsFillPercentage,
  } = useClassDetails();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!classData) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Aula não encontrada</h1>
            <button
              onClick={() => window.history.back()}
              className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800"
            >
              <ArrowLeft size={20} />
              Voltar
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => window.history.back()}
            className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors mb-4"
          >
            <ArrowLeft size={20} />
            Voltar para Aulas
          </button>
          
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{classData.name}</h1>
              <p className="text-gray-600 mt-1">
                {formatDaysOfWeek(classData.days_of_week)} • {formatTime(classData.start_time)} às {formatTime(classData.end_time)}
              </p>
            </div>
            
            <div className="flex gap-2">
              <button
                onClick={handleEdit}
                className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Edit size={16} />
                Editar
              </button>
              <button
                onClick={confirmDelete}
                disabled={isDeleting}
                className="inline-flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
              >
                <Trash2 size={16} />
                {isDeleting ? 'Excluindo...' : 'Excluir'}
              </button>
            </div>
          </div>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <AlertCircle className="text-red-600" size={20} />
                <div>
                  <h3 className="text-red-800 font-medium">Erro</h3>
                  <p className="text-red-600 text-sm">{error}</p>
                </div>
              </div>
              <button
                onClick={dismissError}
                className="text-red-600 hover:text-red-800 transition-colors"
              >
                <X size={20} />
              </button>
            </div>
          </div>
        )}

        {/* Tabs */}
        <div className="mb-6">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              <button
                onClick={() => setActiveTab('details')}
                className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === 'details'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Detalhes
              </button>
              <button
                onClick={() => setActiveTab('students')}
                className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === 'students'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Alunos ({students.length})
              </button>
              <button
                onClick={() => setActiveTab('checkins')}
                className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === 'checkins'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Presenças ({checkins.length})
              </button>
            </nav>
          </div>
        </div>

        {/* Tab Content */}
        <div className="mb-8">
          {activeTab === 'details' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Basic Information */}
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Informações Básicas</h3>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-gray-500">Nome da Aula</label>
                    <p className="text-gray-900 font-medium">{classData.name}</p>
                  </div>
                  
                  {classData.description && (
                    <div>
                      <label className="text-sm font-medium text-gray-500">Descrição</label>
                      <p className="text-gray-900">{classData.description}</p>
                    </div>
                  )}
                  
                  <div>
                    <label className="text-sm font-medium text-gray-500">Professor</label>
                    <div className="flex items-center gap-2 mt-1">
                      <User size={16} className="text-gray-400" />
                      <p className="text-gray-900">
                        {classData.teacher?.full_name || 'Não definido'}
                        {classData.teacher?.belt && (
                          <span className="ml-2 text-gray-500 text-sm">
                            Faixa {classData.teacher.belt}
                            {classData.teacher.belt_degree && ` ${classData.teacher.belt_degree}º Dan`}
                          </span>
                        )}
                      </p>
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-500">Status</label>
                    <div className="mt-1">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(classData.status)}`}>
                        {classData.status === 'active' ? 'Ativa' : 'Inativa'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Schedule Information */}
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Horários e Capacidade</h3>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-gray-500">Dias da Semana</label>
                    <div className="flex items-center gap-2 mt-1">
                      <Calendar size={16} className="text-gray-400" />
                      <p className="text-gray-900">{formatDaysOfWeek(classData.days_of_week)}</p>
                    </div>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium text-gray-500">Horário</label>
                    <div className="flex items-center gap-2 mt-1">
                      <Clock size={16} className="text-gray-400" />
                      <p className="text-gray-900">
                        {formatTime(classData.start_time)} às {formatTime(classData.end_time)}
                        <span className="ml-2 text-gray-500 text-sm">
                          ({getDuration(classData.start_time, classData.end_time)})
                        </span>
                      </p>
                    </div>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium text-gray-500">Capacidade de Alunos</label>
                    <div className="mt-1">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-gray-900">
                          {students.length}/{classData.max_students}
                        </span>
                        <span className="text-xs text-gray-500">
                          {getStudentsFillPercentage(students.length, classData.max_students)}%
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${getStudentsFillPercentage(students.length, classData.max_students)}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Requirements */}
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Requisitos</h3>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-gray-500">Requisito de Faixa</label>
                    <div className="flex items-center gap-2 mt-1">
                      <GraduationCap size={16} className="text-gray-400" />
                      <p className="text-gray-900">{classData.belt_requirement || 'Todas as faixas'}</p>
                    </div>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium text-gray-500">Faixa Etária</label>
                    <div className="flex items-center gap-2 mt-1">
                      <Users size={16} className="text-gray-400" />
                      <p className="text-gray-900">{classData.age_group || 'Todas as idades'}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Metadata */}
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Informações do Sistema</h3>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-gray-500">Data de Criação</label>
                    <p className="text-gray-900">{new Date(classData.created_at).toLocaleDateString('pt-BR')}</p>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium text-gray-500">Última Atualização</label>
                    <p className="text-gray-900">{new Date(classData.updated_at).toLocaleDateString('pt-BR')}</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'students' && (
            <div className="bg-white rounded-lg border border-gray-200">
              <div className="p-6 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">
                  Alunos Matriculados ({students.length})
                </h3>
              </div>
              
              {students.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50 border-b border-gray-200">
                      <tr>
                        <th className="text-left py-3 px-6 font-semibold text-gray-900">Aluno</th>
                        <th className="text-left py-3 px-6 font-semibold text-gray-900">Faixa</th>
                        <th className="text-left py-3 px-6 font-semibold text-gray-900">Data de Matrícula</th>
                        <th className="text-left py-3 px-6 font-semibold text-gray-900">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {students.map((student) => (
                        <tr key={student.id} className="hover:bg-gray-50">
                          <td className="py-4 px-6">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                                <User size={16} className="text-blue-600" />
                              </div>
                              <div>
                                <p className="font-medium text-gray-900">{student.full_name}</p>
                                <p className="text-sm text-gray-500">{student.email}</p>
                              </div>
                            </div>
                          </td>
                          <td className="py-4 px-6">
                            <span className="text-gray-900">
                              {student.belt || 'Não definida'}
                              {student.belt_degree && ` ${student.belt_degree}º`}
                            </span>
                          </td>
                          <td className="py-4 px-6">
                            <span className="text-gray-900">
                              {new Date(student.enrollment_date).toLocaleDateString('pt-BR')}
                            </span>
                          </td>
                          <td className="py-4 px-6">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              student.status === 'active' 
                                ? 'bg-green-100 text-green-800' 
                                : 'bg-gray-100 text-gray-800'
                            }`}>
                              {student.status === 'active' ? 'Ativo' : 'Inativo'}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="p-12 text-center">
                  <Users size={48} className="mx-auto text-gray-400 mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhum aluno matriculado</h3>
                  <p className="text-gray-500">Esta aula ainda não possui alunos matriculados.</p>
                </div>
              )}
            </div>
          )}

          {activeTab === 'checkins' && (
            <div className="bg-white rounded-lg border border-gray-200">
              <div className="p-6 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">
                  Histórico de Presenças ({checkins.length})
                </h3>
              </div>
              
              {checkins.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50 border-b border-gray-200">
                      <tr>
                        <th className="text-left py-3 px-6 font-semibold text-gray-900">Aluno</th>
                        <th className="text-left py-3 px-6 font-semibold text-gray-900">Data</th>
                        <th className="text-left py-3 px-6 font-semibold text-gray-900">Horário</th>
                        <th className="text-left py-3 px-6 font-semibold text-gray-900">Método</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {checkins.map((checkin) => (
                        <tr key={checkin.id} className="hover:bg-gray-50">
                          <td className="py-4 px-6">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                                <CheckCircle size={16} className="text-green-600" />
                              </div>
                              <span className="font-medium text-gray-900">
                                {checkin.student?.full_name || 'Aluno não encontrado'}
                              </span>
                            </div>
                          </td>
                          <td className="py-4 px-6">
                            <span className="text-gray-900">
                              {new Date(checkin.checkinDate).toLocaleDateString('pt-BR')}
                            </span>
                          </td>
                          <td className="py-4 px-6">
                            <span className="text-gray-900">{checkin.checkinTime}</span>
                          </td>
                          <td className="py-4 px-6">
                            <span className="capitalize text-gray-900">{checkin.method}</span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="p-12 text-center">
                  <CheckCircle size={48} className="mx-auto text-gray-400 mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhuma presença registrada</h3>
                  <p className="text-gray-500">Esta aula ainda não possui presenças registradas.</p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Delete Confirmation Modal */}
        {showDeleteModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                  <Trash2 size={20} className="text-red-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Excluir Aula</h3>
                  <p className="text-gray-600">Esta ação não pode ser desfeita.</p>
                </div>
              </div>
              
              <p className="text-gray-700 mb-6">
                Tem certeza de que deseja excluir a aula <strong>{classData.name}</strong>?
                {students.length > 0 && (
                  <span className="text-red-600 block mt-2">
                    Atenção: Esta aula possui {students.length} aluno(s) matriculado(s).
                  </span>
                )}
              </p>
              
              <div className="flex gap-3 justify-end">
                <button
                  onClick={cancelDelete}
                  className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleDelete}
                  disabled={isDeleting}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
                >
                  {isDeleting ? 'Excluindo...' : 'Excluir'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ClassDetails; 