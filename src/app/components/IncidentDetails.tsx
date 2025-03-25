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

interface IncidentDetailsProps {
  incident: Incident;
  onClose: () => void;
}

export default function IncidentDetails({ incident, onClose }: IncidentDetailsProps) {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <h2 className="text-2xl font-bold text-gray-900">Detalles del Incidente</h2>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-gray-500"
        >
          <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <div className="space-y-4">
        <div>
          <h3 className="text-sm font-medium text-gray-500">Título</h3>
          <p className="mt-1 text-lg text-gray-900">{incident.title}</p>
        </div>

        <div>
          <h3 className="text-sm font-medium text-gray-500">Descripción</h3>
          <p className="mt-1 text-gray-900 whitespace-pre-wrap">{incident.description}</p>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div>
            <h3 className="text-sm font-medium text-gray-500">Prioridad</h3>
            <span className={`mt-1 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
              ${incident.priority === 'HIGH' ? 'bg-red-100 text-red-800' :
                incident.priority === 'MEDIUM' ? 'bg-yellow-100 text-yellow-800' :
                'bg-green-100 text-green-800'}`}>
              {incident.priority}
            </span>
          </div>

          <div>
            <h3 className="text-sm font-medium text-gray-500">Estado</h3>
            <span className={`mt-1 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
              ${incident.status === 'OPEN' ? 'bg-blue-100 text-blue-800' :
                incident.status === 'IN_PROGRESS' ? 'bg-yellow-100 text-yellow-800' :
                incident.status === 'CLOSED' ? 'bg-green-100 text-green-800' :
                'bg-gray-100 text-gray-800'}`}>
              {incident.status}
            </span>
          </div>

          <div>
            <h3 className="text-sm font-medium text-gray-500">Área</h3>
            <p className="mt-1 text-gray-900">{incident.area}</p>
          </div>
        </div>

        <div>
          <h3 className="text-sm font-medium text-gray-500">Asignado a</h3>
          <p className="mt-1 text-gray-900">
            {incident.assignedTo ? (
              <span className="inline-flex items-center">
                <span className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 text-sm font-medium">
                  {incident.assignedTo.name.charAt(0).toUpperCase()}
                </span>
                <span className="ml-2">{incident.assignedTo.name}</span>
                <span className="ml-2 text-gray-500">{incident.assignedTo.email}</span>
              </span>
            ) : (
              'Sin asignar'
            )}
          </p>
        </div>

        <div>
          <h3 className="text-sm font-medium text-gray-500">Fecha de creación</h3>
          <p className="mt-1 text-gray-900">
            {new Date(incident.createdAt).toLocaleDateString('es-ES', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            })}
          </p>
        </div>
      </div>
    </div>
  );
} 