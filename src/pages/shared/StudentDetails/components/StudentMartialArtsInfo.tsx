import React from 'react';
import { Shield, Award, Calendar } from 'lucide-react';
import { Student } from '../../../../types';
import { formatDate } from '../../../../utils';

interface StudentMartialArtsInfoProps {
  student: Student;
  getBeltDisplay: (belt?: string, degree?: number) => string;
}

export const StudentMartialArtsInfo: React.FC<StudentMartialArtsInfoProps> = ({
  student,
  getBeltDisplay,
}) => {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-yellow-100 rounded-lg">
          <Shield size={20} className="text-yellow-600" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900">Informações de Treino</h3>
      </div>

      <div className="space-y-6">
        {/* Belt Information */}
        <div>
          <h4 className="text-sm font-medium text-gray-900 mb-3 flex items-center gap-2">
            <Award size={16} className="text-yellow-600" />
            Graduação Atual
          </h4>
          
          <div className="bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200 rounded-lg p-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">
                  Faixa
                </label>
                <p className="text-lg font-semibold text-gray-900">
                  {getBeltDisplay(student.belt, student.belt_degree)}
                </p>
              </div>

              {student.belt && student.belt_degree > 0 && (
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">
                    Grau
                  </label>
                  <p className="text-lg font-semibold text-gray-900">
                    {student.belt_degree}º
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Training Timeline */}
        <div>
          <h4 className="text-sm font-medium text-gray-900 mb-3 flex items-center gap-2">
            <Calendar size={16} className="text-blue-600" />
            Histórico de Treino
          </h4>
          
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg border border-blue-200">
              <div>
                <p className="font-medium text-blue-900">Data de Matrícula</p>
                <p className="text-sm text-blue-700">Início da jornada no Jiu-Jitsu</p>
              </div>
              <div className="text-right">
                <p className="font-semibold text-blue-900">{formatDate(student.enrollment_date)}</p>
                <p className="text-sm text-blue-700">
                  {Math.floor((new Date().getTime() - new Date(student.enrollment_date).getTime()) / (1000 * 60 * 60 * 24))} dias
                </p>
              </div>
            </div>

            {/* TODO: Add belt progression history when available */}
            {/* This would show when the student received each belt */}
          </div>
        </div>

        {/* Training Stats */}
        <div>
          <h4 className="text-sm font-medium text-gray-900 mb-3">Estatísticas de Treino</h4>
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-3 bg-gray-50 rounded-lg">
              <p className="text-2xl font-bold text-gray-900">-</p>
              <p className="text-sm text-gray-600">Aulas Frequentadas</p>
            </div>
            <div className="text-center p-3 bg-gray-50 rounded-lg">
              <p className="text-2xl font-bold text-gray-900">-</p>
              <p className="text-sm text-gray-600">Check-ins este Mês</p>
            </div>
          </div>
          <p className="text-xs text-gray-500 mt-2 text-center">
            * Estatísticas detalhadas disponíveis nas abas específicas
          </p>
        </div>

        {/* Belt System Info */}
        <div className="pt-4 border-t border-gray-200">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h5 className="font-semibold text-blue-900 mb-2">Sistema de Faixas BJJ</h5>
            <div className="text-sm text-blue-800">
              <p className="mb-2">Progressão tradicional do Jiu-Jitsu brasileiro:</p>
              <div className="flex flex-wrap gap-2">
                {['Branca', 'Azul', 'Roxa', 'Marrom', 'Preta'].map((belt) => (
                  <span 
                    key={belt} 
                    className={`px-2 py-1 rounded text-xs ${
                      student.belt === belt 
                        ? 'bg-blue-600 text-white font-semibold' 
                        : 'bg-blue-100 text-blue-800'
                    }`}
                  >
                    {belt}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}; 