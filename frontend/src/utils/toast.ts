import toast from 'react-hot-toast';

// Custom toast configurations with Credit Jambo theme
const toastConfig = {
  success: {
    duration: 4000,
    style: {
      background: '#10b981',
      color: '#fff',
      borderRadius: '0.75rem',
      padding: '1rem 1.5rem',
      fontSize: '0.875rem',
      fontWeight: '500',
    },
    iconTheme: {
      primary: '#fff',
      secondary: '#10b981',
    },
  },
  error: {
    duration: 5000,
    style: {
      background: '#ef4444',
      color: '#fff',
      borderRadius: '0.75rem',
      padding: '1rem 1.5rem',
      fontSize: '0.875rem',
      fontWeight: '500',
    },
    iconTheme: {
      primary: '#fff',
      secondary: '#ef4444',
    },
  },
  loading: {
    style: {
      background: '#3b82f6',
      color: '#fff',
      borderRadius: '0.75rem',
      padding: '1rem 1.5rem',
      fontSize: '0.875rem',
      fontWeight: '500',
    },
    iconTheme: {
      primary: '#fff',
      secondary: '#3b82f6',
    },
  },
  warning: {
    duration: 4000,
    style: {
      background: '#f97316',
      color: '#fff',
      borderRadius: '0.75rem',
      padding: '1rem 1.5rem',
      fontSize: '0.875rem',
      fontWeight: '500',
    },
    icon: '⚠️',
  },
};

// Toast utility functions
export const showToast = {
  success: (message: string) => {
    toast.success(message, toastConfig.success);
  },

  error: (message: string) => {
    toast.error(message, toastConfig.error);
  },

  loading: (message: string) => {
    return toast.loading(message, toastConfig.loading);
  },

  warning: (message: string) => {
    toast(message, toastConfig.warning);
  },

  promise: <T,>(
    promise: Promise<T>,
    messages: {
      loading: string;
      success: string;
      error: string;
    }
  ) => {
    return toast.promise(promise, messages, {
      loading: toastConfig.loading,
      success: toastConfig.success,
      error: toastConfig.error,
    });
  },

  dismiss: (toastId?: string) => {
    toast.dismiss(toastId);
  },
};

export default showToast;
