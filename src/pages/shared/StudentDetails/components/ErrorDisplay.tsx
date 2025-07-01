import React from 'react';
import { AlertCircle } from 'lucide-react';

interface ErrorDisplayProps {
  error: string | null;
  onClearError: () => void;
}

export const ErrorDisplay: React.FC<ErrorDisplayProps> = ({ error, onClearError }) => {
  if (!error) return null;

  return (
    <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6 flex items-center justify-between">
      <span className="flex items-center">
        <AlertCircle size={16} className="mr-2" />
        {error}
      </span>
      <button 
        type="button"
        onClick={onClearError}
        className="text-red-500 hover:text-red-700 ml-4"
      >
        ×
      </button>
    </div>
  );
}; 