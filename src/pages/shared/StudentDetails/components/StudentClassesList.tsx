import React from 'react';
import { GraduationCap, Clock, Users, Calendar, RefreshCw } from 'lucide-react';
import { formatDate, formatTime, formatDaysOfWeek } from '../../../../utils';

export interface StudentClassResponse {
  id: string;
  name: string;
  description?: string;
  days_of_week: number[];
  start_time: string;
  end_time: string;
  max_students: number;
  belt_requirement: string;
  age_group: string;
  status: string;
  teacher_name: string;
  enrollment_date: string;
  enrollment_status: string;
}

interface StudentClassesListProps {
  classes: StudentClassResponse[];
  onRefresh: () => void;
}

export const StudentClassesList: React.FC<StudentClassesListProps> = ({
  classes,
  onRefresh,
}) => {
  console.log('classes', classes);
  const getStatusColor = (status: string): string => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'inactive':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string): string => {
    switch (status) {
      case 'active':
        return 'Ativo';
      case 'inactive':
        return 'Inativo';
      default:
        return status;
    }
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
            <GraduationCap size={20} className="text-blue-600" />
            Aulas Matriculadas ({classes.length})
          </h3>
          <button
            onClick={onRefresh}
            className="inline-flex items-center gap-2 px-3 py-2 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
          >
            <RefreshCw size={16} />
            Atualizar
          </button>
        </div>
      </div>
      
      {classes.length > 0 ? (
        <div className="divide-y divide-gray-200">
          {classes.map((classData: StudentClassResponse) => (
            <div key={classData.id} className="p-6 hover:bg-gray-50 transition-colors">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h4 className="text-lg font-semibold text-gray-900">
                      {classData.name || 'Nome não disponível'}
                    </h4>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(classData.enrollment_status || classData.status)}`}>
                      {getStatusText(classData.enrollment_status || classData.status)}
                    </span>
                  </div>

                  {classData.description && (
                    <p className="text-gray-600 mb-3">{classData.description}</p>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                    {classData.days_of_week && (
                      <div className="flex items-center gap-2 text-gray-600">
                        <Calendar size={16} />
                        <span>{formatDaysOfWeek(classData.days_of_week)}</span>
                      </div>
                    )}

                    {classData.start_time && classData.end_time && (
                      <div className="flex items-center gap-2 text-gray-600">
                        <Clock size={16} />
                        <span>
                          {formatTime(classData.start_time)} - {formatTime(classData.end_time)}
                        </span>
                      </div>
                    )}

                    {classData.max_students && (
                      <div className="flex items-center gap-2 text-gray-600">
                        <Users size={16} />
                        <span>Máx. {classData.max_students} alunos</span>
                      </div>
                    )}
                  </div>

                  {classData.teacher_name && (
                    <div className="mt-3 pt-3 border-t border-gray-200">
                      <p className="text-sm text-gray-600">
                        <span className="font-medium">Professor:</span> {classData.teacher_name}
                      </p>
                    </div>
                  )}
                </div>

                <div className="text-right text-sm text-gray-500 ml-4">
                  <p className="font-medium">Matriculado em:</p>
                  <p>{formatDate(classData.enrollment_date)}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <GraduationCap size={48} className="mx-auto mb-4 text-gray-300" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhuma aula encontrada</h3>
          <p className="text-gray-500 mb-4">Este aluno ainda não está matriculado em nenhuma aula.</p>
          <button
            onClick={onRefresh}
            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <RefreshCw size={16} />
            Verificar novamente
          </button>
        </div>
      )}
    </div>
  );
}; 