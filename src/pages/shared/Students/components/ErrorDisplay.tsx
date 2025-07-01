import React from 'react';

interface ErrorDisplayProps {
  error: string | null;
  onClearError: () => void;
}

export const ErrorDisplay: React.FC<ErrorDisplayProps> = ({ error, onClearError }) => {
  if (!error) return null;

  return (
    <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center justify-between">
      <span>{error}</span>
      <button onClick={onClearError} className="text-red-500 hover:text-red-700">
        ×
      </button>
    </div>
  );
}; 