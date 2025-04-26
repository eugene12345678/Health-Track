import React from 'react';
import { BookMarked, Users, Clock } from 'lucide-react';
import Card from './Card';

interface ProgramCardProps {
  name: string;
  description: string;
  enrolledClients: number;
  lastUpdated: string;
  className?: string;
}

const ProgramCard: React.FC<ProgramCardProps> = ({
  name,
  description,
  enrolledClients,
  lastUpdated,
  className = ''
}) => {
  return (
    <Card className={`hover-lift ${className}`}>
      <div className="flex items-start space-x-4">
        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center">
          <BookMarked className="h-6 w-6 text-white" />
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900">{name}</h3>
          <p className="mt-1 text-sm text-gray-500 line-clamp-2">{description}</p>
          
          <div className="mt-4 flex items-center justify-between">
            <div className="flex items-center text-sm text-gray-600">
              <Users className="h-4 w-4 mr-2" />
              <span className="font-medium text-emerald-600">{enrolledClients}</span> enrolled
            </div>
            <div className="flex items-center text-sm text-gray-500">
              <Clock className="h-4 w-4 mr-1" />
              Updated {lastUpdated}
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default ProgramCard;