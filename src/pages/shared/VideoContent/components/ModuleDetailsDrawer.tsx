import React, { useEffect, useState } from 'react';
import { X, Play, Clock, Calendar, Download, Eye } from 'lucide-react';
import { Module, Video } from '../../../../types';
import { videoService } from '../../../../services/videoService';

interface ModuleDetailsDrawerProps {
  isOpen: boolean;
  module: Module | null;
  onClose: () => void;
}

export const ModuleDetailsDrawer: React.FC<ModuleDetailsDrawerProps> = ({
  isOpen,
  module,
  onClose,
}) => {
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen && module) {
      fetchModuleVideos();
    }
  }, [isOpen, module]);

  const fetchModuleVideos = async () => {
    if (!module) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const moduleVideos = await videoService.getByModule(module.id);
      // Ensure videos is always an array
      setVideos(Array.isArray(moduleVideos) ? moduleVideos : []);
    } catch (err) {
      setError('Erro ao carregar vídeos do módulo');
      console.error('Error fetching module videos:', err);
      setVideos([]); // Set empty array on error
    } finally {
      setLoading(false);
    }
  };

  const formatDuration = (seconds?: number): string => {
    if (!seconds) return '--:--';
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const formatFileSize = (bytes?: number): string => {
    if (!bytes) return '--';
    const mb = bytes / (1024 * 1024);
    return `${mb.toFixed(1)} MB`;
  };

  if (!isOpen || !module) return null;

  // Ensure videos is always an array
  const videosArray = Array.isArray(videos) ? videos : [];

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
              <div 
                className="w-8 h-8 rounded-full flex items-center justify-center"
                style={{ backgroundColor: module.color }}
              >
                <Play className="w-4 h-4 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-900">{module.name}</h2>
                <p className="text-sm text-gray-600">Detalhes do Módulo</p>
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
              {/* Module Stats */}
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">{videosArray.length}</div>
                    <div className="text-sm text-gray-600">Vídeos</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">
                      {videosArray.reduce((total, video) => total + (video.duration || 0), 0) > 0 
                        ? formatDuration(videosArray.reduce((total, video) => total + (video.duration || 0), 0))
                        : '--:--'
                      }
                    </div>
                    <div className="text-sm text-gray-600">Duração Total</div>
                  </div>
                </div>
              </div>

              {/* Module Info */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-3">Informações</h3>
                <div className="space-y-3">
                  <div>
                    <h4 className="text-sm font-medium text-gray-700 mb-1">Descrição</h4>
                    <p className="text-gray-900">{module.description}</p>
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="flex items-center">
                      <Calendar className="w-4 h-4 mr-2 text-gray-500" />
                      <span className="text-gray-600">
                        {new Date(module.created_at).toLocaleDateString('pt-BR')}
                      </span>
                    </div>
                    <div className="flex items-center">
                      <Clock className="w-4 h-4 mr-2 text-gray-500" />
                      <span className="text-gray-600">Ordem: {module.order_index}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Videos Section */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-3">
                  Vídeos ({videosArray.length})
                </h3>

                {loading && (
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="mt-2 text-sm text-gray-600">Carregando vídeos...</p>
                  </div>
                )}

                {error && (
                  <div className="text-center py-8">
                    <p className="text-red-600 text-sm">{error}</p>
                    <button
                      onClick={fetchModuleVideos}
                      className="mt-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm"
                    >
                      Tentar novamente
                    </button>
                  </div>
                )}

                {!loading && !error && videosArray.length === 0 && (
                  <div className="text-center py-8">
                    <div className="mx-auto h-12 w-12 text-gray-400">
                      <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <h4 className="mt-2 text-sm font-medium text-gray-900">Nenhum vídeo encontrado</h4>
                    <p className="mt-1 text-sm text-gray-500">
                      Este módulo ainda não possui vídeos.
                    </p>
                  </div>
                )}

                {!loading && !error && videosArray.length > 0 && (
                  <div className="space-y-3">
                    {videosArray.map((video) => (
                      <div key={video.id} className="bg-white border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors">
                        <div className="flex items-start space-x-3">
                          {video.thumbnail_url && (
                            <img
                              src={video.thumbnail_url}
                              alt={video.title}
                              className="w-16 h-10 object-cover rounded flex-shrink-0"
                            />
                          )}
                          <div className="flex-1 min-w-0">
                            <h4 className="text-sm font-medium text-gray-900 truncate">
                              {video.title}
                            </h4>
                            <p className="text-sm text-gray-500 mt-1 line-clamp-2">
                              {video.description}
                            </p>
                            <div className="flex items-center space-x-4 mt-2 text-xs text-gray-500">
                              <span>{formatDuration(video.duration)}</span>
                              <span>{formatFileSize(video.file_size)}</span>
                              <span>{new Date(video.upload_date).toLocaleDateString('pt-BR')}</span>
                            </div>
                          </div>
                          <div className="flex items-center space-x-1">
                            <button
                              onClick={() => window.open(video.file_url, '_blank')}
                              className="p-1 text-blue-600 hover:text-blue-900 hover:bg-blue-50 rounded"
                              title="Assistir"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => {
                                const link = document.createElement('a');
                                link.href = video.file_url;
                                link.download = video.title;
                                link.click();
                              }}
                              className="p-1 text-green-600 hover:text-green-900 hover:bg-green-50 rounded"
                              title="Download"
                            >
                              <Download className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}; 