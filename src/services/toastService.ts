import { toast, ToastOptions as ReactToastifyOptions, Id } from 'react-toastify';
import { IToastService, ToastOptions } from '../types/interfaces';

class ToastService implements IToastService {
  private mapOptions(options?: ToastOptions): ReactToastifyOptions {
    if (!options) return {};
    
    return {
      position: options.position || 'top-right',
      autoClose: options.autoClose !== undefined ? options.autoClose : 5000,
      hideProgressBar: options.hideProgressBar || false,
      closeOnClick: options.closeOnClick !== undefined ? options.closeOnClick : true,
      pauseOnHover: options.pauseOnHover !== undefined ? options.pauseOnHover : true,
      draggable: options.draggable !== undefined ? options.draggable : true,
    };
  }

  success(message: string, options?: ToastOptions): void {
    toast.success(message, this.mapOptions(options));
  }

  error(message: string, options?: ToastOptions): void {
    toast.error(message, this.mapOptions(options));
  }

  warning(message: string, options?: ToastOptions): void {
    toast.warning(message, this.mapOptions(options));
  }

  info(message: string, options?: ToastOptions): void {
    toast.info(message, this.mapOptions(options));
  }

  loading(message: string, options?: ToastOptions): void {
    toast.loading(message, this.mapOptions(options));
  }

  dismiss(toastId?: string | number): void {
    if (toastId) {
      toast.dismiss(toastId as Id);
    } else {
      toast.dismiss();
    }
  }

  dismissAll(): void {
    toast.dismiss();
  }
}

export const toastService = new ToastService(); 