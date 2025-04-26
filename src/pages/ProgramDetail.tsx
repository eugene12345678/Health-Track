import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Edit, Trash2, Users } from 'lucide-react';
import PageHeader from '../components/PageHeader';
import Button from '../components/Button';
import Card from '../components/Card';
import Table from '../components/Table';
import Alert from '../components/Alert';
import { useApi } from '../context/ApiContext';

interface Program {
  id: number;
  name: string;
  description: string | null;
  enrollments: Array<{
    id: number;
    client: {
      id: number;
      name: string;
      age: number;
      gender: string;
    };
  }>;
}

const ProgramDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const api = useApi();
  
  const [program, setProgram] = useState<Program | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    const fetchProgram = async () => {
      try {
        setIsLoading(true);
        const data = await api.getProgram(Number(id));
        setProgram(data);
      } catch (err) {
        setError('Failed to load program details. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };
    
    if (id) {
      fetchProgram();
    }
  }, [id]);
  
  const handleEdit = () => {
    navigate(`/programs/${id}/edit`);
  };
  
  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this program?')) {
      return;
    }
    
    try {
      await api.deleteProgram(Number(id));
      navigate('/programs');
    } catch (err: any) {
      // Check if the error is due to existing enrollments
      if (err.response?.data?.error?.includes('active enrollments')) {
        setError('Cannot delete program with active enrollments. Remove enrollments first.');
      } else {
        setError('Failed to delete program');
      }
    }
  };
  
  const handleRemoveEnrollment = async (enrollmentId: number, clientId: number) => {
    if (!confirm('Are you sure you want to remove this client from the program?')) {
      return;
    }
    
    try {
      await api.removeClientFromProgram(clientId, Number(id));
      
      // Update local state to reflect the change
      setProgram(prev => {
        if (!prev) return null;
        
        return {
          ...prev,
          enrollments: prev.enrollments.filter(e => e.id !== enrollmentId)
        };
      });
    } catch (err) {
      setError('Failed to remove client from program');
    }
  };
  
  const handleViewClient = (clientId: number) => {
    navigate(`/clients/${clientId}`);
  };

  if (isLoading) {
    return (
      <div>
        <div className="animate-pulse">
          <div className="h-10 bg-gray-200 rounded mb-4"></div>
          <div className="h-20 bg-gray-200 rounded mb-4"></div>
          <div className="h-64 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <PageHeader
          title="Program Details"
          backLink="/programs"
        />
        <Alert
          type="error"
          message={error}
          onClose={() => setError(null)}
        />
      </div>
    );
  }

  if (!program) {
    return (
      <div>
        <PageHeader
          title="Program Details"
          backLink="/programs"
        />
        <Alert
          type="error"
          message="Program not found"
        />
      </div>
    );
  }

  return (
    <div>
      <PageHeader
        title={program.name}
        subtitle="Program details and enrolled clients"
        backLink="/programs"
        action={{
          label: 'Edit Program',
          onClick: handleEdit
        }}
      />
      
      <div className="mb-6">
        <Card>
          <div className="mb-6">
            <h3 className="text-lg font-medium text-gray-900 mb-2">Description</h3>
            <p className="text-gray-600">
              {program.description || 'No description provided.'}
            </p>
          </div>
          
          <div className="flex space-x-4 mt-4">
            <Button
              variant="outline"
              onClick={handleEdit}
              className="flex items-center"
            >
              <Edit size={18} className="mr-1" />
              Edit
            </Button>
            <Button
              variant="danger"
              onClick={handleDelete}
              className="flex items-center"
            >
              <Trash2 size={18} className="mr-1" />
              Delete
            </Button>
          </div>
        </Card>
      </div>
      
      <Card title={`Enrolled Clients (${program.enrollments.length})`}>
        <Table
          headers={['Name', 'Age', 'Gender', 'Actions']}
          isEmpty={program.enrollments.length === 0}
          emptyMessage="No clients are enrolled in this program."
        >
          {program.enrollments.map(enrollment => (
            <tr key={enrollment.id} className="hover:bg-gray-50">
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                <a
                  href={`/clients/${enrollment.client.id}`}
                  className="text-blue-600 hover:text-blue-900 hover:underline"
                  onClick={(e) => {
                    e.preventDefault();
                    handleViewClient(enrollment.client.id);
                  }}
                >
                  {enrollment.client.name}
                </a>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {enrollment.client.age} years
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {enrollment.client.gender}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleViewClient(enrollment.client.id)}
                    className="text-indigo-600 hover:text-indigo-900"
                    title="View client"
                  >
                    <Users size={18} />
                  </button>
                  <button
                    onClick={() => handleRemoveEnrollment(enrollment.id, enrollment.client.id)}
                    className="text-red-600 hover:text-red-900"
                    title="Remove from program"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </Table>
      </Card>
    </div>
  );
};

export default ProgramDetail;