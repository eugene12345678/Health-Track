import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  backLink?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
}

const PageHeader: React.FC<PageHeaderProps> = ({ 
  title, 
  subtitle, 
  backLink, 
  action 
}) => {
  const navigate = useNavigate();
  
  const handleBack = () => {
    if (backLink) {
      navigate(backLink);
    } else {
      navigate(-1);
    }
  };

  return (
    <div className="pb-6 mb-6 border-b border-gray-200/50">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="animate-slide-up">
          {backLink !== undefined && (
            <button 
              onClick={handleBack} 
              className="flex items-center text-gray-500 hover:text-gray-700 mb-2 transition-colors duration-200"
            >
              <ArrowLeft size={16} className="mr-1" />
              <span>Back</span>
            </button>
          )}
          <h1 className="text-3xl font-bold gradient-text">{title}</h1>
          {subtitle && (
            <p className="mt-2 text-sm text-gray-500">{subtitle}</p>
          )}
        </div>
        
        {action && (
          <button
            onClick={action.onClick}
            className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-md hover:shadow-lg"
          >
            {action.label}
          </button>
        )}
      </div>
    </div>
  );
};

export default PageHeader;