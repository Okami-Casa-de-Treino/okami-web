import { useCallback } from 'react';
import { IToastService, ToastOptions } from '../types/interfaces';
import { toastService } from '../services/toastService';

interface UseToastReturn {
  success: (message: string, options?: ToastOptions) => void;
  error: (message: string, options?: ToastOptions) => void;
  warning: (message: string, options?: ToastOptions) => void;
  info: (message: string, options?: ToastOptions) => void;
  loading: (message: string, options?: ToastOptions) => void;
  dismiss: (toastId?: string | number) => void;
  dismissAll: () => void;
}

export const useToast = (customToastService?: IToastService): UseToastReturn => {
  const service = customToastService || toastService;

  const success = useCallback((message: string, options?: ToastOptions) => {
    service.success(message, options);
  }, [service]);

  const error = useCallback((message: string, options?: ToastOptions) => {
    service.error(message, options);
  }, [service]);

  const warning = useCallback((message: string, options?: ToastOptions) => {
    service.warning(message, options);
  }, [service]);

  const info = useCallback((message: string, options?: ToastOptions) => {
    service.info(message, options);
  }, [service]);

  const loading = useCallback((message: string, options?: ToastOptions) => {
    service.loading(message, options);
  }, [service]);

  const dismiss = useCallback((toastId?: string | number) => {
    service.dismiss(toastId);
  }, [service]);

  const dismissAll = useCallback(() => {
    service.dismissAll();
  }, [service]);

  return {
    success,
    error,
    warning,
    info,
    loading,
    dismiss,
    dismissAll,
  };
}; 