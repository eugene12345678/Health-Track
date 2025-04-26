import React, { ReactNode } from 'react';

interface CardProps {
  title?: string;
  children: ReactNode;
  footer?: ReactNode;
  className?: string;
  glowColor?: string;
}

const Card: React.FC<CardProps> = ({ 
  title, 
  children, 
  footer, 
  className = '',
  glowColor = 'from-blue-400/20 to-purple-400/20' 
}) => {
  return (
    <div className={`
      relative overflow-hidden
      bg-white/90 backdrop-blur-lg
      shadow-lg rounded-2xl
      border border-white/20
      transition-all duration-500
      hover:shadow-xl hover:scale-[1.02]
      before:absolute before:inset-0
      before:bg-gradient-to-r before:${glowColor}
      before:opacity-0 before:transition-opacity
      before:duration-500 hover:before:opacity-100
      ${className}
    `}>
      {title && (
        <div className="relative border-b border-gray-100/50 px-6 py-4">
          <h3 className="text-lg font-semibold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            {title}
          </h3>
        </div>
      )}
      <div className="relative px-6 py-6">{children}</div>
      {footer && (
        <div className="relative border-t border-gray-100/50 px-6 py-4 bg-gray-50/50">
          {footer}
        </div>
      )}
    </div>
  );
};

export default Card;