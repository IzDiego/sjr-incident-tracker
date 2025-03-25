'use client';

import { Status } from '@prisma/client';

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

interface IncidentTableProps {
  incidents: Incident[];
  users: User[];
  onUpdateStatus: (id: string, status: Status) => void;
  onAssignUser: (id: string, userId: string | null) => void;
  onViewDetails: (incident: Incident) => void;
  onCreateUser: () => void;
}

export default function IncidentTable({ 
  incidents, 
  users, 
  onUpdateStatus, 
  onAssignUser,
  onViewDetails,
  onCreateUser
}: IncidentTableProps) {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Priority</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Area</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              <div className="flex items-center justify-between">
                <span>Assigned To</span>
                <button
                  onClick={onCreateUser}
                  className="inline-flex items-center px-2 py-1 text-xs font-medium text-indigo-600 hover:text-indigo-900"
                >
                  <svg
                    className="w-4 h-4 mr-1"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 4v16m8-8H4"
                    />
                  </svg>
                  Add User
                </button>
              </div>
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {incidents.map((incident) => (
            <tr key={incident.id}>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm font-medium text-gray-900">{incident.title}</div>
                <div className="text-sm text-gray-500">{incident.description}</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full
                  ${incident.priority === 'HIGH' ? 'bg-red-100 text-red-800' :
                    incident.priority === 'MEDIUM' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-green-100 text-green-800'}`}>
                  {incident.priority}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <select
                  value={incident.status}
                  onChange={(e) => onUpdateStatus(incident.id, e.target.value as Status)}
                  className="block w-full px-3 py-1.5 text-base font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none"
                >
                  {Object.values(Status).map((status) => (
                    <option key={status} value={status}>
                      {status}
                    </option>
                  ))}
                </select>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{incident.area}</td>
              <td className="px-6 py-4 whitespace-nowrap">
                <select
                  value={incident.userId || ''}
                  onChange={(e) => onAssignUser(incident.id, e.target.value || null)}
                  className="block w-full px-3 py-1.5 text-base font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none"
                >
                  <option value="">Unassigned</option>
                  {users.map((user) => (
                    <option key={user.id} value={user.id}>
                      {user.name}
                    </option>
                  ))}
                </select>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {new Date(incident.createdAt).toLocaleDateString()}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <button
                  className="text-indigo-600 hover:text-indigo-900"
                  onClick={() => onViewDetails(incident)}
                >
                  View Details
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
} 