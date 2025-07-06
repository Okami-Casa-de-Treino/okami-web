import { z } from 'zod';

export const videoUploadSchema = z.object({
  title: z.string()
    .min(1, 'Título é obrigatório')
    .max(100, 'Título deve ter menos de 100 caracteres'),
  description: z.string()
    .min(1, 'Descrição é obrigatória')
    .max(500, 'Descrição deve ter menos de 500 caracteres'),
  file: z.instanceof(File, { message: 'Arquivo de vídeo é obrigatório' })
    .refine((file) => file.size <= 500 * 1024 * 1024, 'Tamanho do arquivo deve ser menor que 500MB')
    .refine((file) => file.type.startsWith('video/'), 'Arquivo deve ser um vídeo'),
  module_id: z.string().min(1, 'Módulo é obrigatório'),
  assigned_class_id: z.string().optional(),
});

export const videoUpdateSchema = z.object({
  title: z.string()
    .min(1, 'Título é obrigatório')
    .max(100, 'Título deve ter menos de 100 caracteres')
    .optional(),
  description: z.string()
    .min(1, 'Descrição é obrigatória')
    .max(500, 'Descrição deve ter menos de 500 caracteres')
    .optional(),
  module_id: z.string().min(1, 'Módulo é obrigatório').optional(),
  assigned_class_id: z.string().optional(),
});

export const moduleSchema = z.object({
  name: z.string()
    .min(1, 'Nome do módulo é obrigatório')
    .max(50, 'Nome do módulo deve ter menos de 50 caracteres'),
  description: z.string()
    .min(1, 'Descrição é obrigatória')
    .max(200, 'Descrição deve ter menos de 200 caracteres'),
  color: z.string()
    .min(1, 'Cor é obrigatória')
    .regex(/^#[0-9A-F]{6}$/i, 'Cor deve ser um código hexadecimal válido'),
  order: z.number()
    .min(0, 'Ordem deve ser um número positivo')
    .int('Ordem deve ser um número inteiro'),
});

export type VideoUploadFormData = z.infer<typeof videoUploadSchema>;
export type VideoUpdateFormData = z.infer<typeof videoUpdateSchema>;
export type ModuleFormData = z.infer<typeof moduleSchema>; 