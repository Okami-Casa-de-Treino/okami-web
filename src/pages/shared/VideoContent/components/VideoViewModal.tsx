import React, { useEffect, useState, useRef } from 'react';
import { X, Play, Clock, Calendar, Tag, Users, AlertCircle } from 'lucide-react';
import { Video } from '../../../../types';

interface VideoViewModalProps {
  isOpen: boolean;
  onClose: () => void;
  video: Video | null;
}

export const VideoViewModal: React.FC<VideoViewModalProps> = ({
  isOpen,
  onClose,
  video,
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [videoError, setVideoError] = useState<string | null>(null);
  const [isVideoLoading, setIsVideoLoading] = useState(false);

  console.log('video', video);

  const formatDuration = (seconds?: number): string => {
    if (!seconds) return 'Desconhecido';
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  // Reset error state when video changes
  useEffect(() => {
    setVideoError(null);
    setIsVideoLoading(false);
  }, [video]);

  if (!isOpen || !video) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        {/* Backdrop */}
        <div className="fixed inset-0 transition-opacity backdrop-blur-sm" aria-hidden="true"></div>

        {/* Modal Content */}
        <div className="relative inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl sm:w-full">
          <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg leading-6 font-medium text-gray-900">
                Detalhes do Vídeo
              </h3>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <div className="space-y-6">
              {/* Video Player */}
              <div className="aspect-video rounded-lg overflow-hidden relative">
                {video.file_url ? (
                  <>
                    <video
                      ref={videoRef}
                      className="w-full h-full object-contain rounded-lg"
                      controls
                      preload="metadata"
                      poster={video.thumbnail_url}
                      onLoadStart={() => {
                        console.log('Video loading started');
                        setIsVideoLoading(true);
                        setVideoError(null);
                      }}
                      onCanPlay={() => {
                        console.log('Video can play');
                        setIsVideoLoading(false);
                        setVideoError(null);
                      }}
                      onError={(e) => {
                        console.error('Video error:', e);
                        const videoElement = e.currentTarget;
                        const error = videoElement.error;
                        let errorMessage = 'Falha ao carregar vídeo';
                        
                        if (error) {
                          switch (error.code) {
                            case MediaError.MEDIA_ERR_ABORTED:
                              errorMessage = 'Carregamento do vídeo foi interrompido';
                              break;
                            case MediaError.MEDIA_ERR_NETWORK:
                              errorMessage = 'Erro de rede ao carregar vídeo';
                              break;
                            case MediaError.MEDIA_ERR_DECODE:
                              errorMessage = 'Formato de vídeo não suportado';
                              break;
                            case MediaError.MEDIA_ERR_SRC_NOT_SUPPORTED:
                              errorMessage = 'Fonte do vídeo não suportada';
                              break;
                            default:
                              errorMessage = `Erro do vídeo: ${error.message || 'Erro desconhecido'}`;
                          }
                        }
                        
                        setVideoError(errorMessage);
                        setIsVideoLoading(false);
                      }}
                      style={{ 
                        backgroundColor: '#000',
                        objectFit: 'contain'
                      }}
                    >
                      <source src={video.file_url} type="video/mp4" />
                      <source src={video.file_url} type="video/webm" />
                      <source src={video.file_url} type="video/ogg" />
                      Seu navegador não suporta a tag de vídeo.
                    </video>
                    
                    {/* Loading overlay */}
                    {isVideoLoading && (
                      <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 pointer-events-none">
                        <div className="text-center">
                          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto"></div>
                          <p className="mt-2 text-sm text-white">Carregando vídeo...</p>
                        </div>
                      </div>
                    )}
                    

                    
                    {/* Error overlay */}
                    {videoError && (
                      <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-75">
                        <div className="text-center p-4">
                          <AlertCircle className="mx-auto h-12 w-12 text-red-400 mb-2" />
                          <p className="text-sm text-white mb-2">{videoError}</p>
                          <p className="text-xs text-gray-300">URL do Vídeo: {video.file_url}</p>
                          <button
                            onClick={() => {
                              setVideoError(null);
                              setIsVideoLoading(false);
                              if (videoRef.current) {
                                videoRef.current.load();
                              }
                            }}
                            className="mt-2 px-3 py-1 bg-blue-600 text-white text-xs rounded hover:bg-blue-700"
                          >
                            Tentar Novamente
                          </button>
                        </div>
                      </div>
                    )}
                  </>
                ) : video.thumbnail_url ? (
                  <div className="w-full h-full flex items-center justify-center relative">
                    <img
                      src={video.thumbnail_url}
                      alt={video.title}
                      className="w-full h-full object-cover rounded-lg"
                      style={{ opacity: 1 }}
                    />
                    <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30">
                      <div className="text-center">
                        <Play className="mx-auto h-16 w-16 text-white cursor-pointer" />
                        <p className="text-sm text-white">Vídeo não disponível</p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <div className="text-center">
                      <Play className="mx-auto h-16 w-16 text-gray-400 cursor-pointer" />
                      <p className="text-sm text-gray-400">Nenhum vídeo disponível</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Video Information */}
              <div className="space-y-4">
                <div>
                  <h4 className="text-xl font-semibold text-gray-900 mb-2">
                    {video.title}
                  </h4>
                  <p className="text-gray-600 leading-relaxed">
                    {video.description}
                  </p>
                </div>

                {/* Debug Info */}
                <div className="bg-gray-100 p-3 rounded-lg">
                  <p className="text-xs text-gray-600 mb-1">
                    <strong>URL do Vídeo:</strong> {video.file_url || 'Sem URL'}
                  </p>
                  <p className="text-xs text-gray-600 mb-1">
                    <strong>URL da Miniatura:</strong> {video.thumbnail_url || 'Sem miniatura'}
                  </p>
                  <p className="text-xs text-gray-600 mb-2">
                    <strong>Duração:</strong> {formatDuration(video.duration)}
                  </p>
                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        if (video.file_url) {
                          window.open(video.file_url, '_blank');
                        }
                      }}
                      className="px-2 py-1 bg-blue-500 text-white text-xs rounded hover:bg-blue-600"
                    >
                      Abrir Vídeo em Nova Aba
                    </button>
                    <button
                      onClick={() => {
                        if (video.thumbnail_url) {
                          window.open(video.thumbnail_url, '_blank');
                        }
                      }}
                      className="px-2 py-1 bg-green-500 text-white text-xs rounded hover:bg-green-600"
                    >
                      Abrir Miniatura em Nova Aba
                    </button>
                  </div>
                </div>

                {/* Metadata */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex items-center space-x-2">
                    <Clock className="h-4 w-4 text-gray-400" />
                    <span className="text-sm text-gray-600">
                      Duração: {formatDuration(video.duration)}
                    </span>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Calendar className="h-4 w-4 text-gray-400" />
                    <span className="text-sm text-gray-600">
                      Enviado: {formatDate(video.upload_date)}
                    </span>
                  </div>

                  {video.module && (
                    <div className="flex items-center space-x-2">
                      <Tag className="h-4 w-4 text-gray-400" />
                      <span className="text-sm text-gray-600">
                        Módulo: {video.module.name}
                      </span>
                    </div>
                  )}

                  <div className="flex items-center space-x-2">
                    <Users className="h-4 w-4 text-gray-400" />
                    <span className="text-sm text-gray-600">
                      {video.assigned_class ? (
                        <>Atribuído a: {video.assigned_class.name}</>
                      ) : (
                        <>Vídeo livre (não atribuído a nenhuma turma)</>
                      )}
                    </span>
                  </div>
                </div>

                {/* Module Badge */}
                {video.module && (
                  <div className="flex items-center space-x-2">
                    <span
                      className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium"
                      style={{
                        backgroundColor: `${video.module.color}20`,
                        color: video.module.color,
                      }}
                    >
                      {video.module.name}
                    </span>
                    {video.module.description && (
                      <span className="text-sm text-gray-500">
                        - {video.module.description}
                      </span>
                    )}
                  </div>
                )}

                {/* Assigned Class Badge */}
                {video.assigned_class && (
                  <div className="flex items-center space-x-2">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                      {video.assigned_class.name}
                    </span>
                    {video.assigned_class.description && (
                      <span className="text-sm text-gray-500">
                        - {video.assigned_class.description}
                      </span>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
            <button
              type="button"
              onClick={onClose}
              className="w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm"
            >
              Fechar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}; 