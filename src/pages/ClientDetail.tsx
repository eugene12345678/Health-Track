import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Edit, Trash2, BookMarked as BookMedical, UserPlus } from 'lucide-react';
import PageHeader from '../components/PageHeader';
import Button from '../components/Button';
import Card from '../components/Card';
import Table from '../components/Table';
import Alert from '../components/Alert';
import { useApi } from '../context/ApiContext';

interface Client {
  id: number;
  name: string;
  age: number;
  gender: string;
  phone: string;
  address: string;
  enrollments: Array<{
    id: number;
    program: {
      id: number;
      name: string;
      description: string | null;
    };
    enrolledAt: string;
  }>;
}

const ClientDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const api = useApi();
  
  const [client, setClient] = useState<Client | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    const fetchClient = async () => {
      try {
        setIsLoading(true);
        const data = await api.getClient(Number(id));
        setClient(data);
      } catch (err) {
        setError('Failed to load client details. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };
    
    if (id) {
      fetchClient();
    }
  }, [id]);
  
  const handleEdit = () => {
    navigate(`/clients/${id}/edit`);
  };
  
  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this client?')) {
      return;
    }
    
    try {
      await api.deleteClient(Number(id));
      navigate('/clients');
    } catch (err) {
      setError('Failed to delete client');
    }
  };
  
  const handleEnroll = () => {
    navigate(`/clients/${id}/enroll`);
  };
  
  const handleRemoveEnrollment = async (enrollmentId: number, programId: number) => {
    if (!confirm('Are you sure you want to remove this program from the client?')) {
      return;
    }
    
    try {
      await api.removeClientFromProgram(Number(id), programId);
      
      // Update local state to reflect the change
      setClient(prev => {
        if (!prev) return null;
        
        return {
          ...prev,
          enrollments: prev.enrollments.filter(e => e.id !== enrollmentId)
        };
      });
    } catch (err) {
      setError('Failed to remove program from client');
    }
  };
  
  const handleViewProgram = (programId: number) => {
    navigate(`/programs/${programId}`);
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
          title="Client Profile"
          backLink="/clients"
        />
        <Alert
          type="error"
          message={error}
          onClose={() => setError(null)}
        />
      </div>
    );
  }

  if (!client) {
    return (
      <div>
        <PageHeader
          title="Client Profile"
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
        title={client.name}
        subtitle="Client profile and enrolled programs"
        backLink="/clients"
        action={{
          label: 'Edit Client',
          onClick: handleEdit
        }}
      />
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <Card title="Personal Information">
          <div className="space-y-3">
            <div>
              <span className="text-sm font-medium text-gray-500 block">Age</span>
              <span className="text-base text-gray-900">{client.age} years</span>
            </div>
            <div>
              <span className="text-sm font-medium text-gray-500 block">Gender</span>
              <span className="text-base text-gray-900">{client.gender}</span>
            </div>
            <div>
              <span className="text-sm font-medium text-gray-500 block">Phone</span>
              <span className="text-base text-gray-900">{client.phone}</span>
            </div>
            <div>
              <span className="text-sm font-medium text-gray-500 block">Address</span>
              <span className="text-base text-gray-900">{client.address}</span>
            </div>
          </div>
        </Card>
        
        <Card title="Enrollment Status" className="md:col-span-2">
          <div className="mb-4">
            <p className="text-base text-gray-600">
              {client.enrollments.length > 0 
                ? `This client is enrolled in ${client.enrollments.length} program(s).`
                : "This client is not enrolled in any programs yet."}
            </p>
          </div>
          
          <div className="flex space-x-4">
            <Button
              variant="outline"
              onClick={handleEdit}
              className="flex items-center"
            >
              <Edit size={18} className="mr-1" />
              Edit Client
            </Button>
            <Button
              variant="primary"
              onClick={handleEnroll}
              className="flex items-center"
            >
              <UserPlus size={18} className="mr-1" />
              Enroll in Program
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
      
      <Card title={`Enrolled Programs (${client.enrollments.length})`}>
        <Table
          headers={['Program Name', 'Description', 'Enrolled On', 'Actions']}
          isEmpty={client.enrollments.length === 0}
          emptyMessage="Client is not enrolled in any programs. Use the 'Enroll in Program' button to add programs."
        >
          {client.enrollments.map(enrollment => (
            <tr key={enrollment.id} className="hover:bg-gray-50">
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                <a
                  href={`/programs/${enrollment.program.id}`}
                  className="text-blue-600 hover:text-blue-900 hover:underline"
                  onClick={(e) => {
                    e.preventDefault();
                    handleViewProgram(enrollment.program.id);
                  }}
                >
                  {enrollment.program.name}
                </a>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {enrollment.program.description || '-'}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {new Date(enrollment.enrolledAt).toLocaleDateString()}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleViewProgram(enrollment.program.id)}
                    className="text-indigo-600 hover:text-indigo-900"
                    title="View program"
                  >
                    <BookMedical size={18} />
                  </button>
                  <button
                    onClick={() => handleRemoveEnrollment(enrollment.id, enrollment.program.id)}
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

export default ClientDetail;