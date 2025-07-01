import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar, 
  Shield, 
  AlertCircle,
  Save,
  ArrowLeft,
  Edit
} from 'lucide-react';
import { useStudentStore } from '../../stores/studentStore';
import { getBeltOptions, getMaxDegree, relationshipOptions, AgeGroup } from '../../utils/beltSystem';
import { StepIndicator } from '../../components/common/StepIndicator';

interface EditStudentForm {
  full_name: string;
  email: string;
  phone: string;
  birth_date: string;
  cpf?: string;
  rg?: string;
  address?: string;
  age_group: AgeGroup;
  belt?: string;
  belt_degree: number;
  emergency_contact_name?: string;
  emergency_contact_phone?: string;
  emergency_contact_relationship?: string;
  medical_observations?: string;
  monthly_fee?: number;
  status: 'active' | 'inactive' | 'suspended';
}

const EditStudent: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { 
    selectedStudent, 
    fetchStudentById, 
    updateStudent, 
    isLoading,
    isUpdating, 
    error, 
    clearError 
  } = useStudentStore();
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 4;

  const {
    register,
    handleSubmit,
    formState: { errors },
    trigger,
    watch,
    reset
  } = useForm<EditStudentForm>({
    defaultValues: {
      status: 'active',
      belt_degree: 1,
      age_group: 'adults',
      belt: 'Branca'
    }
  });

  const selectedAgeGroup = watch('age_group');

  // Load student data
  useEffect(() => {
    if (id) {
      fetchStudentById(id);
    }
  }, [id, fetchStudentById]);

  // Populate form when student data is loaded
  useEffect(() => {
    if (selectedStudent) {
      const birthDate = selectedStudent.birth_date 
        ? new Date(selectedStudent.birth_date).toISOString().split('T')[0] 
        : '';
      
      // Determine age group based on birth date or existing data
      const ageGroup = selectedStudent.birth_date 
        ? (new Date().getFullYear() - new Date(selectedStudent.birth_date).getFullYear() < 16 ? 'kids' : 'adults')
        : 'adults';

      reset({
        full_name: selectedStudent.full_name || '',
        email: selectedStudent.email || '',
        phone: selectedStudent.phone || '',
        birth_date: birthDate,
        cpf: selectedStudent.cpf || '',
        rg: selectedStudent.rg || '',
        address: selectedStudent.address || '',
        age_group: ageGroup,
        belt: selectedStudent.belt || 'Branca',
        belt_degree: selectedStudent.belt_degree || 1,
        emergency_contact_name: selectedStudent.emergency_contact_name || '',
        emergency_contact_phone: selectedStudent.emergency_contact_phone || '',
        emergency_contact_relationship: selectedStudent.emergency_contact_relationship || '',
        medical_observations: selectedStudent.medical_observations || '',
        monthly_fee: selectedStudent.monthly_fee || undefined,
        status: selectedStudent.status || 'active'
      });
    }
  }, [selectedStudent, reset]);

  // Using belt system utilities

  const onSubmit = async (data: EditStudentForm) => {
    if (!id) return;

    try {
      // Remove age_group as it's only used for UI logic, not stored in database
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { age_group, ...studentData } = data;
      
      await updateStudent(id, studentData);
      navigate('/students', { 
        state: { message: 'Aluno atualizado com sucesso!' }
      });
    } catch (err) {
      // Error is handled by the store
    }
  };

  const nextStep = async (e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    
    const fieldsToValidate = getFieldsForStep(currentStep);
    const isValid = await trigger(fieldsToValidate);
    
    if (isValid && currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = (e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const getFieldsForStep = (step: number): (keyof EditStudentForm)[] => {
    switch (step) {
      case 1:
        return ['full_name', 'email', 'phone', 'birth_date'];
      case 2:
        return []; // Step 2 fields are all optional
      case 3:
        return []; // Step 3 fields are all optional
      case 4:
        return ['age_group', 'belt', 'status'];
      default:
        return [];
    }
  };

  const getStepTitle = (step: number): string => {
    switch (step) {
      case 1: return 'Informações Básicas';
      case 2: return 'Documentos e Endereço';
      case 3: return 'Contato de Emergência';
      case 4: return 'Configurações do Aluno';
      default: return '';
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <p className="text-gray-500">Carregando dados do aluno...</p>
        </div>
      </div>
    );
  }

  if (!selectedStudent) {
    return (
      <div className="min-h-screen bg-gray-50 py-8 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-500">Aluno não encontrado</p>
          <button 
            onClick={() => navigate('/students')}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Voltar para lista
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  navigate('/students');
                }}
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ArrowLeft size={20} />
              </button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900 flex items-center">
                  <Edit size={28} className="mr-3 text-green-600" />
                  Editar Aluno
                </h1>
                <p className="text-gray-600 mt-1">
                  {selectedStudent.full_name} - {getStepTitle(currentStep)} ({currentStep} de {totalSteps})
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Form */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
          <StepIndicator currentStep={currentStep} totalSteps={totalSteps} />

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6 flex items-center justify-between">
              <span className="flex items-center">
                <AlertCircle size={16} className="mr-2" />
                {error}
              </span>
              <button 
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  clearError();
                }}
                className="text-red-500 hover:text-red-700"
              >
                ×
              </button>
            </div>
          )}

          <form onSubmit={(e) => {
            e.preventDefault();
            if (currentStep === totalSteps) {
              handleSubmit(onSubmit)(e);
            }
          }}>
            {/* Step 1: Basic Information */}
            {currentStep === 1 && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <User size={16} className="inline mr-2" />
                      Nome Completo *
                    </label>
                    <input
                      type="text"
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                        errors.full_name ? 'border-red-500' : 'border-gray-300'
                      }`}
                      {...register('full_name', { 
                        required: 'Nome completo é obrigatório',
                        minLength: { value: 2, message: 'Nome deve ter pelo menos 2 caracteres' }
                      })}
                      placeholder="Digite o nome completo"
                    />
                    {errors.full_name && (
                      <p className="mt-1 text-sm text-red-600 flex items-center">
                        <AlertCircle size={14} className="mr-1" />
                        {errors.full_name.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <Mail size={16} className="inline mr-2" />
                      Email *
                    </label>
                    <input
                      type="email"
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                        errors.email ? 'border-red-500' : 'border-gray-300'
                      }`}
                      {...register('email', { 
                        required: 'Email é obrigatório',
                        pattern: {
                          value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                          message: 'Email inválido'
                        }
                      })}
                      placeholder="Digite o email"
                    />
                    {errors.email && (
                      <p className="mt-1 text-sm text-red-600 flex items-center">
                        <AlertCircle size={14} className="mr-1" />
                        {errors.email.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <Phone size={16} className="inline mr-2" />
                      Telefone *
                    </label>
                    <input
                      type="tel"
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                        errors.phone ? 'border-red-500' : 'border-gray-300'
                      }`}
                      {...register('phone', { 
                        required: 'Telefone é obrigatório',
                        minLength: { value: 10, message: 'Telefone deve ter pelo menos 10 dígitos' }
                      })}
                      placeholder="(11) 99999-9999"
                    />
                    {errors.phone && (
                      <p className="mt-1 text-sm text-red-600 flex items-center">
                        <AlertCircle size={14} className="mr-1" />
                        {errors.phone.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <Calendar size={16} className="inline mr-2" />
                      Data de Nascimento *
                    </label>
                    <input
                      type="date"
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                        errors.birth_date ? 'border-red-500' : 'border-gray-300'
                      }`}
                      {...register('birth_date', { 
                        required: 'Data de nascimento é obrigatória'
                      })}
                    />
                    {errors.birth_date && (
                      <p className="mt-1 text-sm text-red-600 flex items-center">
                        <AlertCircle size={14} className="mr-1" />
                        {errors.birth_date.message}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Step 2: Documents and Address */}
            {currentStep === 2 && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      CPF
                    </label>
                    <input
                      type="text"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                      {...register('cpf')}
                      placeholder="000.000.000-00"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      RG
                    </label>
                    <input
                      type="text"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                      {...register('rg')}
                      placeholder="00.000.000-0"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <MapPin size={16} className="inline mr-2" />
                    Endereço Completo
                  </label>
                  <textarea
                    rows={3}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    {...register('address')}
                    placeholder="Rua, número, bairro, cidade, CEP..."
                  />
                </div>
              </div>
            )}

            {/* Step 3: Emergency Contact */}
            {currentStep === 3 && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nome do Contato de Emergência
                    </label>
                    <input
                      type="text"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                      {...register('emergency_contact_name')}
                      placeholder="Nome completo"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Telefone do Contato de Emergência
                    </label>
                    <input
                      type="tel"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                      {...register('emergency_contact_phone')}
                      placeholder="(11) 99999-9999"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Parentesco/Relação
                    </label>
                    <select
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                      {...register('emergency_contact_relationship')}
                    >
                      <option value="">Selecione o parentesco</option>
                      {relationshipOptions.map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Observações Médicas
                  </label>
                  <textarea
                    rows={4}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    {...register('medical_observations')}
                    placeholder="Alergias, medicamentos, condições médicas, restrições..."
                  />
                </div>
              </div>
            )}

            {/* Step 4: Student Settings */}
            {currentStep === 4 && (
              <div className="space-y-6">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                  <h3 className="font-semibold text-blue-900 mb-2">Configurações do Aluno</h3>
                  <p className="text-blue-700 text-sm">
                    Configure as informações específicas de treino e status do aluno.
                  </p>
                </div>

                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Mensalidade (R$)
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                      {...register('monthly_fee', {
                        valueAsNumber: true,
                        min: { value: 0, message: 'Valor deve ser positivo' }
                      })}
                      placeholder="150.00"
                    />
                    {errors.monthly_fee && (
                      <p className="mt-1 text-sm text-red-600 flex items-center">
                        <AlertCircle size={14} className="mr-1" />
                        {errors.monthly_fee.message}
                      </p>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        <Shield size={16} className="inline mr-2" />
                        Faixa Atual
                        <span className="text-xs text-gray-500 ml-2">
                          ({selectedAgeGroup === 'kids' ? 'Sistema Infantil' : 'Sistema Adulto'})
                        </span>
                      </label>
                      <select
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                        {...register('belt')}
                      >
                        {getBeltOptions(selectedAgeGroup).map((belt) => (
                          <option key={belt} value={belt}>
                            {belt}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Grau da Faixa
                        <span className="text-xs text-gray-500 ml-2">
                          (0 a {getMaxDegree(watch('belt') || 'Branca', selectedAgeGroup)})
                        </span>
                      </label>
                      <input
                        type="number"
                        min="0"
                        max={getMaxDegree(watch('belt') || 'Branca', selectedAgeGroup)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                        {...register('belt_degree', {
                          valueAsNumber: true,
                          min: { value: 0, message: 'Grau mínimo é 0' },
                          max: { value: getMaxDegree(watch('belt') || 'Branca', selectedAgeGroup), message: `Grau máximo é ${getMaxDegree(watch('belt') || 'Branca', selectedAgeGroup)}` }
                        })}
                      />
                    </div>
                  </div>

                  <div className="max-w-md">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Status
                    </label>
                    <select
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                      {...register('status')}
                    >
                      <option value="active">Ativo</option>
                      <option value="inactive">Inativo</option>
                      <option value="suspended">Suspenso</option>
                    </select>
                  </div>
                </div>

                {/* Belt System Info */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h4 className="font-semibold text-blue-900 mb-2">
                    Sistema de Faixas - {selectedAgeGroup === 'kids' ? 'Infantil' : 'Adulto'}
                  </h4>
                  <div className="text-sm text-blue-700">
                    <p className="mb-2">
                      {selectedAgeGroup === 'kids' 
                        ? 'Sistema infantil: Faixas coloridas para crianças até 16 anos'
                        : 'Sistema adulto: Faixas tradicionais do Jiu-Jitsu brasileiro'
                      }
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {getBeltOptions(selectedAgeGroup).map((belt) => (
                        <span key={belt} className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs">
                          {belt}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div className="flex justify-between mt-8 pt-6 border-t border-gray-200">
              <button
                type="button"
                onClick={(e) => prevStep(e)}
                disabled={currentStep === 1}
                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Anterior
              </button>

              {currentStep < totalSteps ? (
                <button
                  type="button"
                  onClick={(e) => nextStep(e)}
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Próximo
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={isUpdating}
                  className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center"
                >
                  {isUpdating ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                      Salvando...
                    </>
                  ) : (
                    <>
                      <Save size={16} className="mr-2" />
                      Salvar Alterações
                    </>
                  )}
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditStudent; 