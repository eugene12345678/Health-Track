import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PlusCircle, Edit, Trash2 } from 'lucide-react';
import PageHeader from '../components/PageHeader';
import Button from '../components/Button';
import Table from '../components/Table';
import Alert from '../components/Alert';
import { useApi } from '../context/ApiContext';

interface Program {
  id: number;
  name: string;
  description: string | null;
  enrollments: any[];
  createdAt: string;
}

const Programs: React.FC = () => {
  const navigate = useNavigate();
  const api = useApi();
  
  const [programs, setPrograms] = useState<Program[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [alert, setAlert] = useState<{ type: 'success' | 'error', message: string } | null>(null);
  
  const fetchPrograms = async () => {
    try {
      setIsLoading(true);
      const data = await api.getPrograms();
      setPrograms(data);
      setError(null);
    } catch (err) {
      setError('Failed to load programs. Please try again.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };
  
  useEffect(() => {
    fetchPrograms();
  }, []);
  
  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this program?')) {
      return;
    }
    
    try {
      await api.deleteProgram(id);
      setPrograms(programs.filter(program => program.id !== id));
      setAlert({ type: 'success', message: 'Program deleted successfully' });
      
      // Auto-dismiss alert
      setTimeout(() => setAlert(null), 3000);
    } catch (err: any) {
      // Check if the error is due to existing enrollments
      if (err.response?.data?.error?.includes('active enrollments')) {
        setAlert({ 
          type: 'error', 
          message: 'Cannot delete program with active enrollments. Remove enrollments first.' 
        });
      } else {
        setAlert({ type: 'error', message: 'Failed to delete program' });
      }
    }
  };
  
  const handleCreateProgram = () => {
    navigate('/programs/new');
  };

  return (
    <div>
      <PageHeader
        title="Health Programs"
        subtitle="Manage available health programs"
        action={{
          label: 'Add Program',
          onClick: handleCreateProgram
        }}
      />
      
      {alert && (
        <Alert
          type={alert.type}
          message={alert.message}
          onClose={() => setAlert(null)}
        />
      )}
      
      {isLoading ? (
        <div className="animate-pulse">
          <div className="h-10 bg-gray-200 rounded mb-4"></div>
          <div className="h-64 bg-gray-200 rounded"></div>
        </div>
      ) : error ? (
        <Alert
          type="error"
          message={error}
          onClose={() => setError(null)}
        />
      ) : (
        <Table
          headers={['Name', 'Description', 'Enrollments', 'Actions']}
          isEmpty={programs.length === 0}
          emptyMessage="No programs found. Create your first program."
        >
          {programs.map(program => (
            <tr key={program.id} className="hover:bg-gray-50">
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                <a
                  href={`/programs/${program.id}`}
                  className="text-blue-600 hover:text-blue-900 hover:underline"
                  onClick={(e) => {
                    e.preventDefault();
                    navigate(`/programs/${program.id}`);
                  }}
                >
                  {program.name}
                </a>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {program.description || '-'}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {program.enrollments?.length || 0} clients
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                <div className="flex space-x-2">
                  <button
                    onClick={() => navigate(`/programs/${program.id}/edit`)}
                    className="text-indigo-600 hover:text-indigo-900"
                    title="Edit program"
                  >
                    <Edit size={18} />
                  </button>
                  <button
                    onClick={() => handleDelete(program.id)}
                    className="text-red-600 hover:text-red-900"
                    title="Delete program"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </Table>
      )}
      
      {!isLoading && !error && programs.length === 0 && (
        <div className="mt-6 text-center">
          <PlusCircle className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No programs</h3>
          <p className="mt-1 text-sm text-gray-500">
            Get started by creating a new health program.
          </p>
          <div className="mt-6">
            <Button onClick={handleCreateProgram}>
              <PlusCircle className="mr-2 h-5 w-5" />
              New Program
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Programs;