import React, { useState, useEffect } from 'react';
import { X, User, Clock, MapPin, Users, CheckCircle, AlertCircle } from 'lucide-react';
import { useCheckinStore, useClassStore, useStudentStore } from '../../stores';
import { Class } from '../../types';
import { checkinService } from '../../services/checkinService';
import { useToast } from '../../hooks/useToast';

// ============================================================================
// TYPES
// ============================================================================

interface BaseModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface TeacherCheckinModalProps extends BaseModalProps {
  selectedClass?: Class | null;
}

interface StudentCheckinModalProps extends BaseModalProps {
  studentId: string;
}

// ============================================================================
// TEACHER/ADMIN CHECKIN MODAL
// ============================================================================

export const TeacherCheckinModal: React.FC<TeacherCheckinModalProps> = ({
  isOpen,
  onClose,
  selectedClass,
}) => {
  const [selectedStudents, setSelectedStudents] = useState<string[]>([]);
  const [selectedClassId, setSelectedClassId] = useState<string>('');
  const [notes, setNotes] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  const { isCreating } = useCheckinStore();
  const { schedule, isLoadingSchedule, fetchClassStudents, classStudents, isLoadingStudents } = useClassStore();
  const { students, fetchStudents, isLoading: isLoadingAllStudents } = useStudentStore();
  const { success, error: showError } = useToast();

  // Get today's classes
  const todayClasses = React.useMemo(() => {
    if (!schedule) return [];
    
    const today = new Date();
    const dayNames = ['Domingo', 'Segunda-feira', 'Terça-feira', 'Quarta-feira', 'Quinta-feira', 'Sexta-feira', 'Sábado'];
    const currentDayName = dayNames[today.getDay()];
    
    return schedule[currentDayName] || [];
  }, [schedule]);

  // Use class students if a class is selected, otherwise use all students
  const availableStudents = React.useMemo(() => {
    if (selectedClassId) {
      return classStudents.map(enrollment => enrollment.student);
    }
    return students;
  }, [selectedClassId, classStudents, students]);

  // Filter students based on search term
  const filteredStudents = React.useMemo(() => {
    if (!searchTerm) return availableStudents;
    return availableStudents.filter(student =>
      student.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (student.email && student.email.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  }, [availableStudents, searchTerm]);

  useEffect(() => {
    if (isOpen) {
      if (selectedClass) {
        setSelectedClassId(selectedClass.id);
        fetchClassStudents(selectedClass.id);
      } else {
        fetchStudents();
      }
    }
  }, [isOpen, selectedClass, fetchClassStudents, fetchStudents]);

  // Fetch students when class selection changes
  useEffect(() => {
    if (selectedClassId) {
      fetchClassStudents(selectedClassId);
      setSelectedStudents([]); // Clear selected students when class changes
    } else {
      fetchStudents();
    }
  }, [selectedClassId, fetchClassStudents, fetchStudents]);

  const handleStudentToggle = (studentId: string) => {
    setSelectedStudents(prev =>
      prev.includes(studentId)
        ? prev.filter(id => id !== studentId)
        : [...prev, studentId]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedClassId || selectedStudents.length === 0) {
      return;
    }

    try {
      // Create check-ins for all selected students
      const checkinPromises = selectedStudents.map(studentId =>
        checkinService.create({
        //@ts-expect-error - TODO: fix this
          student_id: studentId,
          class_id: selectedClassId,
          type: 'manual',
          notes: notes || undefined,
        })
      );

      await Promise.all(checkinPromises);
      
      // Show success toast
      success(`Check-in realizado com sucesso para ${selectedStudents.length} aluno${selectedStudents.length !== 1 ? 's' : ''}`);
      
      // Reset form and close modal
      setSelectedStudents([]);
      setSelectedClassId('');
      setNotes('');
      setSearchTerm('');
      onClose();
    } catch (error) {
      console.error('Failed to create check-ins:', error);
      
      // Try to extract error message from API response
      let errorMessage = 'Erro ao realizar check-in. Tente novamente.';
      
      if (error && typeof error === 'object' && 'error' in error) {
        errorMessage = String(error.error);
      } else if (error instanceof Error) {
        errorMessage = error.message;
      }
      
      showError(errorMessage);
    }
  };

  const handleClose = () => {
    setSelectedStudents([]);
    setSelectedClassId('');
    setNotes('');
    setSearchTerm('');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-4xl w-full max-h-[95vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 sm:p-6 border-b border-gray-200 flex-shrink-0">
          <div className="flex items-center gap-3 min-w-0 flex-1 pr-4">
            <div className="p-2 bg-blue-100 rounded-lg flex-shrink-0">
              <Users className="w-6 h-6 text-blue-600" />
            </div>
            <div className="min-w-0">
              <h2 className="text-lg sm:text-xl font-semibold text-gray-900">Check-in Manual</h2>
              <p className="text-sm text-gray-600">Registrar presença dos alunos</p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors flex-shrink-0"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col flex-1 overflow-hidden">
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 sm:space-y-6">
            {/* Class Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Selecionar Aula *
              </label>
              <select
                value={selectedClassId}
                onChange={(e) => setSelectedClassId(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
                disabled={isLoadingSchedule}
              >
                <option value="">Selecione uma aula</option>
                {todayClasses.map((classItem) => (
                  <option key={classItem.id} value={classItem.id}>
                    {classItem.name} - {new Date(classItem.start_time).toLocaleTimeString('pt-BR', { 
                      hour: '2-digit', 
                      minute: '2-digit' 
                    })} ({classItem.teacher?.full_name})
                  </option>
                ))}
              </select>
            </div>

            {/* Student Search */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Buscar Alunos
              </label>
              <input
                type="text"
                placeholder="Digite o nome ou email do aluno..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            {/* Student Selection */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <label className="block text-sm font-medium text-gray-700">
                  Selecionar Alunos * ({selectedStudents.length} selecionados)
                </label>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setSelectedStudents(filteredStudents.map(s => s.id))}
                    className="text-xs text-blue-600 hover:text-blue-700 font-medium"
                  >
                    Selecionar Todos
                  </button>
                  <button
                    type="button"
                    onClick={() => setSelectedStudents([])}
                    className="text-xs text-gray-600 hover:text-gray-700 font-medium"
                  >
                    Limpar Seleção
                  </button>
                </div>
              </div>
              
              <div className="border border-gray-300 rounded-lg max-h-48 sm:max-h-64 overflow-y-auto">
                {isLoadingStudents || isLoadingAllStudents ? (
                  <div className="flex items-center justify-center py-8">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                  </div>
                ) : filteredStudents.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <User className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                    <p className="text-sm">
                      {selectedClassId 
                        ? 'Nenhum aluno matriculado nesta aula' 
                        : 'Nenhum aluno encontrado'
                      }
                    </p>
                  </div>
                ) : (
                  <div className="divide-y divide-gray-200">
                    {filteredStudents.map((student) => (
                      <label
                        key={student.id}
                        className="flex items-center gap-3 p-3 hover:bg-gray-50 cursor-pointer"
                      >
                        <input
                          type="checkbox"
                          checked={selectedStudents.includes(student.id)}
                          onChange={() => handleStudentToggle(student.id)}
                          className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 flex-shrink-0"
                        />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate">{student.full_name}</p>
                          <p className="text-xs text-gray-500 truncate">{student.email || 'Sem email'}</p>
                        </div>
                        <div className="text-xs text-gray-400 flex-shrink-0">
                          {student.belt} {student.belt_degree && `${student.belt_degree}º grau`}
                        </div>
                      </label>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Notes */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Observações (opcional)
              </label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Adicione observações sobre o check-in..."
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
              />
            </div>
          </div>

          {/* Footer */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-4 sm:p-6 border-t border-gray-200 bg-gray-50 flex-shrink-0">
            <div className="text-sm text-gray-600">
              {selectedStudents.length > 0 && (
                <span className="flex items-center gap-1">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  {selectedStudents.length} aluno{selectedStudents.length !== 1 ? 's' : ''} selecionado{selectedStudents.length !== 1 ? 's' : ''}
                </span>
              )}
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                type="button"
                onClick={handleClose}
                className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm sm:text-base"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={!selectedClassId || selectedStudents.length === 0 || isCreating}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2 text-sm sm:text-base"
              >
                {isCreating ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    Processando...
                  </>
                ) : (
                  <>
                    <CheckCircle className="w-4 h-4" />
                    Confirmar Check-in
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

// ============================================================================
// STUDENT CHECKIN MODAL
// ============================================================================

export const StudentCheckinModal: React.FC<StudentCheckinModalProps> = ({
  isOpen,
  onClose,
  studentId,
}) => {
  const [selectedClassId, setSelectedClassId] = useState<string>('');
  const [notes, setNotes] = useState('');

  const { isCreating } = useCheckinStore();
  const { schedule, isLoadingSchedule } = useClassStore();
  const { success, error: showError } = useToast();

  // Get today's available classes for the student
  const availableClasses = React.useMemo(() => {
    if (!schedule) return [];
    
    const today = new Date();
    const dayNames = ['Domingo', 'Segunda-feira', 'Terça-feira', 'Quarta-feira', 'Quinta-feira', 'Sexta-feira', 'Sábado'];
    const currentDayName = dayNames[today.getDay()];
    const todayClasses = schedule[currentDayName] || [];
    
    // Filter classes that are currently active or about to start (within 30 minutes)
    const now = new Date();
    return todayClasses.filter(classItem => {
      const startTime = new Date(classItem.start_time);
      const endTime = new Date(classItem.end_time);
      
      // Set times to today's date for comparison
      startTime.setFullYear(now.getFullYear(), now.getMonth(), now.getDate());
      endTime.setFullYear(now.getFullYear(), now.getMonth(), now.getDate());
      
      // Allow check-in 30 minutes before class starts and during class
      const checkinAllowedTime = new Date(startTime.getTime() - 30 * 60 * 1000);
      
      return now >= checkinAllowedTime && now <= endTime && classItem.status === 'active';
    });
  }, [schedule]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedClassId) {
      return;
    }

    try {
      await checkinService.create({
        //@ts-expect-error - TODO: fix this
        student_id: studentId,
        class_id: selectedClassId,
        type: 'app',
        notes: notes || undefined,
      });
      
      // Show success toast
      success('Check-in realizado com sucesso!');
      
      // Reset form and close modal
      setSelectedClassId('');
      setNotes('');
      onClose();
    } catch (error) {
      console.error('Failed to create check-in:', error);
      
      // Try to extract error message from API response
      let errorMessage = 'Erro ao realizar check-in. Tente novamente.';
      
      if (error && typeof error === 'object' && 'error' in error) {
        errorMessage = String(error.error);
      } else if (error instanceof Error) {
        errorMessage = error.message;
      }
      
      showError(errorMessage);
    }
  };

  const handleClose = () => {
    setSelectedClassId('');
    setNotes('');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-md w-full">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <User className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Meu Check-in</h2>
              <p className="text-sm text-gray-600">Confirmar minha presença</p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Class Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Selecionar Aula *
            </label>
            {isLoadingSchedule ? (
              <div className="flex items-center justify-center py-4">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-green-600"></div>
              </div>
            ) : availableClasses.length === 0 ? (
              <div className="text-center py-6 text-gray-500">
                <AlertCircle className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                <p className="text-sm">Nenhuma aula disponível para check-in no momento</p>
                <p className="text-xs text-gray-400 mt-1">
                  Check-in é permitido 30 minutos antes e durante a aula
                </p>
              </div>
            ) : (
              <select
                value={selectedClassId}
                onChange={(e) => setSelectedClassId(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                required
              >
                <option value="">Selecione uma aula</option>
                {availableClasses.map((classItem) => {
                  const startTime = new Date(classItem.start_time);
                  const endTime = new Date(classItem.end_time);
                  return (
                    <option key={classItem.id} value={classItem.id}>
                      {classItem.name} - {startTime.toLocaleTimeString('pt-BR', { 
                        hour: '2-digit', 
                        minute: '2-digit' 
                      })} às {endTime.toLocaleTimeString('pt-BR', { 
                        hour: '2-digit', 
                        minute: '2-digit' 
                      })}
                    </option>
                  );
                })}
              </select>
            )}
          </div>

          {/* Selected Class Info */}
          {selectedClassId && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              {(() => {
                const selectedClass = availableClasses.find(c => c.id === selectedClassId);
                if (!selectedClass) return null;
                
                return (
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-green-600" />
                      <span className="text-sm font-medium text-green-800">
                        {selectedClass.name}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4 text-green-600" />
                      <span className="text-sm text-green-700">
                        Professor(a): {selectedClass.teacher?.full_name}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-green-600" />
                      <span className="text-sm text-green-700">
                        {new Date(selectedClass.start_time).toLocaleTimeString('pt-BR', { 
                          hour: '2-digit', 
                          minute: '2-digit' 
                        })} - {new Date(selectedClass.end_time).toLocaleTimeString('pt-BR', { 
                          hour: '2-digit', 
                          minute: '2-digit' 
                        })}
                      </span>
                    </div>
                  </div>
                );
              })()}
            </div>
          )}

          {/* Notes */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Observações (opcional)
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Alguma observação sobre sua presença..."
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 resize-none"
            />
          </div>

          {/* Footer */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={handleClose}
              className="flex-1 px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={!selectedClassId || isCreating || availableClasses.length === 0}
              className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
            >
              {isCreating ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Confirmando...
                </>
              ) : (
                <>
                  <CheckCircle className="w-4 h-4" />
                  Confirmar Presença
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};