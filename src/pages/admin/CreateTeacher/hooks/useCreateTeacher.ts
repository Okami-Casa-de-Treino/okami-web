
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate } from 'react-router-dom';
import { z } from 'zod';
import { useTeacherStore } from '../../../../stores';
import { Teacher } from '../../../../types';
import { 
  createTeacherSchema, 
  createTeacherTransformSchema,
  CreateTeacherFormData,
  SpecialtiesEnum
} from '../schemas';
import { 
  formatPhoneNumber, 
  formatCPF
} from '../../../../utils/masks';

type SpecialtyType = z.infer<typeof SpecialtiesEnum>;

export const useCreateTeacher = () => {
  const navigate = useNavigate();
  const { createTeacher, isCreating, error, clearError } = useTeacherStore();
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 3;

  const form = useForm<CreateTeacherFormData>({
    //@ts-expect-error - resolver is not typed
    resolver: zodResolver(createTeacherSchema),
    defaultValues: {
      status: 'active',
      belt_degree: 1,
      belt: 'Branca',
      specialties: [],
      full_name: '',
      email: '',
      phone: '',
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

  // Martial arts belts
  const belts = [
    'Branca',
    'Azul',
    'Roxa',
    'Marrom',
    'Preta',
    'Coral',
    'Vermelha'
  ];

  // Common martial arts specialties
  const availableSpecialties = [
    'Jiu Jitsu',
    'Karatê',
    'Judô',
    'Taekwondo',
    'Muay Thai',
    'Boxe',
    'MMA',
    'Defesa Pessoal',
    'Kung Fu',
    'Capoeira',
    'Krav Maga',
  ];

  const getMaxDegree = () => {
    const currentBelt = watch('belt');
    
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

  const onSubmit = async (data: CreateTeacherFormData) => {
    // Only allow submission if we're on the last step
    if (currentStep !== totalSteps) {
      console.log('Preventing submission - not on last step');
      return;
    }

    try {
      const transformedData = createTeacherTransformSchema.parse(data);
      
      const teacherData: Omit<Teacher, 'id' | 'created_at' | 'updated_at'> = {
        ...transformedData,
      };

      await createTeacher(teacherData);
      navigate('/teachers', { 
        state: { message: 'Professor criado com sucesso!' }
      });
    } catch (err) {
      // Error is handled by the store
      console.error('Error creating teacher:', err);
    }
  };

  const handleFormSubmit = (data: CreateTeacherFormData) => {
    // Additional check to prevent unwanted submissions
    if (currentStep === totalSteps) {
      onSubmit(data);
    } else {
      // If not on the last step, just go to next step
      nextStep();
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

  const getFieldsForStep = (step: number): (keyof CreateTeacherFormData)[] => {
    switch (step) {
      case 1:
        return ['full_name', 'email', 'phone'];
      case 2:
        return []; // Step 2 fields are all optional
      case 3:
        return ['status'];
      default:
        return [];
    }
  };

  const getStepTitle = (step: number): string => {
    switch (step) {
      case 1: return 'Informações Básicas';
      case 2: return 'Qualificações e Especialidades';
      case 3: return 'Configurações do Professor';
      default: return '';
    }
  };

  const handleSpecialtyToggle = (specialty: string) => {
    const currentSpecialties = watch('specialties') || [];
    const typedSpecialty = specialty as SpecialtyType;
    
    const updatedSpecialties = currentSpecialties.includes(typedSpecialty)
      ? currentSpecialties.filter(s => s !== typedSpecialty)
      : [...currentSpecialties, typedSpecialty];
    
    setValue('specialties', updatedSpecialties);
  };

  // Phone number formatting
  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPhoneNumber(e.target.value);
    setValue('phone', formatted);
  };

  // CPF formatting
  const handleCPFChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatCPF(e.target.value);
    setValue('cpf', formatted);
  };

  const goBack = () => {
    navigate('/teachers');
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
    belts,
    availableSpecialties,
    getMaxDegree,
    
    // Handlers
    onSubmit,
    handleFormSubmit,
    handleSpecialtyToggle,
    handlePhoneChange,
    handleCPFChange,
    goBack,
    
    // State
    isCreating,
    error,
    clearError,
  };
}; 