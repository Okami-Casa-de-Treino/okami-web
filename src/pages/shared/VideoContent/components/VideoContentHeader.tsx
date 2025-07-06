import React from 'react';
import { Upload, Video } from 'lucide-react';

interface VideoContentHeaderProps {
  onUploadClick: () => void;
  totalVideos: number;
}

export const VideoContentHeader: React.FC<VideoContentHeaderProps> = ({
  onUploadClick,
  totalVideos,
}) => {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="flex items-center justify-center w-12 h-12 bg-blue-100 rounded-lg">
            <Video className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Video Content</h1>
            <p className="text-sm text-gray-500">
              Manage and organize your martial arts videos
            </p>
          </div>
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="text-right">
            <p className="text-sm text-gray-500">Total Videos</p>
            <p className="text-2xl font-bold text-gray-900">{totalVideos}</p>
          </div>
          
          <button
            onClick={onUploadClick}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
          >
            <Upload className="w-4 h-4 mr-2" />
            Upload Video
          </button>
        </div>
      </div>
    </div>
  );
}; 