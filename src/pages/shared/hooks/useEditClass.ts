import { useEffect, useState, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { useParams, useNavigate } from 'react-router-dom';
import { useClassStore, useTeacherStore } from '../../../stores';
import { Class, Teacher } from '../../../types';
import { AppRoutes } from '../../../routes/routes.constants';

export interface EditClassForm {
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

export const useEditClass = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const { 
    fetchClassById, 
    updateClass, 
    selectedClass,
    isLoading,
    isUpdating,
    error,
    clearError 
  } = useClassStore();
  
  const { fetchTeachers, teachers } = useTeacherStore();
  
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedDays, setSelectedDays] = useState<number[]>([]);
  const [isDataLoaded, setIsDataLoaded] = useState(false);
  const totalSteps = 3;

  const form = useForm<EditClassForm>({
    defaultValues: {
      status: 'active',
      max_students: 20,
      days_of_week: [],
      belt_requirement: 'Todas as faixas',
      age_group: 'Adulto'
    }
  });

  const { register, handleSubmit, formState: { errors }, trigger, watch, setValue, reset } = form;

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

  // Load class data and teachers when component mounts
  useEffect(() => {
    if (id) {
      fetchClassById(id);
    }
    fetchTeachers({ status: 'active', limit: 100 });
  }, [id, fetchClassById, fetchTeachers]);

  // Populate form when class data is loaded
  useEffect(() => {
    if (selectedClass && !isDataLoaded) {
      const formatTimeForInput = (timeString: string): string => {
        if (!timeString) return '';
        try {
          // Handle both ISO format and HH:MM format
          if (timeString.includes('T')) {
            const date = new Date(timeString);
            return date.toTimeString().slice(0, 5);
          }
          return timeString.slice(0, 5);
        } catch {
          return timeString;
        }
      };

      reset({
        name: selectedClass.name,
        description: selectedClass.description || '',
        teacher_id: selectedClass.teacher_id || '',
        start_time: formatTimeForInput(selectedClass.start_time),
        end_time: formatTimeForInput(selectedClass.end_time),
        max_students: selectedClass.max_students,
        belt_requirement: selectedClass.belt_requirement || 'Todas as faixas',
        age_group: selectedClass.age_group || 'Adulto',
        status: selectedClass.status,
        days_of_week: selectedClass.days_of_week
      });

      setSelectedDays(selectedClass.days_of_week || []);
      setIsDataLoaded(true);
    }
  }, [selectedClass, reset, isDataLoaded]);

  // Update form when selected days change
  useEffect(() => {
    setValue('days_of_week', selectedDays);
  }, [selectedDays, setValue]);

  const onSubmit = async (data: EditClassForm) => {
    if (!id) return;
    
    try {
      const classData: Partial<Class> = {
        ...data,
        days_of_week: selectedDays,
        start_time: data.start_time, // API expects HH:MM format
        end_time: data.end_time, // API expects HH:MM format
      };

      await updateClass(id, classData);
      navigate(AppRoutes.CLASSES, { 
        state: { message: 'Aula atualizada com sucesso!' }
      });
    } catch (err) {
      // Error is handled by the store
      console.error('Failed to update class:', err);
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

  const getFieldsForStep = (step: number): (keyof EditClassForm)[] => {
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

  const dismissError = useCallback(() => {
    clearError();
  }, [clearError]);

  const handleCancel = useCallback(() => {
    navigate(AppRoutes.CLASSES);
  }, [navigate]);

  return {
    // Form
    form,
    register,
    handleSubmit,
    errors,
    watch,
    setValue,
    
    // Data
    selectedClass,
    activeTeachers,
    dayOptions,
    beltRequirements,
    ageGroups,
    selectedDays,
    
    // State
    currentStep,
    totalSteps,
    isLoading,
    isUpdating,
    error,
    isDataLoaded,
    
    // Actions
    onSubmit,
    nextStep,
    prevStep,
    handleDayToggle,
    dismissError,
    handleCancel,
    
    // Helpers
    getStepTitle,
    getSelectedTeacher,
  };
}; 