import React from 'react';
import { Calendar, Clock, User, BookOpen, RefreshCw, AlertCircle } from 'lucide-react';
import { useStudentClasses } from './hooks/useStudentClasses';
import { getDaysOfWeek } from '../../utils/dateUtils';

const Classes: React.FC = () => {
  const {
    enrolledClasses,
    upcomingClasses,
    pastClasses,
    isLoading,
    error,
    clearError,
    refreshClasses,
    formatTime,
    formatDaysOfWeek,
    getClassStatus,
  } = useStudentClasses();

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Em Andamento':
        return 'bg-green-100 text-green-800';
      case 'Agendada':
        return 'bg-blue-100 text-blue-800';
      case 'Finalizada':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Em Andamento':
        return <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />;
      case 'Agendada':
        return <Clock size={14} className="text-blue-600" />;
      case 'Finalizada':
        return <div className="w-2 h-2 bg-gray-500 rounded-full" />;
      default:
        return <Clock size={14} className="text-gray-600" />;
    }
  };

  if (error) {
    return (
      <div className="min-h-screen overflow-y-auto">
        <div className="space-y-6 p-4 sm:p-6">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <AlertCircle className="text-red-400 mr-3" size={20} />
                <div>
                  <h3 className="text-red-800 font-medium">Erro ao carregar aulas</h3>
                  <p className="text-red-600 text-sm">{error}</p>
                </div>
              </div>
              <button
                onClick={clearError}
                className="text-red-600 hover:text-red-800 text-sm font-medium"
              >
                Tentar novamente
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen overflow-y-auto">
      <div className="space-y-6 p-4 sm:p-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Minhas Aulas</h1>
            <p className="text-gray-600 mt-1">Acompanhe suas aulas e horários</p>
          </div>
          <button
            onClick={refreshClasses}
            disabled={isLoading}
            className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
          >
            <RefreshCw size={20} className={isLoading ? 'animate-spin' : ''} />
            <span className="text-sm sm:text-base">
              {isLoading ? 'Atualizando...' : 'Atualizar'}
            </span>
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total de Aulas</p>
                <p className="text-2xl font-bold text-blue-600">
                  {isLoading ? '...' : enrolledClasses.length}
                </p>
              </div>
              <div className="p-2 bg-blue-100 rounded-lg">
                <BookOpen size={20} className="text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Próximas Aulas</p>
                <p className="text-2xl font-bold text-green-600">
                  {isLoading ? '...' : upcomingClasses.length}
                </p>
              </div>
              <div className="p-2 bg-green-100 rounded-lg">
                <Calendar size={20} className="text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Aulas Concluídas</p>
                <p className="text-2xl font-bold text-purple-600">
                  {isLoading ? '...' : pastClasses.length}
                </p>
              </div>
              <div className="p-2 bg-purple-100 rounded-lg">
                <div className="w-5 h-5 bg-purple-600 rounded-full" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Modalidades</p>
                <p className="text-2xl font-bold text-orange-600">
                  {isLoading ? '...' : new Set(enrolledClasses.map(c => c.class?.name?.split(' ')[0] || '')).size}
                </p>
              </div>
              <div className="p-2 bg-orange-100 rounded-lg">
                <User size={20} className="text-orange-600" />
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          {/* Upcoming Classes */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg sm:text-xl font-semibold text-gray-900 flex items-center gap-2">
                <Calendar className="h-5 w-5 text-green-600" />
                Próximas Aulas
              </h2>
              <span className="text-sm text-gray-500">
                {upcomingClasses.length} aula{upcomingClasses.length !== 1 ? 's' : ''}
              </span>
            </div>
            
            <div className="space-y-4 max-h-96 overflow-y-auto">
              {isLoading ? (
                <div className="flex items-center justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                </div>
              ) : upcomingClasses.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <Calendar size={32} className="mx-auto mb-2 text-gray-400" />
                  <p>Nenhuma aula agendada</p>
                </div>
              ) : (
                upcomingClasses.map((classItem) => (
                  <div key={classItem.id} className="flex items-center gap-4 p-4 rounded-lg border border-gray-100 hover:border-green-200 hover:bg-green-50/50 transition-all">
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 rounded-lg bg-gradient-to-r from-green-500 to-green-600 flex items-center justify-center font-semibold text-white text-sm">
                        {classItem.class ? formatTime(classItem.class.start_time).split(':')[0] : '--'}
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <h4 className="font-semibold text-gray-900 text-sm sm:text-base truncate pr-2">
                          {classItem.class?.name || 'Aula não encontrada'}
                        </h4>
                        <div className="flex items-center gap-1 flex-shrink-0">
                          {getStatusIcon(getClassStatus(classItem))}
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(getClassStatus(classItem))}`}>
                            {getClassStatus(classItem)}
                          </span>
                        </div>
                      </div>
                      <p className="text-xs sm:text-sm text-gray-600 mb-2">
                        {classItem.class?.teacher?.full_name || 'Professor não definido'}
                      </p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 sm:gap-4">
                          <span className="text-xs sm:text-sm font-medium text-gray-900">
                            {classItem.class && classItem.class.days_of_week && classItem.class.days_of_week.length > 0 
                              ? formatDaysOfWeek(classItem.class.days_of_week)
                              : 'Dia não definido'
                            }
                          </span>
                          <span className="text-xs text-gray-500">
                            {classItem.class ? `${formatTime(classItem.class.start_time)} - ${formatTime(classItem.class.end_time)}` : 'Horário não definido'}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Past Classes */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg sm:text-xl font-semibold text-gray-900 flex items-center gap-2">
                <div className="w-5 h-5 bg-purple-600 rounded-full" />
                Aulas Concluídas
              </h2>
              <span className="text-sm text-gray-500">
                {pastClasses.length} aula{pastClasses.length !== 1 ? 's' : ''}
              </span>
            </div>
            
            <div className="space-y-4 max-h-96 overflow-y-auto">
              {isLoading ? (
                <div className="flex items-center justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                </div>
              ) : pastClasses.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <div className="w-8 h-8 bg-purple-600 rounded-full mx-auto mb-2" />
                  <p>Nenhuma aula concluída</p>
                </div>
              ) : (
                pastClasses.slice(0, 10).map((classItem) => (
                  <div key={classItem.id} className="flex items-center gap-4 p-4 rounded-lg border border-gray-100 hover:border-purple-200 hover:bg-purple-50/50 transition-all">
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 rounded-lg bg-gradient-to-r from-purple-500 to-purple-600 flex items-center justify-center font-semibold text-white text-sm">
                        {classItem.class ? formatTime(classItem.class.start_time).split(':')[0] : '--'}
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <h4 className="font-semibold text-gray-900 text-sm sm:text-base truncate pr-2">
                          {classItem.class?.name || 'Aula não encontrada'}
                        </h4>
                        <div className="flex items-center gap-1 flex-shrink-0">
                          {getStatusIcon(getClassStatus(classItem))}
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(getClassStatus(classItem))}`}>
                            {getClassStatus(classItem)}
                          </span>
                        </div>
                      </div>
                      <p className="text-xs sm:text-sm text-gray-600 mb-2">
                        {classItem.class?.teacher?.full_name || 'Professor não definido'}
                      </p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 sm:gap-4">
                          <span className="text-xs sm:text-sm font-medium text-gray-900">
                            {classItem.class && classItem.class.days_of_week && classItem.class.days_of_week.length > 0 
                              ? formatDaysOfWeek(classItem.class.days_of_week)
                              : 'Dia não definido'
                            }
                          </span>
                          <span className="text-xs text-gray-500">
                            {classItem.class ? `${formatTime(classItem.class.start_time)} - ${formatTime(classItem.class.end_time)}` : 'Horário não definido'}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
            
            {pastClasses.length > 10 && (
              <div className="mt-4 pt-4 border-t border-gray-200">
                <button className="w-full text-center text-sm text-purple-600 hover:text-purple-700 font-medium">
                  Ver todas as aulas ({pastClasses.length})
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Class Schedule Summary */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
          <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Clock className="h-5 w-5 text-blue-600" />
            Resumo da Semana
          </h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-7 gap-4">
            {getDaysOfWeek().map((day, index) => {
              const dayClasses = enrolledClasses.filter(classItem => 
                classItem.class && classItem.class.days_of_week && classItem.class.days_of_week.includes(index)
              );
              
              return (
                <div key={day} className="p-4 border border-gray-200 rounded-lg">
                  <h3 className="font-medium text-gray-900 text-sm mb-2">{day}</h3>
                  <div className="space-y-2">
                    {dayClasses.length === 0 ? (
                      <p className="text-xs text-gray-500">Nenhuma aula</p>
                    ) : (
                      dayClasses.map((classItem) => (
                        <div key={classItem.id} className="text-xs">
                          <p className="font-medium text-gray-900 truncate">
                            {classItem.class?.name || 'Aula'}
                          </p>
                          <p className="text-gray-600">
                            {classItem.class ? formatTime(classItem.class.start_time) : '--'}
                          </p>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Classes;
