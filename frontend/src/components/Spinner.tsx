import React from 'react';

interface SpinnerProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  color?: 'blue' | 'green' | 'orange' | 'white' | 'gray';
  fullScreen?: boolean;
  text?: string;
}

const Spinner: React.FC<SpinnerProps> = ({
  size = 'md',
  color = 'blue',
  fullScreen = false,
  text,
}) => {
  const sizeStyles = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16',
  };

  const colorStyles = {
    blue: 'border-blue-600',
    green: 'border-green-600',
    orange: 'border-orange-600',
    white: 'border-white',
    gray: 'border-gray-600',
  };

  const spinner = (
    <div className="flex flex-col items-center justify-center gap-3">
      <div
        className={`
          ${sizeStyles[size]}
          border-4 border-t-transparent ${colorStyles[color]}
          rounded-full animate-spin
        `}
      />
      {text && (
        <p className="text-sm font-medium text-gray-600 animate-pulse">
          {text}
        </p>
      )}
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-white bg-opacity-90 backdrop-blur-sm">
        {spinner}
      </div>
    );
  }

  return spinner;
};

export default Spinner;
