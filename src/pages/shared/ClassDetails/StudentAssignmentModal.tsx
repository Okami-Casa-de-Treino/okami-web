import React, { useState, useEffect, useMemo } from 'react';
import { 
  X, 
  Search, 
  User, 
  Plus, 
  Minus, 
  AlertCircle,
  CheckCircle 
} from 'lucide-react';
import { useStudentStore } from '../../../stores';
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
  const [assignmentError, setAssignmentError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const {
    students,
    fetchStudents,
    enrollInClass,
    unenrollFromClass,
    isLoading,
    error
  } = useStudentStore();

  // Load students when modal opens
  useEffect(() => {
    if (isOpen) {
      fetchStudents({ limit: 100 });
      setSearchTerm('');
      setAssignmentError(null);
      setSuccessMessage(null);
    }
  }, [isOpen, fetchStudents]);

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

  // Separate assigned and unassigned students - extract student IDs from enrollment data
  const assignedStudentIds = useMemo(() => 
    new Set(assignedStudents.map(enrollment => enrollment.student.id)), 
    [assignedStudents]
  );

  const unassignedStudents = useMemo(() => 
    filteredStudents.filter(student => !assignedStudentIds.has(student.id)),
    [filteredStudents, assignedStudentIds]
  );

  const currentAssignedStudents = useMemo(() => 
    filteredStudents.filter(student => assignedStudentIds.has(student.id)),
    [filteredStudents, assignedStudentIds]
  );

  const handleAssignStudent = async (studentId: string, studentName: string) => {
    setIsAssigning(true);
    setAssignmentError(null);
    setSuccessMessage(null);

    try {
      await enrollInClass(studentId, classId);
      setSuccessMessage(`${studentName} foi matriculado na aula com sucesso!`);
      onStudentAssigned?.();
      
      // Clear success message after 3 seconds
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err) {
      setAssignmentError(
        err instanceof Error ? err.message : 'Erro ao matricular aluno na aula'
      );
    } finally {
      setIsAssigning(false);
    }
  };

  const handleUnassignStudent = async (studentId: string, studentName: string) => {
    setIsAssigning(true);
    setAssignmentError(null);
    setSuccessMessage(null);

    try {
      await unenrollFromClass(studentId, classId);
      setSuccessMessage(`${studentName} foi removido da aula com sucesso!`);
      onStudentAssigned?.();
      
      // Clear success message after 3 seconds
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err) {
      setAssignmentError(
        err instanceof Error ? err.message : 'Erro ao remover aluno da aula'
      );
    } finally {
      setIsAssigning(false);
    }
  };

  const handleClose = () => {
    setSearchTerm('');
    setAssignmentError(null);
    setSuccessMessage(null);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg max-w-4xl w-full mx-4 max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">
              Gerenciar Alunos - {className}
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              Matricule ou remova alunos desta aula
            </p>
          </div>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Search */}
        <div className="p-6 border-b border-gray-200">
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

        {/* Messages */}
        {(assignmentError || error || successMessage) && (
          <div className="px-6 pt-4">
            {(assignmentError || error) && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
                <div className="flex items-center gap-3">
                  <AlertCircle className="text-red-600" size={20} />
                  <div>
                    <h3 className="text-red-800 font-medium">Erro</h3>
                    <p className="text-red-600 text-sm">{assignmentError || error}</p>
                  </div>
                </div>
              </div>
            )}
            
            {successMessage && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
                <div className="flex items-center gap-3">
                  <CheckCircle className="text-green-600" size={20} />
                  <div>
                    <h3 className="text-green-800 font-medium">Sucesso</h3>
                    <p className="text-green-600 text-sm">{successMessage}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Content */}
        <div className="flex-1 overflow-hidden">
          {isLoading ? (
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 p-6 h-full">
              {/* Unassigned Students */}
              <div className="flex flex-col">
                <h3 className="text-lg font-medium text-gray-900 mb-4">
                  Alunos Disponíveis ({unassignedStudents.length})
                </h3>
                <div className="flex-1 overflow-y-auto border border-gray-200 rounded-lg">
                  {unassignedStudents.length > 0 ? (
                    <div className="divide-y divide-gray-200">
                      {unassignedStudents.map((student) => (
                        <div key={student.id} className="p-4 hover:bg-gray-50">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                                <User size={16} className="text-gray-600" />
                              </div>
                              <div>
                                <p className="font-medium text-gray-900">{student.full_name}</p>
                                <p className="text-sm text-gray-500">
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
                            <button
                              onClick={() => handleAssignStudent(student.id, student.full_name)}
                              disabled={isAssigning}
                              className="flex items-center gap-1 px-3 py-1 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                            >
                              <Plus size={14} />
                              Matricular
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="flex items-center justify-center h-32">
                      <p className="text-gray-500">
                        {searchTerm ? 'Nenhum aluno encontrado' : 'Todos os alunos já estão matriculados'}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Assigned Students */}
              <div className="flex flex-col">
                <h3 className="text-lg font-medium text-gray-900 mb-4">
                  Alunos Matriculados ({currentAssignedStudents.length})
                </h3>
                <div className="flex-1 overflow-y-auto border border-gray-200 rounded-lg">
                  {currentAssignedStudents.length > 0 ? (
                    <div className="divide-y divide-gray-200">
                      {currentAssignedStudents.map((student) => (
                        <div key={student.id} className="p-4 hover:bg-gray-50">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                                <User size={16} className="text-green-600" />
                              </div>
                              <div>
                                <p className="font-medium text-gray-900">{student.full_name}</p>
                                <p className="text-sm text-gray-500">
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
                            <button
                              onClick={() => handleUnassignStudent(student.id, student.full_name)}
                              disabled={isAssigning}
                              className="flex items-center gap-1 px-3 py-1 bg-red-600 text-white text-sm rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
                            >
                              <Minus size={14} />
                              Remover
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="flex items-center justify-center h-32">
                      <p className="text-gray-500">
                        {searchTerm ? 'Nenhum aluno matriculado encontrado' : 'Nenhum aluno matriculado'}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 p-6 border-t border-gray-200">
          <button
            onClick={handleClose}
            className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
};

export default StudentAssignmentModal; 