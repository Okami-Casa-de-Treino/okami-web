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
import { AppRoutes } from '../../../../routes/routes.constants';

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
      belt_degree: 0,
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

  // Address/CEP state
  const [cep, setCep] = useState('');
  const [street, setStreet] = useState('');
  const [number, setNumber] = useState('');
  const [neighborhood, setNeighborhood] = useState('');
  const [city, setCity] = useState('');
  const [uf, setUf] = useState('');
  const [addressLoading, setAddressLoading] = useState(false);
  const [addressError, setAddressError] = useState<string | null>(null);

  // Compose address string
  useEffect(() => {
    if (street || number || neighborhood || city || uf) {
      const composed = `${street}${number ? ', ' + number : ''}${neighborhood ? ' - ' + neighborhood : ''}${city ? ' - ' + city : ''}${uf ? ' - ' + uf : ''}`;
      setValue('address', composed);
    }
  }, [street, number, neighborhood, city, uf, setValue]);

  useEffect(() => {
    if (isSubmitting && !isCreating) {
      if (error) {
        showError(error);
        setIsSubmitting(false);
      } else {
        success('Aluno criado com sucesso!');
        navigate(AppRoutes.STUDENTS);
        setIsSubmitting(false);
      }
    }
  }, [isSubmitting, isCreating, error, showError, success, navigate]);

  const onSubmit = async (data: CreateStudentFormData) => {
    // Only allow submission if we're on the last step
    if (currentStep !== totalSteps) {
      return;
    }
    // Compose address before submit
    if (street || number || neighborhood || city || uf) {
      const composed = `${street}${number ? ', ' + number : ''}${neighborhood ? ' - ' + neighborhood : ''}${city ? ' - ' + city : ''}${uf ? ' - ' + uf : ''}`;
      setValue('address', composed);
      data.address = composed;
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
        return ['full_name', 'email', 'password', 'phone', 'birth_date'];
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

  // Handler for CEP input change
  const handleCepChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '');
    setCep(value);
    setAddressError(null);
    if (value.length === 8) {
      setAddressLoading(true);
      try {
        const res = await fetch(`https://viacep.com.br/ws/${value}/json/`);
        const data = await res.json();
        if (data.erro) {
          setAddressError('CEP não encontrado');
          setStreet('');
          setNeighborhood('');
          setCity('');
          setUf('');
        } else {
          setStreet(data.logradouro || '');
          setNeighborhood(data.bairro || '');
          setCity(data.localidade || '');
          setUf(data.uf || '');
        }
      } catch (err) {
        setAddressError('Erro ao buscar CEP');
        setStreet('');
        setNeighborhood('');
        setCity('');
        setUf('');
      } finally {
        setAddressLoading(false);
      }
    }
  };

  // Handler for address subfields
  const handleAddressFieldChange = (field: string, value: string) => {
    switch (field) {
      case 'street': setStreet(value); break;
      case 'number': setNumber(value); break;
      case 'neighborhood': setNeighborhood(value); break;
      case 'city': setCity(value); break;
      case 'uf': setUf(value); break;
      default: break;
    }
  };

  const goBack = () => {
    navigate(AppRoutes.STUDENTS);
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
    
    // Address/CEP
    cep,
    street,
    number,
    neighborhood,
    city,
    uf,
    addressLoading,
    addressError,
    handleCepChange,
    handleAddressFieldChange,
  };
}; 