import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate } from 'react-router-dom';
import { z } from 'zod';
import { useTeacherStore } from '../../../../stores';
import { useToast } from '../../../../hooks/useToast';
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
import { SPECIALTIES } from '../../../../utils/constants';

type SpecialtyType = z.infer<typeof SpecialtiesEnum>;

export const useCreateTeacher = () => {
  const navigate = useNavigate();
  const { createTeacher, isCreating, error, clearError } = useTeacherStore();
  const { success, error: showError } = useToast();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const totalSteps = 3;

  console.log(error);

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


  console.log('errors', errors);
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

  // Handle success/error after createTeacher completes
  useEffect(() => {
    if (isSubmitting && !isCreating) {
      if (error) {
        showError(error);
        setIsSubmitting(false);
      } else {
        success('Professor criado com sucesso!');
        navigate('/teachers');
        setIsSubmitting(false);
      }
    }
  }, [isSubmitting, isCreating, error, showError, success, navigate]);

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

      // Clear any previous errors and set submitting state
      clearError();
      setIsSubmitting(true);

      await createTeacher(teacherData);
      
      // The useEffect will handle success/error after the store updates
    } catch (err) {
      // Handle validation or other errors
      const errorMessage = 'Erro ao criar professor. Verifique os dados e tente novamente.';
      showError(errorMessage);
      setIsSubmitting(false);
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
    availableSpecialties: SPECIALTIES,
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