import React from 'react';
import { AlertCircle, X } from 'lucide-react';

interface ErrorDisplayProps {
  error: string | null;
  onClearError: () => void;
}

export const ErrorDisplay: React.FC<ErrorDisplayProps> = ({ error, onClearError }) => {
  if (!error) return null;

  return (
    <div className="bg-red-50 border border-red-200 rounded-lg p-4">
      <div className="flex items-start gap-3">
        <AlertCircle className="text-red-600 mt-0.5" size={20} />
        <div className="flex-1">
          <h3 className="text-sm font-medium text-red-800">Erro</h3>
          <p className="text-sm text-red-700 mt-1">{error}</p>
        </div>
        <button
          onClick={onClearError}
          className="text-red-600 hover:text-red-800 transition-colors"
        >
          <X size={20} />
        </button>
      </div>
    </div>
  );
}; 