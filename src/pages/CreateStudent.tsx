import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
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
  UserPlus,
  Users
} from 'lucide-react';
import { useStudentStore } from '../stores/studentStore';
import { Student } from '../types';

interface CreateStudentForm {
  full_name: string;
  email: string;
  phone: string;
  birth_date: string;
  cpf?: string;
  rg?: string;
  address?: string;
  age_group: 'kids' | 'adults';
  belt?: string;
  belt_degree: number;
  emergency_contact_name?: string;
  emergency_contact_phone?: string;
  emergency_contact_relationship?: string;
  medical_observations?: string;
  status: 'active' | 'inactive' | 'suspended';
}

const CreateStudent: React.FC = () => {
  const navigate = useNavigate();
  const { createStudent, isCreating, error, clearError } = useStudentStore();
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 4;

  const {
    register,
    handleSubmit,
    formState: { errors },
    trigger,
    watch,
    setValue
  } = useForm<CreateStudentForm>({
    defaultValues: {
      status: 'active',
      belt_degree: 1,
      age_group: 'adults',
      belt: 'Branca'
    }
  });

  const selectedAgeGroup = watch('age_group');

  // Brazilian Jiu-Jitsu belt systems
  const kidsBelts = [
    'Branca',
    'Cinza-Branca',
    'Cinza', 
    'Cinza-Preta',
    'Amarela-Branca',
    'Amarela',
    'Amarela-Preta',
    'Laranja-Branca',
    'Laranja',
    'Laranja-Preta',
    'Verde-Branca',
    'Verde',
    'Verde-Preta'
  ];

  const adultsBelts = [
    'Branca',
    'Azul',
    'Roxa',
    'Marrom',
    'Preta',
    'Coral',
    'Vermelha'
  ];

  const relationshipOptions = [
    'Pai', 'Mãe', 'Avô', 'Avó', 'Tio', 'Tia', 'Irmão', 'Irmã', 'Responsável', 'Outro'
  ];

  const getBeltOptions = () => {
    return selectedAgeGroup === 'kids' ? kidsBelts : adultsBelts;
  };

  const getMaxDegree = () => {
    const currentBelt = watch('belt');
    if (selectedAgeGroup === 'kids') {
      return 1; // Kids belts typically don't have degrees
    }
    
    // Adult belt degrees
    switch (currentBelt) {
      case 'Branca':
        return 4;
      case 'Azul':
      case 'Roxa':
      case 'Marrom':
        return 4;
      case 'Preta':
        return 10;
      default:
        return 1;
    }
  };

  const onSubmit = async (data: CreateStudentForm) => {
    try {
      // Remove age_group as it's only used for UI logic, not stored in database
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { age_group, ...studentData } = data;
      
      const finalStudentData: Omit<Student, 'id' | 'created_at' | 'updated_at'> = {
        ...studentData,
        enrollment_date: new Date().toISOString(),
      };

      await createStudent(finalStudentData);
      navigate('/students', { 
        state: { message: 'Aluno criado com sucesso!' }
      });
    } catch (err) {
      console.error('Failed to create student:', err);
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

  const getFieldsForStep = (step: number): (keyof CreateStudentForm)[] => {
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

  const handleAgeGroupChange = (ageGroup: 'kids' | 'adults', e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    
    setValue('age_group', ageGroup);
    // Reset belt when age group changes
    const defaultBelt = ageGroup === 'kids' ? 'Branca' : 'Branca';
    setValue('belt', defaultBelt);
    setValue('belt_degree', 1);
  };

  const renderStepIndicator = () => (
    <div className="flex items-center justify-center mb-8">
      {Array.from({ length: totalSteps }, (_, index) => {
        const stepNumber = index + 1;
        const isActive = stepNumber === currentStep;
        const isCompleted = stepNumber < currentStep;

        return (
          <React.Fragment key={stepNumber}>
            <div
              className={`flex items-center justify-center w-10 h-10 rounded-full border-2 transition-all duration-300 ${
                isActive
                  ? 'bg-blue-600 border-blue-600 text-white'
                  : isCompleted
                  ? 'bg-green-600 border-green-600 text-white'
                  : 'bg-white border-gray-300 text-gray-400'
              }`}
            >
              {isCompleted ? '✓' : stepNumber}
            </div>
            {stepNumber < totalSteps && (
              <div
                className={`w-16 h-0.5 mx-2 transition-all duration-300 ${
                  isCompleted ? 'bg-green-600' : 'bg-gray-300'
                }`}
              />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );

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
                  <UserPlus size={28} className="mr-3 text-blue-600" />
                  Novo Aluno
                </h1>
                <p className="text-gray-600 mt-1">
                  {getStepTitle(currentStep)} ({currentStep} de {totalSteps})
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Form */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
          {renderStepIndicator()}

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
                      E-mail *
                    </label>
                    <input
                      type="email"
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                        errors.email ? 'border-red-500' : 'border-gray-300'
                      }`}
                      {...register('email', { 
                        required: 'E-mail é obrigatório',
                        pattern: {
                          value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                          message: 'E-mail inválido'
                        }
                      })}
                      placeholder="exemplo@email.com"
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
                        required: 'Telefone é obrigatório'
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
                    placeholder="Rua, número, bairro, cidade, CEP"
                  />
                </div>
              </div>
            )}

            {/* Step 3: Emergency Contact */}
            {currentStep === 3 && (
              <div className="space-y-6">
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6">
                  <p className="text-amber-800 text-sm">
                    <AlertCircle size={16} className="inline mr-2" />
                    Informações de contato para emergências médicas ou situações urgentes.
                  </p>
                </div>

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
                      Telefone de Emergência
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
                {/* Age Group Selection */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    <Users size={16} className="inline mr-2" />
                    Categoria de Idade *
                  </label>
                  <div className="grid grid-cols-2 gap-4">
                    <button
                      type="button"
                      onClick={(e) => handleAgeGroupChange('kids', e)}
                      className={`p-4 border-2 rounded-lg transition-all duration-200 ${
                        selectedAgeGroup === 'kids'
                          ? 'border-blue-600 bg-blue-50 text-blue-700'
                          : 'border-gray-300 hover:border-gray-400'
                      }`}
                    >
                      <div className="text-center">
                        <div className="text-2xl mb-2">👶</div>
                        <div className="font-semibold">Infantil</div>
                        <div className="text-sm text-gray-600">4-15 anos</div>
                      </div>
                    </button>
                    <button
                      type="button"
                      onClick={(e) => handleAgeGroupChange('adults', e)}
                      className={`p-4 border-2 rounded-lg transition-all duration-200 ${
                        selectedAgeGroup === 'adults'
                          ? 'border-blue-600 bg-blue-50 text-blue-700'
                          : 'border-gray-300 hover:border-gray-400'
                      }`}
                    >
                      <div className="text-center">
                        <div className="text-2xl mb-2">🥋</div>
                        <div className="font-semibold">Adulto</div>
                        <div className="text-sm text-gray-600">16+ anos</div>
                      </div>
                    </button>
                  </div>
                  <input type="hidden" {...register('age_group')} />
                </div>

                <div className="space-y-6">
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
                        {getBeltOptions().map((belt) => (
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
                          (máx: {getMaxDegree()})
                        </span>
                      </label>
                      <input
                        type="number"
                        min="1"
                        max={getMaxDegree()}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                        {...register('belt_degree', { 
                          valueAsNumber: true,
                          min: { value: 1, message: 'Grau mínimo é 1' },
                          max: { value: getMaxDegree(), message: `Grau máximo é ${getMaxDegree()}` }
                        })}
                      />
                      {errors.belt_degree && (
                        <p className="mt-1 text-sm text-red-600 flex items-center">
                          <AlertCircle size={14} className="mr-1" />
                          {errors.belt_degree.message}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="max-w-md">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Status Inicial
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
                  <div className="text-sm text-blue-800">
                    {selectedAgeGroup === 'kids' ? (
                      <div>
                        <p className="mb-2">Sistema infantil (4-15 anos):</p>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-2 text-xs">
                          {kidsBelts.map((belt, index) => (
                            <span key={belt} className="bg-white px-2 py-1 rounded">
                              {index + 1}. {belt}
                            </span>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <div>
                        <p className="mb-2">Sistema adulto (16+ anos):</p>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs">
                          {adultsBelts.map((belt, index) => (
                            <span key={belt} className="bg-white px-2 py-1 rounded">
                              {index + 1}. {belt}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
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
                  disabled={isCreating}
                  className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center"
                >
                  {isCreating ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                      Criando...
                    </>
                  ) : (
                    <>
                      <Save size={16} className="mr-2" />
                      Criar Aluno
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

export default CreateStudent; 