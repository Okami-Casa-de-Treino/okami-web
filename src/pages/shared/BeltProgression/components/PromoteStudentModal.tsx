import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { X, Award, User, FileText, Calendar } from 'lucide-react';
import { PromoteStudentData, Student } from '../../../../types';
import { useBeltProgressionStore } from '../../../../stores';
import { useStudentStore } from '../../../../stores';
import { getBeltOptions, getMaxDegree, determineAgeGroup } from '../../../../utils/beltSystem';

interface PromoteStudentModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface PromoteForm extends PromoteStudentData {
  promotion_date_display: string;
}

export const PromoteStudentModal: React.FC<PromoteStudentModalProps> = ({ isOpen, onClose }) => {
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showStudentList, setShowStudentList] = useState(false);

  const { promoteStudent, isPromoting, error } = useBeltProgressionStore();
  const { students, fetchStudents } = useStudentStore();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
    setValue,
  } = useForm<PromoteForm>({
    defaultValues: {
      promotion_type: 'regular',
      promotion_date_display: new Date().toISOString().split('T')[0],
      requirements_met: {
        technique_test: false,
        sparring_test: false,
        attendance: false,
        time_requirement: false,
      },
    },
  });

  const watchedBelt = watch('new_belt');
  const watchedStudentId = watch('student_id');

  // Load students on mount
  useEffect(() => {
    if (isOpen) {
      fetchStudents();
    }
  }, [isOpen, fetchStudents]);

  // Filter students based on search
  const filteredStudents = students.filter(student =>
    student.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.cpf?.includes(searchTerm)
  );

  // Get current student details
  const currentStudent = students.find(s => s.id === watchedStudentId);
  const ageGroup = currentStudent ? determineAgeGroup(currentStudent.birth_date) : 'Adulto';
  const availableBelts = getBeltOptions(ageGroup);
  const maxDegree = watchedBelt ? getMaxDegree(watchedBelt, ageGroup) : 1;

  const onSubmit = async (data: PromoteForm) => {
    try {
      const submitData: PromoteStudentData = {
        ...data,
        promotion_date: data.promotion_date_display,
      };
      
      await promoteStudent(submitData);
      reset();
      setSelectedStudent(null);
      onClose();
    } catch (error) {
      // Error is handled by the store
    }
  };

  const handleStudentSelect = (student: Student) => {
    setSelectedStudent(student);
    setValue('student_id', student.id);
    setShowStudentList(false);
    setSearchTerm(student.full_name);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <Award className="text-yellow-600" size={20} />
            </div>
            <h2 className="text-xl font-semibold text-gray-900">Promover Aluno</h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-6">
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}

          {/* Student Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <User size={16} className="inline mr-2" />
              Selecionar Aluno
            </label>
            <div className="relative">
              <input
                type="text"
                placeholder="Buscar aluno por nome, email ou CPF..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setShowStudentList(true);
                }}
                onFocus={() => setShowStudentList(true)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              
              {showStudentList && filteredStudents.length > 0 && (
                <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-48 overflow-y-auto">
                  {filteredStudents.slice(0, 10).map((student) => (
                    <button
                      key={student.id}
                      type="button"
                      onClick={() => handleStudentSelect(student)}
                      className="w-full px-4 py-3 text-left hover:bg-gray-50 border-b border-gray-100 last:border-b-0"
                    >
                      <div className="font-medium text-gray-900">{student.full_name}</div>
                      <div className="text-sm text-gray-600">
                        {student.belt} {student.belt_degree}° grau • {student.email}
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
            {selectedStudent && (
              <div className="mt-2 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="font-medium text-blue-900">{selectedStudent.full_name}</p>
                <p className="text-sm text-blue-700">
                  Faixa atual: {selectedStudent.belt} {selectedStudent.belt_degree}° grau
                </p>
              </div>
            )}
          </div>

          {/* Belt Selection */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nova Faixa
              </label>
              <select
                {...register('new_belt', { required: 'Selecione a nova faixa' })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Selecione a faixa</option>
                {availableBelts.map((belt) => (
                  <option key={belt} value={belt}>
                    {belt}
                  </option>
                ))}
              </select>
              {errors.new_belt && (
                <p className="text-red-600 text-sm mt-1">{errors.new_belt.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Novo Grau
              </label>
              <input
                type="number"
                min="0"
                max={maxDegree}
                {...register('new_degree', { 
                  required: 'Informe o novo grau',
                  valueAsNumber: true,
                  min: { value: 0, message: 'Grau mínimo é 0' },
                  max: { value: maxDegree, message: `Grau máximo é ${maxDegree}` }
                })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              {errors.new_degree && (
                <p className="text-red-600 text-sm mt-1">{errors.new_degree.message}</p>
              )}
            </div>
          </div>

          {/* Promotion Type and Date */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tipo de Promoção
              </label>
              <select
                {...register('promotion_type')}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="regular">Regular</option>
                <option value="skip_degree">Pular Grau</option>
                <option value="honorary">Honorária</option>
                <option value="correction">Correção</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Calendar size={16} className="inline mr-2" />
                Data da Promoção
              </label>
              <input
                type="date"
                {...register('promotion_date_display')}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

          {/* Requirements */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Requisitos Atendidos
            </label>
            <div className="grid grid-cols-2 gap-4">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  {...register('requirements_met.technique_test')}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700">Teste de Técnica</span>
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  {...register('requirements_met.sparring_test')}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700">Teste de Sparring</span>
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  {...register('requirements_met.attendance')}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700">Frequência</span>
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  {...register('requirements_met.time_requirement')}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700">Tempo Mínimo</span>
              </label>
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <FileText size={16} className="inline mr-2" />
              Observações
            </label>
            <textarea
              {...register('notes')}
              rows={3}
              placeholder="Observações sobre a promoção..."
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isPromoting || !selectedStudent}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isPromoting ? 'Promovendo...' : 'Promover Aluno'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}; 