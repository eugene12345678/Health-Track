import React, { createContext, useContext, ReactNode } from 'react';
import axios from 'axios';

// API base URL
const API_URL = "https://healthtrack-backend-1.onrender.com/api";


// Create the API client
const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Define types for our context
type ApiContextType = {
  // Programs
  getPrograms: () => Promise<any>;
  getProgram: (id: number) => Promise<any>;
  createProgram: (data: any) => Promise<any>;
  updateProgram: (id: number, data: any) => Promise<any>;
  deleteProgram: (id: number) => Promise<any>;
  
  // Clients
  getClients: () => Promise<any>;
  getClient: (id: number) => Promise<any>;
  searchClients: (name: string) => Promise<any>;
  createClient: (data: any) => Promise<any>;
  updateClient: (id: number, data: any) => Promise<any>;
  deleteClient: (id: number) => Promise<any>;
  
  // Enrollments
  createEnrollment: (clientId: number, programId: number) => Promise<any>;
  createBulkEnrollments: (clientId: number, programIds: number[]) => Promise<any>;
  deleteEnrollment: (id: number) => Promise<any>;
  removeClientFromProgram: (clientId: number, programId: number) => Promise<any>;
};

// Create the context
const ApiContext = createContext<ApiContextType | undefined>(undefined);

// Create a provider component
export const ApiProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Programs API
  const getPrograms = async () => {
    const response = await apiClient.get('/programs');
    return response.data;
  };
  
  const getProgram = async (id: number) => {
    const response = await apiClient.get(`/programs/${id}`);
    return response.data;
  };
  
  const createProgram = async (data: any) => {
    const response = await apiClient.post('/programs', data);
    return response.data;
  };
  
  const updateProgram = async (id: number, data: any) => {
    const response = await apiClient.put(`/programs/${id}`, data);
    return response.data;
  };
  
  const deleteProgram = async (id: number) => {
    const response = await apiClient.delete(`/programs/${id}`);
    return response.data;
  };
  
  // Clients API
  const getClients = async () => {
    const response = await apiClient.get('/clients');
    return response.data;
  };
  
  const getClient = async (id: number) => {
    const response = await apiClient.get(`/clients/${id}`);
    return response.data;
  };
  
  const searchClients = async (name: string) => {
    const response = await apiClient.get(`/clients/search?name=${encodeURIComponent(name)}`);
    return response.data;
  };
  
  const createClient = async (data: any) => {
    const response = await apiClient.post('/clients', data);
    return response.data;
  };
  
  const updateClient = async (id: number, data: any) => {
    const response = await apiClient.put(`/clients/${id}`, data);
    return response.data;
  };
  
  const deleteClient = async (id: number) => {
    const response = await apiClient.delete(`/clients/${id}`);
    return response.data;
  };
  
  // Enrollments API
  const createEnrollment = async (clientId: number, programId: number) => {
    const response = await apiClient.post('/enrollments', { clientId, programId });
    return response.data;
  };
  
  const createBulkEnrollments = async (clientId: number, programIds: number[]) => {
    const response = await apiClient.post('/enrollments/bulk', { clientId, programIds });
    return response.data;
  };
  
  const deleteEnrollment = async (id: number) => {
    const response = await apiClient.delete(`/enrollments/${id}`);
    return response.data;
  };
  
  const removeClientFromProgram = async (clientId: number, programId: number) => {
    const response = await apiClient.delete(`/enrollments/client/${clientId}/program/${programId}`);
    return response.data;
  };
  
  // Create the value object
  const value = {
    // Programs
    getPrograms,
    getProgram,
    createProgram,
    updateProgram,
    deleteProgram,
    
    // Clients
    getClients,
    getClient,
    searchClients,
    createClient,
    updateClient,
    deleteClient,
    
    // Enrollments
    createEnrollment,
    createBulkEnrollments,
    deleteEnrollment,
    removeClientFromProgram
  };
  
  return <ApiContext.Provider value={value}>{children}</ApiContext.Provider>;
};

// Create a hook for using the API context
export const useApi = () => {
  const context = useContext(ApiContext);
  if (context === undefined) {
    throw new Error('useApi must be used within an ApiProvider');
  }
  return context;
};