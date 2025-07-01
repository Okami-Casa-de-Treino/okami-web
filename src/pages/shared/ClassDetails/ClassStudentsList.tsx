import React from 'react';
import { User, Users, UserPlus } from 'lucide-react';
import { StudentEnrollment } from './types';

interface ClassStudentsListProps {
  students: StudentEnrollment[];
  onManageStudents: () => void;
}

const ClassStudentsList: React.FC<ClassStudentsListProps> = ({
  students,
  onManageStudents,
}) => {
  return (
    <div className="bg-white rounded-lg border border-gray-200">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">
            Alunos Matriculados ({students.length})
          </h3>
          <button
            onClick={onManageStudents}
            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <UserPlus size={16} />
            Gerenciar Alunos
          </button>
        </div>
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
              {students.map((enrollment) => (
                <tr key={enrollment.id} className="hover:bg-gray-50">
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                        <User size={16} className="text-blue-600" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{enrollment.student.full_name}</p>
                        <p className="text-sm text-gray-500">{enrollment.student.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <span className="text-gray-900">
                      {enrollment.student.belt || 'Não definida'}
                      {enrollment.student.belt_degree && ` ${enrollment.student.belt_degree}º`}
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <span className="text-gray-900">
                      {new Date(enrollment.enrollment_date).toLocaleDateString('pt-BR')}
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      enrollment.status === 'active' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {enrollment.status === 'active' ? 'Ativo' : 'Inativo'}
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
  );
};

export default ClassStudentsList; 