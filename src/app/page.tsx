'use client';

import { useState, useEffect } from 'react';
import IncidentTable from './components/IncidentTable';
import IncidentForm from './components/IncidentForm';
import IncidentDetails from './components/IncidentDetails';
import UserForm from './components/UserForm';
import { Status } from '@prisma/client';
import { ZodIssue } from 'zod';

interface User {
  id: string;
  name: string;
  email: string;
}

interface Incident {
  id: string;
  title: string;
  description: string;
  priority: string;
  status: Status;
  area: string;
  createdAt: Date;
  assignedTo: User | null;
  userId: string | null;
}

type IncidentFormData = Omit<Incident, 'id' | 'createdAt'>;

export default function Home() {
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [isIncidentModalOpen, setIsIncidentModalOpen] = useState(false);
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  const [selectedIncident, setSelectedIncident] = useState<Incident | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fetchUsers = async () => {
    try {
      const response = await fetch('/api/users');
      if (!response.ok) throw new Error('Failed to fetch users');
      const data = await response.json();
      setUsers(data);
    } catch (err) {
      setError('Error fetching users');
      console.error(err);
    }
  };

  const fetchIncidents = async () => {
    try {
      const response = await fetch('/api/incidents');
      if (!response.ok) throw new Error('Failed to fetch incidents');
      const data = await response.json();
      setIncidents(data);
    } catch (err) {
      setError('Error fetching incidents');
      console.error(err);
    }
  };

  useEffect(() => {
    fetchUsers();
    fetchIncidents();
  }, []);

  const handleCreateIncident = async (data: IncidentFormData): Promise<boolean> => {
    try {
      const response = await fetch('/api/incidents', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        if (errorData.details) {
          const errorMessage = errorData.details
            .map((detail: ZodIssue) => detail.message)
            .join(', ');
          throw new Error(errorMessage);
        }
        throw new Error('Failed to create incident');
      }

      await fetchIncidents();
      setIsIncidentModalOpen(false);
      return true;
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('An unexpected error occurred');
      }
      console.error(err);
      return false;
    }
  };

  const handleCreateUser = async (data: { name: string; email: string }): Promise<boolean> => {
    try {
      const response = await fetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        if (errorData.details) {
          const errorMessage = errorData.details
            .map((detail: ZodIssue) => detail.message)
            .join(', ');
          throw new Error(errorMessage);
        }
        throw new Error('Failed to create user');
      }

      await fetchUsers();
      setIsUserModalOpen(false);
      return true;
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('An unexpected error occurred');
      }
      console.error(err);
      return false;
    }
  };

  const handleUpdateStatus = async (id: string, status: Status) => {
    try {
      const response = await fetch(`/api/incidents/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });

      if (!response.ok) throw new Error('Failed to update status');
      await fetchIncidents();
    } catch (err) {
      setError('Error updating status');
      console.error(err);
    }
  };

  const handleAssignUser = async (id: string, userId: string | null) => {
    try {
      const response = await fetch(`/api/incidents/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        if (errorData.error) {
          throw new Error(errorData.error);
        }
        throw new Error('Failed to assign user');
      }
      await fetchIncidents();
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Error assigning user');
      }
      console.error(err);
    }
  };

  return (
    <main className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Panel de Seguimiento de Incidentes</h1>
        <button
          onClick={() => setIsIncidentModalOpen(true)}
          className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          Nuevo Incidente
        </button>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
          <span className="block sm:inline">{error}</span>
          <span className="absolute top-0 bottom-0 right-0 px-4 py-3" onClick={() => setError(null)}>
            <svg className="fill-current h-6 w-6 text-red-500" role="button" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
              <title>Close</title>
              <path d="M14.348 14.849a1.2 1.2 0 0 1-1.697 0L10 11.819l-2.651 3.029a1.2 1.2 0 1 1-1.697-1.697l2.758-3.15-2.759-3.152a1.2 1.2 0 1 1 1.697-1.697L10 8.183l2.651-3.031a1.2 1.2 0 1 1 1.697 1.697l-2.758 3.152 2.758 3.15a1.2 1.2 0 0 1 0 1.698z"/>
            </svg>
          </span>
        </div>
      )}

      <IncidentTable
        incidents={incidents}
        users={users}
        onUpdateStatus={handleUpdateStatus}
        onAssignUser={handleAssignUser}
        onViewDetails={setSelectedIncident}
        onCreateUser={() => setIsUserModalOpen(true)}
      />

      {isIncidentModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full">
            <IncidentForm
              onSubmit={handleCreateIncident}
              onCancel={() => setIsIncidentModalOpen(false)}
            />
          </div>
        </div>
      )}

      {isUserModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <UserForm
              onSubmit={handleCreateUser}
              onCancel={() => setIsUserModalOpen(false)}
            />
          </div>
        </div>
      )}

      {selectedIncident && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full">
            <IncidentDetails
              incident={selectedIncident}
              onClose={() => setSelectedIncident(null)}
            />
          </div>
        </div>
      )}
    </main>
  );
}
