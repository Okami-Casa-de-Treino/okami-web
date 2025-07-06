import React, { useEffect, useState, useRef } from 'react';
import { X, Play, Clock, Calendar, Tag, Users, AlertCircle, Download } from 'lucide-react';
import { Video } from '../../../../types';

interface VideoViewDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  video: Video | null;
}

export const VideoViewDrawer: React.FC<VideoViewDrawerProps> = ({
  isOpen,
  onClose,
  video,
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [videoError, setVideoError] = useState<string | null>(null);
  const [isVideoLoading, setIsVideoLoading] = useState(false);

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

  const formatFileSize = (bytes?: number): string => {
    if (!bytes) return '--';
    const mb = bytes / (1024 * 1024);
    return `${mb.toFixed(1)} MB`;
  };

  // Reset error state when video changes
  useEffect(() => {
    setVideoError(null);
    setIsVideoLoading(false);
  }, [video]);

  if (!isOpen || !video) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 backdrop-blur-xs z-40"
        onClick={onClose}
      />
      
      {/* Drawer */}
      <div className={`fixed inset-y-0 right-0 w-full max-w-2xl bg-white shadow-xl z-50 transform transition-transform duration-300 ease-in-out ${
        isOpen ? 'translate-x-0' : 'translate-x-full'
      }`}>
        <div className="h-full flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Play className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-900">Detalhes do Vídeo</h2>
                <p className="text-sm text-gray-600">Visualizar vídeo</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto">
            <div className="p-6 space-y-6">
              {/* Video Player */}
              <div className="aspect-video rounded-lg overflow-hidden relative bg-black">
                {video.file_url ? (
                  <>
                    <video
                      ref={videoRef}
                      className="w-full h-full object-contain rounded-lg"
                      controls
                      preload="metadata"
                      poster={video.thumbnail_url}
                      onLoadStart={() => {
                        setIsVideoLoading(true);
                        setVideoError(null);
                      }}
                      onCanPlay={() => {
                        setIsVideoLoading(false);
                        setVideoError(null);
                      }}
                      onError={(e) => {
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
                    />
                    <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30">
                      <div className="text-center">
                        <Play className="mx-auto h-16 w-16 text-white" />
                        <p className="text-sm text-white">Vídeo não disponível</p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <div className="text-center">
                      <Play className="mx-auto h-16 w-16 text-gray-400" />
                      <p className="text-sm text-gray-400">Nenhum vídeo disponível</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Video Information */}
              <div className="space-y-4">
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {video.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {video.description}
                  </p>
                </div>

                {/* Metadata */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="text-sm font-medium text-gray-700 mb-3">Informações do Vídeo</h4>
                  <div className="grid grid-cols-1 gap-3 text-sm">
                    <div className="flex items-center space-x-2">
                      <Clock className="h-4 w-4 text-gray-400" />
                      <span className="text-gray-600">
                        Duração: {formatDuration(video.duration)}
                      </span>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Calendar className="h-4 w-4 text-gray-400" />
                      <span className="text-gray-600">
                        Enviado: {formatDate(video.upload_date)}
                      </span>
                    </div>

                    {video.file_size && (
                      <div className="flex items-center space-x-2">
                        <Download className="h-4 w-4 text-gray-400" />
                        <span className="text-gray-600">
                          Tamanho: {formatFileSize(video.file_size)}
                        </span>
                      </div>
                    )}

                    {video.module && (
                      <div className="flex items-center space-x-2">
                        <Tag className="h-4 w-4 text-gray-400" />
                        <span className="text-gray-600">
                          Módulo: {video.module.name}
                        </span>
                      </div>
                    )}

                    <div className="flex items-center space-x-2">
                      <Users className="h-4 w-4 text-gray-400" />
                      <span className="text-gray-600">
                        {video.assigned_class ? (
                          <>Atribuído a: {video.assigned_class.name}</>
                        ) : (
                          <>Vídeo livre (não atribuído a nenhuma turma)</>
                        )}
                      </span>
                    </div>
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

                {/* Actions */}
                <div className="flex space-x-2 pt-4">
                  <button
                    onClick={() => {
                      if (video.file_url) {
                        window.open(video.file_url, '_blank');
                      }
                    }}
                    className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-sm"
                  >
                    Abrir em Nova Aba
                  </button>
                  <button
                    onClick={() => {
                      if (video.file_url) {
                        const link = document.createElement('a');
                        link.href = video.file_url;
                        link.download = video.title;
                        link.click();
                      }
                    }}
                    className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors text-sm"
                  >
                    <Download className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}; 