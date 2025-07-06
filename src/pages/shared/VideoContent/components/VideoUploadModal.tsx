import React, { useState, useEffect, useCallback } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { X, Upload, CheckCircle, AlertCircle, Loader2 } from "lucide-react";
import { Module } from "../../../../types";
import { VideoUploadFormData, videoUploadSchema } from "../schemas";
import { useVideoStore } from "../../../../stores/videoStore";

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
  const [isDragOver, setIsDragOver] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    reset,
    setValue,
    trigger,
  } = useForm<VideoUploadFormData>({
    resolver: zodResolver(videoUploadSchema),
    defaultValues: {
      title: "",
      description: "",
      module_id: "",
      assigned_class_id: "",
      file: undefined,
    },
    mode: "onChange",
  });

  // Reset form when modal opens
  useEffect(() => {
    if (isOpen) {
      reset();
      setSelectedFile(null);
      setUploadProgress(0);
      setIsDragOver(false);
    }
  }, [isOpen, reset]);

  // Handle escape key to close modal
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape" && isOpen) {
        handleClose();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      return () => document.removeEventListener("keydown", handleEscape);
    }
  }, [isOpen]);

  const handleFormSubmit = async (data: VideoUploadFormData) => {
    console.log("Form data on submit:", data);
    if (!data.file) return;
    setIsSubmitting(true);
    setUploadProgress(0);

    try {
      // Simulate upload progress
      const progressInterval = setInterval(() => {
        setUploadProgress((prev) => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 200);

      await useVideoStore.getState().createVideo(data);

      clearInterval(progressInterval);
      setUploadProgress(100);

      // Show success briefly before closing
      setTimeout(() => {
        onClose();
        reset();
        setSelectedFile(null);
        setUploadProgress(0);
      }, 1000);
    } catch (error) {
      console.error("Upload failed:", error);
      setUploadProgress(0);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (!isSubmitting) {
      reset();
      setSelectedFile(null);
      setUploadProgress(0);
      onClose();
    }
  };

  const handleFileSelect = useCallback(
    (file: File) => {
      setSelectedFile(file);
      setValue("file", file, { shouldValidate: true });
      trigger("file");
    },
    [setValue, trigger]
  );

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragOver(false);

      const files = e.dataTransfer.files;
      if (files.length > 0) {
        const file = files[0];
        if (file.type.startsWith("video/")) {
          handleFileSelect(file);
        }
      }
    },
    [handleFileSelect]
  );

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        {/* Enhanced backdrop with blur and animation */}
        <div
          className={`fixed inset-0 transition-all duration-300 ${
            isOpen
              ? "backdrop-blur-md bg-black/30"
              : "backdrop-blur-none bg-transparent"
          }`}
          aria-hidden="true"
          onClick={handleClose}
        />

        {/* Modal content with enhanced styling */}
        <div
          className={`inline-block align-bottom bg-white rounded-2xl text-left overflow-hidden shadow-2xl transform transition-all duration-300 sm:my-8 sm:align-middle sm:max-w-2xl w-full p-8 relative z-10 ${
            isOpen ? "scale-100 opacity-100" : "scale-95 opacity-0"
          }`}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-2xl font-bold text-gray-900">
                Enviar Novo Vídeo
              </h3>
              <p className="text-sm text-gray-500 mt-1">
                Faça upload de um vídeo para sua biblioteca
              </p>
            </div>
            <button
              onClick={handleClose}
              disabled={isSubmitting}
              className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors disabled:opacity-50"
              aria-label="Fechar modal"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
            {/* Enhanced File Upload */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                Arquivo de Vídeo *
              </label>
              <div
                className={`relative mt-1 flex justify-center px-6 pt-8 pb-8 border-2 border-dashed rounded-xl transition-all duration-200 cursor-pointer ${
                  isDragOver
                    ? "border-blue-400 bg-blue-50"
                    : selectedFile
                    ? "border-green-300 bg-green-50"
                    : "border-gray-300 hover:border-gray-400 hover:bg-gray-50"
                }`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
              >
                <div className="space-y-3 text-center">
                  {selectedFile ? (
                    <div className="flex flex-col items-center">
                      <div className="flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-3">
                        <CheckCircle className="h-8 w-8 text-green-600" />
                      </div>
                      <div className="text-sm font-medium text-gray-900">
                        {selectedFile.name}
                      </div>
                      <div className="text-xs text-gray-500">
                        {formatFileSize(selectedFile.size)}
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedFile(null);
                          setValue("file", undefined as unknown as File);
                        }}
                        className="mt-2 text-xs text-red-600 hover:text-red-700 font-medium"
                      >
                        Remover arquivo
                      </button>
                    </div>
                  ) : (
                    <>
                      <div
                        className={`flex items-center justify-center w-16 h-16 rounded-full mb-3 transition-colors ${
                          isDragOver ? "bg-blue-100" : "bg-gray-100"
                        }`}
                      >
                        <Upload
                          className={`h-8 w-8 transition-colors ${
                            isDragOver ? "text-blue-600" : "text-gray-400"
                          }`}
                        />
                      </div>
                      <div className="space-y-2">
                        <div className="flex text-sm text-gray-600 justify-center">
                          <label className="relative cursor-pointer font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500">
                            <span>Clique para selecionar</span>
                            <input
                              type="file"
                              accept="video/*"
                              {...register("file", { required: true })}
                              onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) {
                                  handleFileSelect(file);
                                }
                              }}
                              className="sr-only"
                            />
                          </label>
                          <span className="text-gray-500">
                            {" "}
                            ou arraste e solte
                          </span>
                        </div>
                        <p className="text-xs text-gray-500">
                          MP4, AVI, MOV até 500MB
                        </p>
                      </div>
                    </>
                  )}
                </div>
              </div>
              {errors.file && (
                <div className="flex items-center mt-2 text-sm text-red-600">
                  <AlertCircle className="h-4 w-4 mr-1" />
                  {errors.file.message || "Arquivo de vídeo é obrigatório"}
                </div>
              )}
            </div>

            {/* Upload Progress */}
            {isSubmitting && (
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Enviando vídeo...</span>
                  <span className="text-gray-900 font-medium">
                    {uploadProgress}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${uploadProgress}%` }}
                  />
                </div>
              </div>
            )}

            {/* Title */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Título *
              </label>
              <input
                type="text"
                {...register("title")}
                className="block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                placeholder="Digite o título do vídeo"
              />
              {errors.title && (
                <div className="flex items-center mt-2 text-sm text-red-600">
                  <AlertCircle className="h-4 w-4 mr-1" />
                  {errors.title.message}
                </div>
              )}
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Descrição
              </label>
              <textarea
                {...register("description")}
                rows={3}
                className="block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors resize-none"
                placeholder="Digite a descrição do vídeo (opcional)"
              />
              {errors.description && (
                <div className="flex items-center mt-2 text-sm text-red-600">
                  <AlertCircle className="h-4 w-4 mr-1" />
                  {errors.description.message}
                </div>
              )}
            </div>

            {/* Module */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Módulo *
              </label>
              <select
                {...register("module_id")}
                className="block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              >
                <option value="">Selecione um módulo</option>
                {Array.isArray(modules) &&
                  modules.map((module) => (
                    <option key={module.id} value={module.id}>
                      {module.name}
                    </option>
                  ))}
              </select>
              {errors.module_id && (
                <div className="flex items-center mt-2 text-sm text-red-600">
                  <AlertCircle className="h-4 w-4 mr-1" />
                  {errors.module_id.message}
                </div>
              )}
            </div>

            {/* Assigned Class (Optional) */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Atribuir à Turma
              </label>
              <select
                {...register("assigned_class_id")}
                className="block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              >
                <option value="">Sem atribuição de turma</option>
                {/* This would be populated with classes from the store */}
              </select>
              <p className="mt-2 text-xs text-gray-500">
                Deixe vazio para tornar este um vídeo livre
              </p>
            </div>
          </form>

          {/* Enhanced Footer */}
          <div className="mt-8 flex flex-col sm:flex-row sm:justify-end sm:space-x-3 space-y-3 sm:space-y-0">
            <button
              type="button"
              onClick={handleClose}
              disabled={isSubmitting}
              className="w-full sm:w-auto px-6 py-3 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancelar
            </button>
            <button
              type="button"
              onClick={handleSubmit(handleFormSubmit)}
              disabled={isSubmitting || !isValid || !selectedFile}
              className="w-full sm:w-auto px-6 py-3 border border-transparent rounded-lg text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Enviando...
                </>
              ) : (
                "Enviar Vídeo"
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
