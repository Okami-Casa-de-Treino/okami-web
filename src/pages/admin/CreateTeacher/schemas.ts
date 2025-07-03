import { z } from 'zod';
import { isValidPhoneLength, isValidCPF, unformatPhoneNumber, unformatCPF } from '../../../utils/masks';

// Martial arts belts enum
export const BeltEnum = z.enum([
  'Branca',
  'Azul',
  'Roxa',
  'Marrom',
  'Preta',
  'Coral',
  'Vermelha'
]);

// Teacher status enum
export const TeacherStatusEnum = z.enum(['active', 'inactive']);

// Available specialties
export const SpecialtiesEnum = z.enum([
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
]);

// Helper function to get max degree for a belt
const getMaxDegreeForBelt = (belt: string): number => {
  switch (belt) {
    case 'Branca':
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

// Create Teacher form schema
export const createTeacherSchema = z.object({
  // Step 1: Basic Information
  full_name: z
    .string()
    .min(1, 'Nome completo é obrigatório')
    .min(2, 'Nome deve ter pelo menos 2 caracteres')
    .max(100, 'Nome deve ter no máximo 100 caracteres'),
  
  email: z
    .string()
    .min(1, 'E-mail é obrigatório')
    .email('E-mail inválido')
    .max(100, 'E-mail deve ter no máximo 100 caracteres'),
  
  phone: z
    .string()
    .min(1, 'Telefone é obrigatório')
    .refine(
      (value) => {
        const unformatted = unformatPhoneNumber(value);
        return isValidPhoneLength(unformatted);
      },
      'Telefone deve ter entre 10 e 11 dígitos'
    ),
  
  birth_date: z
    .string()
    .optional()
    .refine(
      (value) => {
        if (!value) return true;
        const date = new Date(value);
        const today = new Date();
        const age = today.getFullYear() - date.getFullYear();
        return age >= 16 && age <= 100;
      },
      'Idade deve estar entre 16 e 100 anos'
    ),
  
  cpf: z
    .string()
    .optional()
    .refine(
      (value) => {
        if (!value) return true;
        const unformatted = unformatCPF(value);
        return isValidCPF(unformatted);
      },
      'CPF inválido'
    ),
  
  // Step 2: Qualifications and Specialties
  belt: BeltEnum.default('Branca'),
  
  belt_degree: z
    .number()
    .min(1, 'Grau mínimo é 1')
    .max(10, 'Grau máximo é 10')
    .default(1),
  
  specialties: z
    .array(SpecialtiesEnum)
    .default([]),
  
  hourly_rate: z
    .number()
    .min(0, 'Valor deve ser positivo')
    .max(999999, 'Valor muito alto')
    .optional(),
  
  // Step 3: Teacher Settings
  status: TeacherStatusEnum.default('active'),
}).refine(
  (data) => {
    // Validate belt degree based on belt
    const maxDegree = getMaxDegreeForBelt(data.belt);
    return data.belt_degree <= maxDegree;
  },
  {
    message: 'Grau inválido para a faixa selecionada',
    path: ['belt_degree'],
  }
);

export type CreateTeacherFormData = z.infer<typeof createTeacherSchema>;

// Transform schema to handle masked inputs
export const createTeacherTransformSchema = createTeacherSchema.transform((data) => ({
  ...data,
  phone: unformatPhoneNumber(data.phone),
  cpf: data.cpf ? unformatCPF(data.cpf) : undefined,
  specialties: data.specialties && data.specialties.length > 0 ? data.specialties : undefined,
}));

export type CreateTeacherTransformData = z.infer<typeof createTeacherTransformSchema>; 