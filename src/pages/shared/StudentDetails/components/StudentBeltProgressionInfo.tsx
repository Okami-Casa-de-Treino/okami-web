import React, { useEffect } from 'react';
import { Award, Calendar, FileText, Info } from 'lucide-react';
import { Student, BeltProgressResponse } from '../../../../types';
import { useBeltProgressionStore, useBeltProgressionSelectors } from '../../../../stores';
import { formatDate } from '../../../../utils';

interface StudentBeltProgressionInfoProps {
  student: Student;
}

// Type guard to check if response is wrapped
function isBeltProgressResponse(response: unknown): response is BeltProgressResponse {
  return typeof response === 'object' && response !== null && 'success' in response && 'data' in response;
}

export const StudentBeltProgressionInfo: React.FC<StudentBeltProgressionInfoProps> = ({
  student,
}) => {
  const { fetchStudentProgress, clearStudentProgress } = useBeltProgressionStore();
  const { studentProgress, isLoadingProgress, error } = useBeltProgressionSelectors();

  useEffect(() => {
    if (student.id) {
      fetchStudentProgress(student.id);
    }
    
    return () => {
      clearStudentProgress();
    };
  }, [student.id, fetchStudentProgress, clearStudentProgress]);

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

  if (isLoadingProgress) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-yellow-100 rounded-lg">
            <Award size={20} className="text-yellow-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900">Progressão de Faixas</h3>
        </div>
        <div className="animate-pulse space-y-4">
          {[...Array(3)].map((_, index) => (
            <div key={index} className="h-16 bg-gray-200 rounded"></div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-yellow-100 rounded-lg">
            <Award size={20} className="text-yellow-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900">Progressão de Faixas</h3>
        </div>
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-sm text-red-700">Erro ao carregar dados de progressão: {error}</p>
        </div>
      </div>
    );
  }

  if (!studentProgress) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-yellow-100 rounded-lg">
            <Award size={20} className="text-yellow-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900">Progressão de Faixas</h3>
        </div>
        <div className="text-center py-8">
          <Award className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <p className="text-gray-600">Nenhum dado de progressão encontrado</p>
        </div>
      </div>
    );
  }

  // Extract data from the actual API response structure
  // Handle both wrapped ({success: true, data: {...}}) and unwrapped responses
  const responseData = isBeltProgressResponse(studentProgress) ? studentProgress.data : studentProgress;
  const studentData = responseData?.student;
  const progress = responseData?.progress;
  const message = responseData?.message;
  const promotionHistory = responseData?.promotion_history || [];

  // If we don't have the required data, return early
  if (!studentData || !progress) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-yellow-100 rounded-lg">
            <Award size={20} className="text-yellow-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900">Progressão de Faixas</h3>
        </div>
        <div className="text-center py-8">
          <Award className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <p className="text-gray-600">Dados de progressão não disponíveis</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-yellow-100 rounded-lg">
          <Award size={20} className="text-yellow-600" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900">Progressão de Faixas</h3>
      </div>

      <div className="space-y-6">
        {/* Migration Notice */}
        {message && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-start gap-2">
              <Info size={16} className="text-blue-600 mt-0.5 flex-shrink-0" />
              <p className="text-sm text-blue-700">{message}</p>
            </div>
          </div>
        )}

        {/* Current Student Info */}
        <div className="bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-200 rounded-lg p-4">
          <h4 className="font-semibold text-purple-800 mb-3">Informações Atuais</h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-purple-600 mb-1">Faixa Atual</p>
              <div className="flex items-center gap-2">
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getBeltColor(studentData.current_belt)}`}>
                  {studentData.current_belt} {studentData.current_degree}°
                </span>
              </div>
            </div>
            <div>
              <p className="text-sm text-purple-600 mb-1">Status</p>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                studentData.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
              }`}>
                {studentData.status === 'active' ? 'Ativo' : 'Inativo'}
              </span>
            </div>
            <div>
              <p className="text-sm text-purple-600 mb-1">Data de Matrícula</p>
              <p className="text-sm font-medium text-purple-900">
                {formatDate(studentData.enrollment_date)}
              </p>
            </div>
            <div>
              <p className="text-sm text-purple-600 mb-1">Nível Atual</p>
              <p className="text-sm font-medium text-purple-900">
                {progress.current_level}
              </p>
            </div>
          </div>
        </div>

        {/* Current Progress Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <Calendar size={16} className="text-orange-600" />
              <span className="text-sm font-medium text-orange-800">Dias Treinando</span>
            </div>
            <p className="text-lg font-bold text-orange-900">{progress.days_since_enrollment}</p>
          </div>

          {progress.total_promotions !== undefined && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <Award size={16} className="text-green-600" />
                <span className="text-sm font-medium text-green-800">Total de Promoções</span>
              </div>
              <p className="text-lg font-bold text-green-900">{progress.total_promotions}</p>
            </div>
          )}

          {progress.time_at_current_belt !== undefined && (
            <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <Calendar size={16} className="text-purple-600" />
                <span className="text-sm font-medium text-purple-800">Dias na Faixa</span>
              </div>
              <p className="text-lg font-bold text-purple-900">{progress.time_at_current_belt}</p>
            </div>
          )}

          {progress.last_promotion_date && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <Calendar size={16} className="text-yellow-600" />
                <span className="text-sm font-medium text-yellow-800">Última Promoção</span>
              </div>
              <p className="text-sm font-bold text-yellow-900">
                {formatDate(progress.last_promotion_date)}
              </p>
            </div>
          )}
        </div>

        {/* Promotion History */}
        <div>
          <h4 className="text-sm font-medium text-gray-900 mb-3 flex items-center gap-2">
            <FileText size={16} className="text-gray-600" />
            Histórico de Promoções
          </h4>
          
          {promotionHistory && promotionHistory.length > 0 ? (
            <div className="space-y-3">
              {promotionHistory.slice(0, 5).map((promotion) => (
                <div key={promotion.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                      <Award size={12} className="text-white" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getBeltColor(promotion.previous_belt)}`}>
                          {promotion.previous_belt} {promotion.previous_degree}°
                        </span>
                        <span className="text-gray-400">→</span>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getBeltColor(promotion.new_belt)}`}>
                          {promotion.new_belt} {promotion.new_degree}°
                        </span>
                      </div>
                      {promotion.notes && (
                        <p className="text-xs text-gray-600 mt-1">{promotion.notes}</p>
                      )}
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-900">
                      {formatDate(promotion.promotion_date)}
                    </p>
                    <p className="text-xs text-gray-500">
                      por {promotion.promoted_by_user?.username || 'N/A'}
                    </p>
                  </div>
                </div>
              ))}
              
              {promotionHistory.length > 5 && (
                <div className="text-center">
                  <p className="text-sm text-gray-500">
                    e mais {promotionHistory.length - 5} promoções...
                  </p>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-8 bg-gray-50 rounded-lg border border-gray-200">
              <Award className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <p className="text-gray-600 mb-2">
                {message ? 'Histórico de promoções temporariamente indisponível' : 'Nenhuma promoção registrada ainda'}
              </p>
              {message && (
                <p className="text-sm text-gray-500">
                  Os dados estarão disponíveis após a migração do banco de dados
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}; 