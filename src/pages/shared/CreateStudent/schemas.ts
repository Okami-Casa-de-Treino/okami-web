import { z } from 'zod';
import { isValidPhoneLength, isValidCPF, unformatPhoneNumber, unformatCPF } from '../../../utils/masks';
import { AGE_GROUPS, relationshipOptions } from '../../../utils';

export const StudentStatusEnum = z.enum(['active', 'inactive', 'suspended']);

export const AgeGroupEnum = z.enum(AGE_GROUPS as [string, ...string[]]);

export const RelationshipEnum = z.enum(relationshipOptions as [string, ...string[]]);

export const createStudentSchema = z.object({
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
    .min(1, 'Data de nascimento é obrigatória')
    .refine(
      (value) => {
        const date = new Date(value);
        const today = new Date();
        const age = today.getFullYear() - date.getFullYear();
        return age >= 4 && age <= 100;
      },
      'Idade deve estar entre 4 e 100 anos'
    ),
  
  // Step 2: Documents and Address
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
  
  rg: z
    .string()
    .optional()
    .refine(
      (value) => {
        if (!value) return true;
        return value.length >= 7;
      },
      'RG deve ter pelo menos 7 caracteres'
    ),
  
  address: z
    .string()
    .optional()
    .refine(
      (value) => {
        if (!value) return true;
        return value.length >= 10;
      },
      'Endereço deve ter pelo menos 10 caracteres'
    ),
  
  // Step 3: Emergency Contact
  emergency_contact_name: z
    .string()
    .optional()
    .refine(
      (value) => {
        if (!value) return true;
        return value.length >= 2;
      },
      'Nome do contato deve ter pelo menos 2 caracteres'
    ),
  
  emergency_contact_phone: z
    .string()
    .optional()
    .refine(
      (value) => {
        if (!value) return true;
        const unformatted = unformatPhoneNumber(value);
        return isValidPhoneLength(unformatted);
      },
      'Telefone deve ter entre 10 e 11 dígitos'
    ),
  
  emergency_contact_relationship: z
    .string()
    .optional(),
  
  medical_observations: z
    .string()
    .optional(),
  
  // Step 4: Student Settings
  age_group: AgeGroupEnum,
  
  belt: z
    .string(),
  
  belt_degree: z
    .number()
    .min(1, 'Grau mínimo é 1')
    .max(10, 'Grau máximo é 10'),
  
  status: StudentStatusEnum,
});

export type CreateStudentFormData = z.infer<typeof createStudentSchema>;

// Transform schema to handle masked inputs
export const createStudentTransformSchema = createStudentSchema.transform((data) => ({
  ...data,
  phone: unformatPhoneNumber(data.phone),
  cpf: data.cpf ? unformatCPF(data.cpf) : undefined,
  emergency_contact_phone: data.emergency_contact_phone ? unformatPhoneNumber(data.emergency_contact_phone) : undefined,
  // Remove age_group as it's only used for UI logic, not stored in database
}));

export type CreateStudentTransformData = z.infer<typeof createStudentTransformSchema>; 