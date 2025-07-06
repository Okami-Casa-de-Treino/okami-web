import { z } from 'zod';

export const videoUploadSchema = z.object({
  title: z.string()
    .min(1, 'Title is required')
    .max(100, 'Title must be less than 100 characters'),
  description: z.string()
    .min(1, 'Description is required')
    .max(500, 'Description must be less than 500 characters'),
  file: z.instanceof(File, { message: 'Video file is required' })
    .refine((file) => file.size <= 500 * 1024 * 1024, 'File size must be less than 500MB')
    .refine((file) => file.type.startsWith('video/'), 'File must be a video'),
  module_id: z.string().min(1, 'Module is required'),
  assigned_class_id: z.string().optional(),
});

export const videoUpdateSchema = z.object({
  title: z.string()
    .min(1, 'Title is required')
    .max(100, 'Title must be less than 100 characters')
    .optional(),
  description: z.string()
    .min(1, 'Description is required')
    .max(500, 'Description must be less than 500 characters')
    .optional(),
  module_id: z.string().min(1, 'Module is required').optional(),
  assigned_class_id: z.string().optional(),
});

export const moduleSchema = z.object({
  name: z.string()
    .min(1, 'Module name is required')
    .max(50, 'Module name must be less than 50 characters'),
  description: z.string()
    .min(1, 'Description is required')
    .max(200, 'Description must be less than 200 characters'),
  color: z.string()
    .min(1, 'Color is required')
    .regex(/^#[0-9A-F]{6}$/i, 'Color must be a valid hex color'),
  order: z.number()
    .min(0, 'Order must be a positive number')
    .int('Order must be an integer'),
});

export type VideoUploadFormData = z.infer<typeof videoUploadSchema>;
export type VideoUpdateFormData = z.infer<typeof videoUpdateSchema>;
export type ModuleFormData = z.infer<typeof moduleSchema>; 