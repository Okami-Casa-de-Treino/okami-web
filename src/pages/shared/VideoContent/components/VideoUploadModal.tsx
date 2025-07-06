import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { X, Upload, FileVideo } from 'lucide-react';
import { Module } from '../../../../types';
import { VideoUploadFormData, videoUploadSchema } from '../schemas';
import { useVideoStore } from '../../../../stores/videoStore';

interface VideoUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  modules: Module[];
}

export const VideoUploadModal: React.FC<VideoUploadModalProps> = ({
  isOpen,
  onClose,
  modules,
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    trigger,
  } = useForm<VideoUploadFormData>({
    resolver: zodResolver(videoUploadSchema),
    defaultValues: {
      title: '',
      description: '',
      moduleId: '',
      assignedClassId: '',
      file: undefined,
    },
  });

  // Reset form when modal opens
  useEffect(() => {
    if (isOpen) {
      reset();
      setSelectedFile(null);
    }
  }, [isOpen, reset]);

  // Handle escape key to close modal
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isOpen) {
        handleClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      return () => document.removeEventListener('keydown', handleEscape);
    }
  }, [isOpen]);

  const handleFormSubmit = async (data: VideoUploadFormData) => {
    console.log('Form data on submit:', data);
    if (!data.file) return;
    setIsSubmitting(true);
    try {
      await useVideoStore.getState().createVideo(data);
      onClose();
      reset();
      setSelectedFile(null);
    } catch (error) {
      console.error('Upload failed:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    reset();
    setSelectedFile(null);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        {/* Backdrop with blur only */}
        <div 
          className="fixed inset-0 backdrop-blur-sm transition-opacity" 
          aria-hidden="true"
          onClick={handleClose}
        />
        {/* Modal content: larger, more padding */}
        <div 
          className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl w-full p-8 relative z-10"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="bg-white pb-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-2xl leading-6 font-bold text-gray-900">
                Upload New Video
              </h3>
              <button
                onClick={handleClose}
                className="text-gray-400 hover:text-gray-600"
                aria-label="Close modal"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
              {/* File Upload */}
              <div>
                <label className="block text-base font-medium text-gray-700 mb-2">
                  Video File
                </label>
                <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                  <div className="space-y-1 text-center">
                    {selectedFile ? (
                      <div className="flex items-center justify-center">
                        <FileVideo className="mx-auto h-12 w-12 text-green-500" />
                        <div className="ml-2 text-sm text-gray-600">
                          {selectedFile.name}
                        </div>
                      </div>
                    ) : (
                      <>
                        <Upload className="mx-auto h-12 w-12 text-gray-400" />
                        <div className="flex text-sm text-gray-600">
                          <label className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500">
                            <span>Upload a video</span>
                            <input
                              type="file"
                              accept="video/*"
                              {...register('file', { required: true })}
                              onChange={e => {
                                const file = e.target.files?.[0];
                                if (file) {
                                  setSelectedFile(file);
                                  setValue('file', file, { shouldValidate: true });
                                  trigger('file');
                                }
                              }}
                              className="sr-only"
                            />
                          </label>
                          <p className="pl-1">or drag and drop</p>
                        </div>
                        <p className="text-xs text-gray-500">MP4, AVI, MOV up to 500MB</p>
                      </>
                    )}
                  </div>
                </div>
                {errors.file && (
                  <p className="mt-1 text-sm text-red-600">{errors.file.message || 'Video file is required'}</p>
                )}
              </div>

              {/* Title */}
              <div>
                <label className="block text-base font-medium text-gray-700">
                  Title
                </label>
                <input
                  type="text"
                  {...register('title')}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-base"
                  placeholder="Enter video title"
                />
                {errors.title && (
                  <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>
                )}
              </div>

              {/* Description */}
              <div>
                <label className="block text-base font-medium text-gray-700">
                  Description
                </label>
                <textarea
                  {...register('description')}
                  rows={3}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-base"
                  placeholder="Enter video description"
                />
                {errors.description && (
                  <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>
                )}
              </div>

              {/* Module */}
              <div>
                <label className="block text-base font-medium text-gray-700">
                  Module
                </label>
                <select
                  {...register('moduleId')}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-base"
                >
                  <option value="">Select a module</option>
                  {Array.isArray(modules) && modules.map((module) => (
                    <option key={module.id} value={module.id}>
                      {module.name}
                    </option>
                  ))}
                </select>
                {errors.moduleId && (
                  <p className="mt-1 text-sm text-red-600">{errors.moduleId.message}</p>
                )}
              </div>

              {/* Assigned Class (Optional) */}
              <div>
                <label className="block text-base font-medium text-gray-700">
                  Assign to Class (Optional)
                </label>
                <select
                  {...register('assignedClassId')}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-base"
                >
                  <option value="">No class assignment</option>
                  {/* This would be populated with classes from the store */}
                </select>
                <p className="mt-1 text-xs text-gray-500">
                  Leave empty to make this a free video
                </p>
              </div>
            </form>
          </div>

          <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
            <button
              type="button"
              onClick={handleSubmit(handleFormSubmit)}
              disabled={isSubmitting}
              className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-base disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Uploading...' : 'Upload Video'}
            </button>
            <button
              type="button"
              onClick={handleClose}
              className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-base"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}; 