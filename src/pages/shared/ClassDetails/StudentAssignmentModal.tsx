import React, { useState, useEffect, useMemo } from 'react';
import { 
  X, 
  Search, 
  User, 
  Plus, 
  Minus, 
  AlertCircle
} from 'lucide-react';
import { useStudentStore } from '../../../stores';
import { useToast } from '../../../hooks/useToast';
import { StudentEnrollment } from './types';

interface StudentAssignmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  classId: string;
  className: string;
  assignedStudents: StudentEnrollment[];
  onStudentAssigned?: () => void;
}

const StudentAssignmentModal: React.FC<StudentAssignmentModalProps> = ({
  isOpen,
  onClose,
  classId,
  className,
  assignedStudents,
  onStudentAssigned,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isAssigning, setIsAssigning] = useState(false);
  const [localEnrolledStudents, setLocalEnrolledStudents] = useState<Set<string>>(new Set());

  const {
    students,
    fetchStudents,
    enrollInClass,
    unenrollFromClass,
    isLoading,
    error
  } = useStudentStore();

  const { success, error: showError } = useToast();

  // Load students when modal opens
  useEffect(() => {
    if (isOpen) {
      fetchStudents({ limit: 100 });
      setSearchTerm('');
      // Initialize local enrolled students from props
      const enrolledIds = new Set(assignedStudents?.map(enrollment => enrollment.student.id) || []);
      setLocalEnrolledStudents(enrolledIds);
    }
  }, [isOpen, fetchStudents, assignedStudents]);

  // Filter students based on search term
  const filteredStudents = useMemo(() => {
    if (!searchTerm.trim()) return students;
    
    const term = searchTerm.toLowerCase();
    return students.filter(student => 
      student.full_name.toLowerCase().includes(term) ||
      student.email?.toLowerCase().includes(term) ||
      student.phone?.includes(term)
    );
  }, [students, searchTerm]);

  // Check if students are already assigned to the class using local state
  const isStudentAssigned = useMemo(() => 
    (studentId: string) => localEnrolledStudents.has(studentId),
    [localEnrolledStudents]
  );

  const handleAssignStudent = async (studentId: string, studentName: string) => {
    setIsAssigning(true);

    try {
      await enrollInClass(studentId, classId);
      // Update local state immediately
      setLocalEnrolledStudents(prev => new Set([...prev, studentId]));
      success(`${studentName} foi matriculado na aula com sucesso!`);
      onStudentAssigned?.();
    } catch (err) {
      showError(
        err instanceof Error ? err.message : 'Erro ao matricular aluno na aula'
      );
    } finally {
      setIsAssigning(false);
    }
  };

  const handleUnassignStudent = async (studentId: string, studentName: string) => {
    setIsAssigning(true);

    try {
      await unenrollFromClass(studentId, classId);
      // Update local state immediately
      setLocalEnrolledStudents(prev => {
        const newSet = new Set(prev);
        newSet.delete(studentId);
        return newSet;
      });
      success(`${studentName} foi removido da aula com sucesso!`);
      onStudentAssigned?.();
    } catch (err) {
      showError(
        err instanceof Error ? err.message : 'Erro ao remover aluno da aula'
      );
    } finally {
      setIsAssigning(false);
    }
  };

  const handleClose = () => {
    setSearchTerm('');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg w-full max-w-6xl max-h-[95vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 sm:p-6 border-b border-gray-200 flex-shrink-0">
          <div className="min-w-0 flex-1 pr-4">
            <h2 className="text-lg sm:text-xl font-semibold text-gray-900 truncate">
              Gerenciar Alunos - {className}
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              Matricule ou remova alunos desta aula
            </p>
          </div>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600 transition-colors flex-shrink-0 p-1"
          >
            <X size={24} />
          </button>
        </div>

        {/* Search */}
        <div className="p-4 sm:p-6 border-b border-gray-200 flex-shrink-0">
          <div className="relative">
            <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar alunos por nome, email ou telefone..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Error from store */}
        {error && (
          <div className="px-4 sm:px-6 pt-4 flex-shrink-0">
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
              <div className="flex items-center gap-3">
                <AlertCircle className="text-red-600 flex-shrink-0" size={20} />
                <div className="min-w-0">
                  <h3 className="text-red-800 font-medium">Erro</h3>
                  <p className="text-red-600 text-sm">{error}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Content */}
        <div className="flex-1 overflow-hidden">
          {isLoading ? (
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
          ) : (
            <div className="h-full overflow-y-auto">
              <div className="p-4 sm:p-6">
                <h3 className="text-base sm:text-lg font-medium text-gray-900 mb-3 sm:mb-4">
                  Alunos ({filteredStudents.length})
                </h3>
                <div className="border border-gray-200 rounded-lg overflow-hidden">
                  {filteredStudents.length > 0 ? (
                    <div className="divide-y divide-gray-200">
                      {filteredStudents.map((student) => {
                        const isAssigned = isStudentAssigned(student.id);
                        return (
                          <div key={student.id} className="p-3 sm:p-4 hover:bg-gray-50">
                            <div className="flex items-center justify-between gap-3">
                              <div className="flex items-center gap-3 min-w-0 flex-1">
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                                  isAssigned ? 'bg-green-100' : 'bg-gray-100'
                                }`}>
                                  <User size={16} className={isAssigned ? 'text-green-600' : 'text-gray-600'} />
                                </div>
                                <div className="min-w-0 flex-1">
                                  <p className="font-medium text-gray-900 text-sm sm:text-base truncate">
                                    {student.full_name}
                                  </p>
                                  <p className="text-xs sm:text-sm text-gray-500 truncate">
                                    {student.email || student.phone}
                                  </p>
                                  {student.belt && (
                                    <p className="text-xs text-gray-400">
                                      Faixa {student.belt}
                                      {student.belt_degree && ` ${student.belt_degree}º`}
                                    </p>
                                  )}
                                </div>
                              </div>
                              {isAssigned ? (
                                <button
                                  onClick={() => handleUnassignStudent(student.id, student.full_name)}
                                  disabled={isAssigning}
                                  className="flex items-center gap-1 px-2 sm:px-3 py-1 bg-red-600 text-white text-xs sm:text-sm rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 flex-shrink-0"
                                >
                                  <Minus size={14} />
                                  <span className="hidden sm:inline">Remover</span>
                                </button>
                              ) : (
                                <button
                                  onClick={() => handleAssignStudent(student.id, student.full_name)}
                                  disabled={isAssigning}
                                  className="flex items-center gap-1 px-2 sm:px-3 py-1 bg-blue-600 text-white text-xs sm:text-sm rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 flex-shrink-0"
                                >
                                  <Plus size={14} />
                                  <span className="hidden sm:inline">Matricular</span>
                                </button>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="flex items-center justify-center h-32">
                      <p className="text-gray-500 text-sm text-center px-4">
                        {searchTerm ? 'Nenhum aluno encontrado' : 'Nenhum aluno disponível'}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 p-4 sm:p-6 border-t border-gray-200 flex-shrink-0">
          <button
            onClick={handleClose}
            className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors text-sm sm:text-base"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
};

export default StudentAssignmentModal; 