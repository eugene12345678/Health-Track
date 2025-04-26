import React, { ButtonHTMLAttributes } from 'react';

type ButtonVariant = 'primary' | 'secondary' | 'danger' | 'outline';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
  className?: string;
}

const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  isLoading = false,
  className = '',
  children,
  disabled,
  ...props
}) => {
  const baseStyles = `
    relative overflow-hidden
    inline-flex items-center justify-center
    font-medium rounded-xl
    transition-all duration-300
    transform hover:scale-105 active:scale-95
    focus:outline-none focus:ring-2 focus:ring-offset-2
    disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none
  `;
  
  const variantStyles = {
    primary: `
      bg-gradient-to-r from-blue-600 to-blue-700
      hover:from-blue-700 hover:to-blue-800
      text-white shadow-lg shadow-blue-500/25
      hover:shadow-blue-500/40
      focus:ring-blue-500
    `,
    secondary: `
      bg-gradient-to-r from-gray-600 to-gray-700
      hover:from-gray-700 hover:to-gray-800
      text-white shadow-lg shadow-gray-500/25
      hover:shadow-gray-500/40
      focus:ring-gray-500
    `,
    danger: `
      bg-gradient-to-r from-red-600 to-red-700
      hover:from-red-700 hover:to-red-800
      text-white shadow-lg shadow-red-500/25
      hover:shadow-red-500/40
      focus:ring-red-500
    `,
    outline: `
      border-2 border-gray-300
      hover:border-gray-400
      bg-white text-gray-700
      hover:bg-gray-50
      focus:ring-blue-500
    `,
  };
  
  const sizeStyles = {
    sm: 'px-3 py-2 text-sm',
    md: 'px-4 py-2.5 text-base',
    lg: 'px-6 py-3 text-lg',
  };
  
  return (
    <button
      className={`
        ${baseStyles}
        ${variantStyles[variant]}
        ${sizeStyles[size]}
        ${className}
      `}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <>
          <div className="absolute inset-0 bg-white/20 backdrop-blur-sm" />
          <svg className="animate-spin -ml-1 mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          Processing...
        </>
      ) : (
        <>
          <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 transform -skew-x-45 translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-1000" />
          {children}
        </>
      )}
    </button>
  );
};

export default Button;