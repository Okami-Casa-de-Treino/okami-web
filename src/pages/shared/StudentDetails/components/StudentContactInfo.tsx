import React from 'react';
import { Phone, Mail, AlertTriangle, Heart } from 'lucide-react';
import { Student } from '../../../../types';

interface StudentContactInfoProps {
  student: Student;
}

export const StudentContactInfo: React.FC<StudentContactInfoProps> = ({ student }) => {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-green-100 rounded-lg">
          <Phone size={20} className="text-green-600" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900">Informações de Contato</h3>
      </div>

      <div className="space-y-6">
        {/* Primary Contact */}
        <div>
          <h4 className="text-sm font-medium text-gray-900 mb-3">Contato Principal</h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {student.email && (
              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">
                  <Mail size={14} className="inline mr-1" />
                  Email
                </label>
                <a 
                  href={`mailto:${student.email}`}
                  className="text-blue-600 hover:text-blue-800 break-all"
                >
                  {student.email}
                </a>
              </div>
            )}

            {student.phone && (
              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">
                  <Phone size={14} className="inline mr-1" />
                  Telefone
                </label>
                <a 
                  href={`tel:${student.phone}`}
                  className="text-blue-600 hover:text-blue-800"
                >
                  {student.phone}
                </a>
              </div>
            )}
          </div>
        </div>

        {/* Emergency Contact */}
        {(student.emergency_contact_name || student.emergency_contact_phone) && (
          <div className="pt-4 border-t border-gray-200">
            <h4 className="text-sm font-medium text-gray-900 mb-3 flex items-center gap-2">
              <AlertTriangle size={16} className="text-red-500" />
              Contato de Emergência
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {student.emergency_contact_name && (
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">
                    Nome
                  </label>
                  <p className="text-gray-900">{student.emergency_contact_name}</p>
                </div>
              )}

              {student.emergency_contact_phone && (
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">
                    Telefone
                  </label>
                  <a 
                    href={`tel:${student.emergency_contact_phone}`}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    {student.emergency_contact_phone}
                  </a>
                </div>
              )}

              {student.emergency_contact_relationship && (
                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-gray-500 mb-1">
                    Parentesco/Relação
                  </label>
                  <p className="text-gray-900">{student.emergency_contact_relationship}</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Medical Information */}
        {student.medical_observations && (
          <div className="pt-4 border-t border-gray-200">
            <h4 className="text-sm font-medium text-gray-900 mb-3 flex items-center gap-2">
              <Heart size={16} className="text-red-500" />
              Observações Médicas
            </h4>
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-red-800 text-sm whitespace-pre-wrap">
                {student.medical_observations}
              </p>
            </div>
          </div>
        )}

        {/* Empty State */}
        {!student.email && !student.phone && !student.emergency_contact_name && !student.medical_observations && (
          <div className="text-center py-8 text-gray-500">
            <Phone size={32} className="mx-auto mb-3 text-gray-300" />
            <p>Nenhuma informação de contato cadastrada</p>
          </div>
        )}
      </div>
    </div>
  );
}; 