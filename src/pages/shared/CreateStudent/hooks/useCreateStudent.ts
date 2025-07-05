import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate } from 'react-router-dom';
import { useStudentStore } from '../../../../stores/studentStore';
import { useToast } from '../../../../hooks/useToast';
import { Student } from '../../../../types';
import { 
  createStudentSchema, 
  createStudentTransformSchema,
  CreateStudentFormData
} from '../schemas';
import { 
  formatPhoneNumber, 
  formatCPF
} from '../../../../utils/masks';
import { getBeltOptions, getMaxDegree, relationshipOptions, AgeGroup } from '../../../../utils/beltSystem';

export const useCreateStudent = () => {
  const navigate = useNavigate();
  const { createStudent, isCreating, error, clearError } = useStudentStore();
  const { success, error: showError } = useToast();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const totalSteps = 4;

  const form = useForm<CreateStudentFormData>({
    resolver: zodResolver(createStudentSchema),
    defaultValues: {
      status: 'active',
      belt_degree: 1,
      age_group: 'Adulto',
      belt: 'Branca',
      full_name: '',
      email: '',
      phone: '',
      birth_date: '',
    },
    mode: 'onBlur',
  });

  const { 
    register, 
    handleSubmit, 
    formState: { errors }, 
    trigger, 
    watch, 
    setValue, 
    getValues 
  } = form;

  const selectedAgeGroup = watch('age_group') as AgeGroup;

  useEffect(() => {
    if (isSubmitting && !isCreating) {
      if (error) {
        showError(error);
        setIsSubmitting(false);
      } else {
        success('Aluno criado com sucesso!');
        navigate('/students');
        setIsSubmitting(false);
      }
    }
  }, [isSubmitting, isCreating, error, showError, success, navigate]);

  const onSubmit = async (data: CreateStudentFormData) => {
    // Only allow submission if we're on the last step
    if (currentStep !== totalSteps) {
      return;
    }

    try {
      const transformedData = createStudentTransformSchema.parse(data);
      
      // Remove age_group as it's only used for UI logic, not stored in database
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { age_group, ...studentData } = transformedData;
      
      const finalStudentData: Omit<Student, 'id' | 'created_at' | 'updated_at'> = {
        ...studentData,
        enrollment_date: new Date().toISOString(),
      };

      clearError();
      setIsSubmitting(true);
      
      await createStudent(finalStudentData);
      
    } catch (err) {
      const errorMessage = 'Erro ao criar aluno. Verifique os dados e tente novamente.';
      showError(errorMessage);
      setIsSubmitting(false);
      console.error('Error creating student:', err);
    }
  };

  const nextStep = async () => {
    // Don't proceed if we're already on the last step
    if (currentStep >= totalSteps) {
      return;
    }

    const fieldsToValidate = getFieldsForStep(currentStep);
    const isValid = await trigger(fieldsToValidate);
    
    if (isValid) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const getFieldsForStep = (step: number): (keyof CreateStudentFormData)[] => {
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

  const handleAgeGroupChange = (ageGroup: AgeGroup) => {
    setValue('age_group', ageGroup);
    // Reset belt when age group changes
    const defaultBelt = ageGroup === 'Infantil' ? 'Branca' : 'Branca';
    setValue('belt', defaultBelt);
    setValue('belt_degree', 1);
  };

  // Phone number formatting
  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPhoneNumber(e.target.value);
    setValue('phone', formatted);
  };

  // Emergency contact phone formatting
  const handleEmergencyPhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPhoneNumber(e.target.value);
    setValue('emergency_contact_phone', formatted);
  };

  // CPF formatting
  const handleCPFChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatCPF(e.target.value);
    setValue('cpf', formatted);
  };

  const goBack = () => {
    navigate('/students');
  };

  return {
    // Form
    form,
    register,
    handleSubmit,
    errors,
    watch,
    setValue,
    getValues,
    
    // Steps
    currentStep,
    totalSteps,
    nextStep,
    prevStep,
    getStepTitle,
    
    // Data
    selectedAgeGroup,
    getBeltOptions,
    getMaxDegree,
    relationshipOptions,
    
    // Handlers
    onSubmit,
    handleAgeGroupChange,
    handlePhoneChange,
    handleEmergencyPhoneChange,
    handleCPFChange,
    goBack,
    
    // State
    isCreating,
    error,
    clearError,
  };
}; 