import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Users, UserPlus } from 'lucide-react';
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
}

const ClientSearch: React.FC = () => {
  const navigate = useNavigate();
  const api = useApi();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [clients, setClients] = useState<Client[]>([]);
  const [hasSearched, setHasSearched] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!searchTerm.trim()) {
      setError('Please enter a search term');
      return;
    }
    
    try {
      setIsLoading(true);
      setError(null);
      const data = await api.searchClients(searchTerm);
      setClients(data);
      setHasSearched(true);
    } catch (err) {
      setError('Failed to perform search. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleViewClient = (id: number) => {
    navigate(`/clients/${id}`);
  };
  
  const handleCreateClient = () => {
    navigate('/clients/new');
  };

  return (
    <div>
      <PageHeader
        title="Search Clients"
        subtitle="Find clients by name"
      />
      
      <Card className="mb-6">
        {error && (
          <Alert
            type="error"
            message={error}
            onClose={() => setError(null)}
          />
        )}
        
        <form onSubmit={handleSearch}>
          <div className="flex items-end gap-4">
            <div className="flex-1">
              <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-1">
                Client Name
              </label>
              <input
                type="text"
                id="search"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                placeholder="Search by client name"
              />
            </div>
            <Button
              type="submit"
              isLoading={isLoading}
              disabled={isLoading}
              className="flex items-center"
            >
              <Search size={18} className="mr-1" />
              Search
            </Button>
          </div>
        </form>
      </Card>
      
      {hasSearched && (
        <Card title={`Search Results (${clients.length})`}>
          <Table
            headers={['Name', 'Age', 'Gender', 'Phone', 'Actions']}
            isEmpty={clients.length === 0}
            emptyMessage="No clients found matching your search. Try a different name or register a new client."
          >
            {clients.map(client => (
              <tr key={client.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  <a
                    href={`/clients/${client.id}`}
                    className="text-blue-600 hover:text-blue-900 hover:underline"
                    onClick={(e) => {
                      e.preventDefault();
                      handleViewClient(client.id);
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
                  <button
                    onClick={() => handleViewClient(client.id)}
                    className="text-indigo-600 hover:text-indigo-900"
                    title="View client"
                  >
                    <Users size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </Table>
          
          {clients.length === 0 && (
            <div className="flex justify-center mt-4">
              <Button
                onClick={handleCreateClient}
                className="flex items-center"
              >
                <UserPlus size={18} className="mr-1" />
                Register New Client
              </Button>
            </div>
          )}
        </Card>
      )}
    </div>
  );
};

export default ClientSearch;