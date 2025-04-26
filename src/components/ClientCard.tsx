import React from 'react';
import { User, Phone, MapPin, Calendar } from 'lucide-react';
import Card from './Card';

interface ClientCardProps {
  name: string;
  age: number;
  gender: string;
  phone: string;
  address: string;
  enrolledPrograms: number;
  lastUpdated: string;
  className?: string;
}

const ClientCard: React.FC<ClientCardProps> = ({
  name,
  age,
  gender,
  phone,
  address,
  enrolledPrograms,
  lastUpdated,
  className = ''
}) => {
  return (
    <Card className={`hover-lift ${className}`}>
      <div className="flex items-start space-x-4">
        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center">
          <User className="h-6 w-6 text-white" />
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900">{name}</h3>
          <div className="mt-1 text-sm text-gray-500">
            {age} years • {gender}
          </div>
          
          <div className="mt-4 space-y-2">
            <div className="flex items-center text-sm text-gray-600">
              <Phone className="h-4 w-4 mr-2" />
              {phone}
            </div>
            <div className="flex items-center text-sm text-gray-600">
              <MapPin className="h-4 w-4 mr-2" />
              {address}
            </div>
          </div>
          
          <div className="mt-4 flex items-center justify-between">
            <div className="text-sm text-gray-500">
              <span className="font-medium text-blue-600">{enrolledPrograms}</span> programs enrolled
            </div>
            <div className="flex items-center text-sm text-gray-500">
              <Calendar className="h-4 w-4 mr-1" />
              Updated {lastUpdated}
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default ClientCard;