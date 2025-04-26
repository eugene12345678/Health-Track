import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import PageHeader from '../components/PageHeader';
import Button from '../components/Button';
import Card from '../components/Card';
import Alert from '../components/Alert';
import { useApi } from '../context/ApiContext';

const ProgramForm: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const api = useApi();
  
  const [formData, setFormData] = useState({
    name: '',
    description: ''
  });
  
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const isEditMode = !!id;
  
  useEffect(() => {
    const fetchProgram = async () => {
      if (!isEditMode) return;
      
      try {
        setIsLoading(true);
        const program = await api.getProgram(Number(id));
        setFormData({
          name: program.name,
          description: program.description || ''
        });
      } catch (err) {
        setError('Failed to load program data. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchProgram();
  }, [id, isEditMode]);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    if (!formData.name.trim()) {
      setError('Program name is required');
      return;
    }
    
    setIsSubmitting(true);
    setError(null);
    
    try {
      if (isEditMode) {
        await api.updateProgram(Number(id), formData);
      } else {
        await api.createProgram(formData);
      }
      
      navigate('/programs');
    } catch (err: any) {
      const errorMessage = err.response?.data?.error || 'Something went wrong. Please try again.';
      setError(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <PageHeader
        title={isEditMode ? 'Edit Program' : 'Create Program'}
        subtitle={isEditMode 
          ? 'Update program details' 
          : 'Create a new health program in the system'
        }
        backLink="/programs"
      />
      
      {isLoading ? (
        <div className="animate-pulse">
          <div className="h-64 bg-gray-200 rounded"></div>
        </div>
      ) : (
        <Card>
          {error && (
            <Alert
              type="error"
              message={error}
              onClose={() => setError(null)}
            />
          )}
          
          <form onSubmit={handleSubmit} >
            <div className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                  Program Name*
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm h-12"
                  placeholder="e.g., Tuberculosis Control Program"
                  required
                />
              </div>
              
              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                  Description
                </label>
                <textarea
                  id="description"
                  name="description"
                  rows={4}
                  value={formData.description}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  placeholder="Describe the program's purpose and activities"
                />
              </div>
              
              <div className="flex justify-end space-x-3 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate('/programs')}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  isLoading={isSubmitting}
                  disabled={isSubmitting}
                >
                  {isEditMode ? 'Update Program' : 'Create Program'}
                </Button>
              </div>
            </div>
          </form>
        </Card>
      )}
    </div>
  );
};

export default ProgramForm;