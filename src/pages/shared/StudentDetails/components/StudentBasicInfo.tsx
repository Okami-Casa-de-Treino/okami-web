import React from 'react';
import { User, Calendar, DollarSign, FileText, Clock } from 'lucide-react';
import { Student } from '../../../../types';
import { formatDate, calculateAge } from '../../../../utils';

interface StudentBasicInfoProps {
  student: Student;
  getStatusColor: (status: string) => string;
}

export const StudentBasicInfo: React.FC<StudentBasicInfoProps> = ({
  student,
  getStatusColor,
}) => {
  const getStatusText = (status: string): string => {
    switch (status) {
      case 'active':
        return 'Ativo';
      case 'inactive':
        return 'Inativo';
      case 'suspended':
        return 'Suspenso';
      default:
        return status;
    }
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-blue-100 rounded-lg">
          <User size={20} className="text-blue-600" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900">Informações Básicas</h3>
      </div>

      <div className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-500 mb-1">
              Nome Completo
            </label>
            <p className="text-gray-900 font-medium">{student.full_name}</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-500 mb-1">
              Status
            </label>
            <span className={`inline-flex px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(student.status)}`}>
              {getStatusText(student.status)}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-500 mb-1">
              <Calendar size={14} className="inline mr-1" />
              Data de Nascimento
            </label>
            <p className="text-gray-900">
              {formatDate(student.birth_date)} ({calculateAge(student.birth_date)} anos)
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-500 mb-1">
              <Clock size={14} className="inline mr-1" />
              Data de Matrícula
            </label>
            <p className="text-gray-900">{formatDate(student.enrollment_date)}</p>
          </div>
        </div>

        {(student.cpf || student.rg) && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {student.cpf && (
              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">
                  <FileText size={14} className="inline mr-1" />
                  CPF
                </label>
                <p className="text-gray-900 font-mono">{student.cpf}</p>
              </div>
            )}

            {student.rg && (
              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">
                  <FileText size={14} className="inline mr-1" />
                  RG
                </label>
                <p className="text-gray-900 font-mono">{student.rg}</p>
              </div>
            )}
          </div>
        )}

        {student.monthly_fee && (
          <div>
            <label className="block text-sm font-medium text-gray-500 mb-1">
              <DollarSign size={14} className="inline mr-1" />
              Mensalidade
            </label>
            <p className="text-gray-900 font-semibold">
              R$ {student.monthly_fee.toFixed(2).replace('.', ',')}
            </p>
          </div>
        )}

        {student.address && (
          <div>
            <label className="block text-sm font-medium text-gray-500 mb-1">
              Endereço
            </label>
            <p className="text-gray-900">{student.address}</p>
          </div>
        )}

        <div className="pt-4 border-t border-gray-200">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-gray-500">
            <div>
              <span className="font-medium">Criado em:</span> {formatDate(student.created_at)}
            </div>
            <div>
              <span className="font-medium">Atualizado em:</span> {formatDate(student.updated_at)}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}; 