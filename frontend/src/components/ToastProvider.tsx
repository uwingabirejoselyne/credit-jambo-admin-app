import React from 'react';
import { Toaster } from 'react-hot-toast';

interface ToastProviderProps {
  children: React.ReactNode;
}

const ToastProvider: React.FC<ToastProviderProps> = ({ children }) => {
  return (
    <>
      {children}
      <Toaster
        position="top-right"
        reverseOrder={false}
        gutter={8}
        toastOptions={{
          duration: 4000,
          style: {
            borderRadius: '0.75rem',
            fontSize: '0.875rem',
            fontWeight: '500',
            maxWidth: '500px',
          },
          success: {
            style: {
              background: 'rgba(20, 208, 102, 1)',
              color: '#fff',
            },
            iconTheme: {
              primary: '#fff',
              secondary: 'rgba(20, 208, 102, 1)',
            },
          },
          error: {
            style: {
              background: '#ef4444',
              color: '#fff',
            },
            iconTheme: {
              primary: '#fff',
              secondary: '#ef4444',
            },
          },
          loading: {
            style: {
              background: 'rgba(20, 208, 102, 1)',
              color: '#fff',
            },
            iconTheme: {
              primary: '#fff',
              secondary: 'rgba(20, 208, 102, 1)',
            },
          },
        }}
      />
    </>
  );
};

export default ToastProvider;
