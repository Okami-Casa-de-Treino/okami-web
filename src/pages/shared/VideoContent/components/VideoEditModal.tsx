import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { X } from 'lucide-react';
import { Video, Module } from '../../../../types';
import { VideoUpdateFormData, videoUpdateSchema } from '../schemas';

interface VideoEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: VideoUpdateFormData) => Promise<void>;
  video: Video | null;
  modules: Module[];
}

export const VideoEditModal: React.FC<VideoEditModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  video,
  modules,
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<VideoUpdateFormData>({
    resolver: zodResolver(videoUpdateSchema),
    defaultValues: {
      title: video?.title || '',
      description: video?.description || '',
      module_id: video?.module_id || '',
      assigned_class_id: video?.assigned_class_id || '',
    },
  });

  // Reset form when video changes
  React.useEffect(() => {
    if (video) {
      reset({
        title: video.title,
        description: video.description,
        module_id: video.module_id,
        assigned_class_id: video.assigned_class_id,
      });
    }
  }, [video, reset]);

  const handleFormSubmit = async (data: VideoUpdateFormData) => {
    setIsSubmitting(true);
    try {
      await onSubmit(data);
      handleClose();
    } catch (error) {
      console.error('Update failed:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  if (!isOpen || !video) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 transition-opacity" aria-hidden="true">
          <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
        </div>

        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg leading-6 font-medium text-gray-900">
                Editar Vídeo
              </h3>
              <button
                onClick={handleClose}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
              {/* Title */}
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Título
                </label>
                <input
                  type="text"
                  {...register('title')}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder="Digite o título do vídeo"
                />
                {errors.title && (
                  <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>
                )}
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Descrição
                </label>
                <textarea
                  {...register('description')}
                  rows={3}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder="Digite a descrição do vídeo"
                />
                {errors.description && (
                  <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>
                )}
              </div>

              {/* Module */}
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Módulo
                </label>
                <select
                  {...register('module_id')}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                >
                  <option value="">Selecione um módulo</option>
                  {Array.isArray(modules) && modules.map((module) => (
                    <option key={module.id} value={module.id}>
                      {module.name}
                    </option>
                  ))}
                </select>
                {errors.module_id && (
                  <p className="mt-1 text-sm text-red-600">{errors.module_id.message}</p>
                )}
              </div>

              {/* Assigned Class (Optional) */}
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Atribuir à Turma (Opcional)
                </label>
                <select
                  {...register('assigned_class_id')}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                >
                  <option value="">Sem atribuição de turma</option>
                  {/* This would be populated with classes from the store */}
                </select>
                <p className="mt-1 text-xs text-gray-500">
                  Deixe vazio para tornar este um vídeo livre
                </p>
              </div>
            </form>
          </div>

          <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
            <button
              type="button"
              onClick={handleSubmit(handleFormSubmit)}
              disabled={isSubmitting}
              className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Salvando...' : 'Salvar Alterações'}
            </button>
            <button
              type="button"
              onClick={handleClose}
              className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
            >
              Cancelar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}; 