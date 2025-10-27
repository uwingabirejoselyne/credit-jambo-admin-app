import React from 'react';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'success' | 'warning' | 'danger' | 'info' | 'default' | 'pending' | 'verified';
  size?: 'sm' | 'md' | 'lg';
  pill?: boolean;
  icon?: React.ReactNode;
  className?: string;
}

const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'default',
  size = 'md',
  pill = false,
  icon,
  className = '',
}) => {
  const variantStyles = {
    success: 'bg-green-100 text-green-800 border-green-200',
    warning: 'bg-orange-100 text-orange-800 border-orange-200',
    danger: 'bg-red-100 text-red-800 border-red-200',
    info: 'bg-blue-100 text-blue-800 border-blue-200',
    default: 'bg-gray-100 text-gray-800 border-gray-200',
    pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    verified: 'bg-green-100 text-green-800 border-green-200',
  };

  const sizeStyles = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-2.5 py-1 text-sm',
    lg: 'px-3 py-1.5 text-base',
  };

  const roundedStyle = pill ? 'rounded-full' : 'rounded-md';

  return (
    <span
      className={`
        inline-flex items-center gap-1 font-medium border
        ${variantStyles[variant]}
        ${sizeStyles[size]}
        ${roundedStyle}
        ${className}
      `}
    >
      {icon && <span className="flex-shrink-0">{icon}</span>}
      {children}
    </span>
  );
};

export default Badge;
