import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PlusCircle, Edit, Trash2, UserPlus } from 'lucide-react';
import PageHeader from '../components/PageHeader';
import Button from '../components/Button';
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
  enrollments: any[];
}

const Clients: React.FC = () => {
  const navigate = useNavigate();
  const api = useApi();
  
  const [clients, setClients] = useState<Client[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [alert, setAlert] = useState<{ type: 'success' | 'error', message: string } | null>(null);
  
  const fetchClients = async () => {
    try {
      setIsLoading(true);
      const data = await api.getClients();
      setClients(data);
      setError(null);
    } catch (err) {
      setError('Failed to load clients. Please try again.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };
  
  useEffect(() => {
    fetchClients();
  }, []);
  
  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this client?')) {
      return;
    }
    
    try {
      await api.deleteClient(id);
      setClients(clients.filter(client => client.id !== id));
      setAlert({ type: 'success', message: 'Client deleted successfully' });
      
      // Auto-dismiss alert
      setTimeout(() => setAlert(null), 3000);
    } catch (err) {
      setAlert({ type: 'error', message: 'Failed to delete client' });
    }
  };
  
  const handleEnroll = (id: number) => {
    navigate(`/clients/${id}/enroll`);
  };
  
  const handleCreateClient = () => {
    navigate('/clients/new');
  };

  return (
    <div>
      <PageHeader
        title="Clients"
        subtitle="Manage client records"
        action={{
          label: 'Add Client',
          onClick: handleCreateClient
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
          headers={['Name', 'Age', 'Gender', 'Phone', 'Programs', 'Actions']}
          isEmpty={clients.length === 0}
          emptyMessage="No clients found. Register your first client."
        >
          {clients.map(client => (
            <tr key={client.id} className="hover:bg-gray-50">
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                <a
                  href={`/clients/${client.id}`}
                  className="text-blue-600 hover:text-blue-900 hover:underline"
                  onClick={(e) => {
                    e.preventDefault();
                    navigate(`/clients/${client.id}`);
                  }}
                >
                  {client.name}
                </a>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {client.age} years
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {client.gender}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {client.phone}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {client.enrollments?.length || 0} programs
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleEnroll(client.id)}
                    className="text-green-600 hover:text-green-900"
                    title="Enroll in program"
                  >
                    <UserPlus size={18} />
                  </button>
                  <button
                    onClick={() => navigate(`/clients/${client.id}/edit`)}
                    className="text-indigo-600 hover:text-indigo-900"
                    title="Edit client"
                  >
                    <Edit size={18} />
                  </button>
                  <button
                    onClick={() => handleDelete(client.id)}
                    className="text-red-600 hover:text-red-900"
                    title="Delete client"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </Table>
      )}
      
      {!isLoading && !error && clients.length === 0 && (
        <div className="mt-6 text-center">
          <PlusCircle className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No clients</h3>
          <p className="mt-1 text-sm text-gray-500">
            Get started by registering a new client.
          </p>
          <div className="mt-6">
            <Button onClick={handleCreateClient}>
              <PlusCircle className="mr-2 h-5 w-5" />
              Register Client
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Clients;