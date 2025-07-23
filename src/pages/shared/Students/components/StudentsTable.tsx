import React from 'react';
import { Plus } from 'lucide-react';
import { Student } from '../../../../types';
import { StudentTableRow } from './StudentTableRow';
import { StudentsPagination } from './StudentsPagination';
import { AppRoutes } from '../../../../routes/routes.constants';
import { useNavigate } from 'react-router-dom';

interface StudentsTableProps {
  students: Student[];
  isLoading: boolean;
  isDeleting: boolean;
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
  onDeleteStudent: (id: string) => void;
  onFetchStudents: (params?: { page: number }) => void;
}

export const StudentsTable: React.FC<StudentsTableProps> = ({
  students,
  isLoading,
  isDeleting,
  pagination,
  onDeleteStudent,
  onFetchStudents
}) => {
  const navigate = useNavigate();
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="text-left py-4 px-6 font-semibold text-gray-900">Aluno</th>
              <th className="text-left py-4 px-6 font-semibold text-gray-900">Faixa</th>
              <th className="text-left py-4 px-6 font-semibold text-gray-900">Status</th>
              <th className="text-left py-4 px-6 font-semibold text-gray-900">Telefone</th>
              <th className="text-left py-4 px-6 font-semibold text-gray-900">Mensalidade</th>
              <th className="text-left py-4 px-6 font-semibold text-gray-900">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {isLoading ? (
              <tr>
                <td colSpan={6} className="py-12 text-center">
                  <div className="flex flex-col items-center gap-3">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                    <p className="text-gray-500">Carregando alunos...</p>
                  </div>
                </td>
              </tr>
            ) : students.length > 0 ? (
              students.map((student, index) => (
                <StudentTableRow
                  key={student.id || `student-${index}`}
                  student={student}
                  isDeleting={isDeleting}
                  onDeleteStudent={onDeleteStudent}
                />
              ))
            ) : (
              <tr>
                <td colSpan={6} className="py-12 text-center">
                  <div className="flex flex-col items-center gap-3">
                    <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                      <Plus size={24} className="text-gray-400" />
                    </div>
                    <div>
                      <p className="text-gray-900 font-medium">Nenhum aluno encontrado</p>
                      <p className="text-gray-500 text-sm">Comece adicionando seu primeiro aluno</p>
                    </div>
                    <button className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors" onClick={() => navigate(AppRoutes.STUDENTS_CREATE)}>
                      <Plus size={16} />
                      Adicionar Aluno
                    </button>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      
      <StudentsPagination 
        pagination={pagination}
        isLoading={isLoading}
        onFetchStudents={onFetchStudents}
      />
    </div>
  );
}; 