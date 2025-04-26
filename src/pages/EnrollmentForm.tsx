import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import PageHeader from '../components/PageHeader';
import Button from '../components/Button';
import Card from '../components/Card';
import Alert from '../components/Alert';
import { useApi } from '../context/ApiContext';

interface Program {
  id: number;
  name: string;
  description: string | null;
}

interface Client {
  id: number;
  name: string;
  enrollments: Array<{
    program: {
      id: number;
    };
  }>;
}

const EnrollmentForm: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const api = useApi();
  
  const [client, setClient] = useState<Client | null>(null);
  const [availablePrograms, setAvailablePrograms] = useState<Program[]>([]);
  const [selectedProgramIds, setSelectedProgramIds] = useState<number[]>([]);
  
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        
        // Fetch client with enrollments
        const clientData = await api.getClient(Number(id));
        setClient(clientData);
        
        // Fetch all available programs
        const programs = await api.getPrograms();
        
        // Filter out programs the client is already enrolled in
        const enrolledProgramIds = new Set(
          clientData.enrollments.map((e: any) => e.program.id)
        );
        
        const filteredPrograms = programs.filter(
          (program: Program) => !enrolledProgramIds.has(program.id)
        );
        
        setAvailablePrograms(filteredPrograms);
      } catch (err) {
        setError('Failed to load data. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };
    
    if (id) {
      fetchData();
    }
  }, [id]);
  
  const handleProgramToggle = (programId: number) => {
    setSelectedProgramIds(prev => {
      if (prev.includes(programId)) {
        return prev.filter(id => id !== programId);
      } else {
        return [...prev, programId];
      }
    });
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (selectedProgramIds.length === 0) {
      setError('Please select at least one program');
      return;
    }
    
    setIsSubmitting(true);
    setError(null);
    
    try {
      await api.createBulkEnrollments(Number(id), selectedProgramIds);
      navigate(`/clients/${id}`);
    } catch (err: any) {
      const errorMessage = err.response?.data?.error || 'Failed to enroll client in programs. Please try again.';
      setError(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  if (isLoading) {
    return (
      <div>
        <PageHeader
          title="Enroll in Programs"
          backLink={`/clients/${id}`}
        />
        <div className="animate-pulse">
          <div className="h-64 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }
  
  if (!client) {
    return (
      <div>
        <PageHeader
          title="Enroll in Programs"
          backLink="/clients"
        />
        <Alert
          type="error"
          message="Client not found"
        />
      </div>
    );
  }

  return (
    <div>
      <PageHeader
        title={`Enroll ${client.name}`}
        subtitle="Select programs to enroll this client in"
        backLink={`/clients/${id}`}
      />
      
      <Card>
        {error && (
          <Alert
            type="error"
            message={error}
            onClose={() => setError(null)}
          />
        )}
        
        {availablePrograms.length === 0 ? (
          <div className="text-center py-4">
            <p className="text-gray-600 mb-4">
              This client is already enrolled in all available programs.
            </p>
            <Button 
              variant="outline" 
              onClick={() => navigate(`/clients/${id}`)}
            >
              Return to Client Profile
            </Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <p className="text-gray-600">
                Select the programs you want to enroll {client.name} in:
              </p>
            </div>
            
            <div className="space-y-3 mb-6">
              {availablePrograms.map(program => (
                <div key={program.id} className="flex items-start">
                  <div className="flex items-center h-5">
                    <input
                      id={`program-${program.id}`}
                      type="checkbox"
                      checked={selectedProgramIds.includes(program.id)}
                      onChange={() => handleProgramToggle(program.id)}
                      className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                  </div>
                  <div className="ml-3">
                    <label htmlFor={`program-${program.id}`} className="font-medium text-gray-700">
                      {program.name}
                    </label>
                    {program.description && (
                      <p className="text-gray-500 text-sm">{program.description}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
            
            <div className="flex justify-end space-x-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate(`/clients/${id}`)}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                isLoading={isSubmitting}
                disabled={isSubmitting || selectedProgramIds.length === 0}
              >
                Enroll in {selectedProgramIds.length} Program{selectedProgramIds.length !== 1 ? 's' : ''}
              </Button>
            </div>
          </form>
        )}
      </Card>
    </div>
  );
};

export default EnrollmentForm;