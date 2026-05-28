import { toast as sonnerToast } from 'sonner';

type ToastOptions = {
  description?: string;
  duration?: number;
  action?: { label: string; onClick: () => void };
};

// Durações padrão
const DURATION = {
  success: 4000,
  error:   6000,
  info:    4000,
  warning: 5000,
} as const;

export const toast = {
  success(message: string, options?: ToastOptions) {
    return sonnerToast.success(message, {
      duration: DURATION.success,
      ...options,
    });
  },

  error(message: string, options?: ToastOptions) {
    return sonnerToast.error(message, {
      duration: DURATION.error,
      ...options,
    });
  },

  info(message: string, options?: ToastOptions) {
    return sonnerToast.info(message, {
      duration: DURATION.info,
      ...options,
    });
  },

  warning(message: string, options?: ToastOptions) {
    return sonnerToast.warning(message, {
      duration: DURATION.warning,
      ...options,
    });
  },

  loading(message: string) {
    const id = sonnerToast.loading(message);
    return {
      dismiss: () => sonnerToast.dismiss(id),
      update: (msg: string) => sonnerToast.success(msg, { id }),
      error:  (msg: string) => sonnerToast.error(msg, { id }),
    };
  },

  promise<T>(
    promise: Promise<T>,
    messages: {
      loading: string;
      success: string | ((data: T) => string);
      error:   string | ((err: unknown) => string);
    },
  ) {
    return sonnerToast.promise(promise, messages);
  },

  dismiss: sonnerToast.dismiss,
};
