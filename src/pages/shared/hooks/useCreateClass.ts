import { useEffect, useState, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { useClassStore, useTeacherStore } from '../../../stores';
import { useToast } from '../../../hooks/useToast';
import { Class, Teacher } from '../../../types';
import { AppRoutes } from '../../../routes/routes.constants';

export interface CreateClassForm {
  name: string;
  description?: string;
  teacher_id?: string;
  days_of_week: number[];
  start_time: string;
  end_time: string;
  max_students: number;
  belt_requirement?: string;
  age_group?: string;
  status: 'active' | 'inactive';
}

export const useCreateClass = () => {
  const navigate = useNavigate();
  const { createClass, isCreating, error, clearError } = useClassStore();
  const { fetchTeachers, teachers } = useTeacherStore();
  const { success, error: showError } = useToast();
  
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedDays, setSelectedDays] = useState<number[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const totalSteps = 3;

  const form = useForm<CreateClassForm>({
    defaultValues: {
      status: 'active',
      max_students: 20,
      days_of_week: [],
      belt_requirement: 'Todas as faixas',
      age_group: 'Adulto'
    }
  });

  const { register, handleSubmit, formState: { errors }, trigger, watch, setValue } = form;

  // Available options
  const dayOptions = [
    { value: 0, label: 'Domingo', short: 'Dom' },
    { value: 1, label: 'Segunda', short: 'Seg' },
    { value: 2, label: 'Terça', short: 'Ter' },
    { value: 3, label: 'Quarta', short: 'Qua' },
    { value: 4, label: 'Quinta', short: 'Qui' },
    { value: 5, label: 'Sexta', short: 'Sex' },
    { value: 6, label: 'Sábado', short: 'Sáb' }
  ];

  const beltRequirements = [
    'Todas as faixas',
    'Branca',
    'Azul',
    'Roxa',
    'Marrom',
    'Preta',
    'Iniciantes',
    'Intermediário',
    'Avançado'
  ];

  const ageGroups = [
    'Infantil',
    'Juvenil', 
    'Adulto',
    'Master',
    'Todas as idades'
  ];

  // Get active teachers for selection
  const activeTeachers = teachers.filter(teacher => teacher.status === 'active');

  // Load teachers when component mounts
  useEffect(() => {
    fetchTeachers({ status: 'active', limit: 100 });
  }, [fetchTeachers]);

  // Update form when selected days change
  useEffect(() => {
    setValue('days_of_week', selectedDays);
  }, [selectedDays, setValue]);

  // Handle success/error after createClass completes
  useEffect(() => {
    if (isSubmitting && !isCreating) {
      if (error) {
        showError(error);
        setIsSubmitting(false);
      } else {
        success('Aula criada com sucesso!');
        navigate(AppRoutes.CLASSES);
        setIsSubmitting(false);
      }
    }
  }, [isSubmitting, isCreating, error, showError, success, navigate]);

  const onSubmit = async (data: CreateClassForm) => {
    try {
      const classData: Omit<Class, 'id' | 'created_at' | 'updated_at'> = {
        ...data,
        days_of_week: selectedDays,
        start_time: data.start_time, // API expects HH:MM format
        end_time: data.end_time, // API expects HH:MM format
        student_classes: [], // Initialize with empty array
      };

      // Clear any previous errors and set submitting state
      clearError();
      setIsSubmitting(true);

      await createClass(classData);
      
      // The useEffect will handle success/error after the store updates
    } catch (err) {
      // Handle validation or other errors
      const errorMessage = 'Erro ao criar aula. Verifique os dados e tente novamente.';
      showError(errorMessage);
      setIsSubmitting(false);
      console.error('Failed to create class:', err);
    }
  };

  const nextStep = useCallback(async (e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    
    const fieldsToValidate = getFieldsForStep(currentStep);
    const isValid = await trigger(fieldsToValidate);
    
    if (isValid && currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  }, [currentStep, totalSteps, trigger]);

  const prevStep = useCallback((e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  }, [currentStep]);

  const getFieldsForStep = (step: number): (keyof CreateClassForm)[] => {
    switch (step) {
      case 1:
        return ['name', 'description', 'teacher_id'];
      case 2:
        return ['days_of_week', 'start_time', 'end_time', 'max_students'];
      case 3:
        return ['belt_requirement', 'age_group', 'status'];
      default:
        return [];
    }
  };

  const getStepTitle = (step: number): string => {
    switch (step) {
      case 1: return 'Informações Básicas';
      case 2: return 'Horários e Capacidade';
      case 3: return 'Requisitos e Configurações';
      default: return '';
    }
  };

  const handleDayToggle = useCallback((dayValue: number) => {
    setSelectedDays(prev => {
      if (prev.includes(dayValue)) {
        return prev.filter(day => day !== dayValue);
      } else {
        return [...prev, dayValue].sort();
      }
    });
  }, []);

  const getSelectedTeacher = (): Teacher | undefined => {
    const teacherId = watch('teacher_id');
    return activeTeachers.find(teacher => teacher.id === teacherId);
  };

  const formatTimeForInput = (timeString: string): string => {
    if (!timeString) return '';
    try {
      const date = new Date(timeString);
      return date.toTimeString().slice(0, 5); 
    } catch {
      return timeString.slice(0, 5); 
    }
  };

  const formatTimeForSubmit = (timeString: string): string => {
    if (!timeString) return '';
    return timeString;
  };

  const dismissError = useCallback(() => {
    clearError();
  }, [clearError]);

  return {
    // Form
    form,
    register,
    handleSubmit,
    errors,
    watch,
    setValue,
    
    // Data
    activeTeachers,
    dayOptions,
    beltRequirements,
    ageGroups,
    selectedDays,
    
    // State
    currentStep,
    totalSteps,
    isCreating,
    error,
    
    // Actions
    onSubmit,
    nextStep,
    prevStep,
    handleDayToggle,
    dismissError,
    
    // Helpers
    getStepTitle,
    getSelectedTeacher,
    formatTimeForInput,
    formatTimeForSubmit,
  };
}; 