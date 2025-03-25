'use client';

import { useState } from 'react';
import { z } from 'zod';
import { Status } from '@prisma/client';

const incidentSchema = z.object({
  title: z.string()
    .min(5, 'El título debe tener al menos 5 caracteres')
    .max(100, 'El título no puede tener más de 100 caracteres'),
  description: z.string()
    .min(10, 'La descripción debe tener al menos 10 caracteres')
    .max(500, 'La descripción no puede tener más de 500 caracteres'),
  priority: z.enum(['HIGH', 'MEDIUM', 'LOW']),
  area: z.string()
    .min(2, 'El área debe tener al menos 2 caracteres')
    .max(50, 'El área no puede tener más de 50 caracteres'),
  status: z.nativeEnum(Status),
  userId: z.string().nullable(),
  assignedTo: z.object({
    id: z.string(),
    name: z.string(),
    email: z.string()
  }).nullable(),
});

type IncidentFormData = z.infer<typeof incidentSchema>;

interface IncidentFormProps {
  onSubmit: (data: IncidentFormData) => Promise<boolean>;
  onCancel: () => void;
}

export default function IncidentForm({ onSubmit, onCancel }: IncidentFormProps) {
  const [formData, setFormData] = useState<IncidentFormData>({
    title: '',
    description: '',
    priority: 'MEDIUM',
    area: '',
    status: Status.OPEN,
    userId: null,
    assignedTo: null,
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrors({});

    try {
      const validatedData = incidentSchema.parse(formData);
      const success = await onSubmit(validatedData);
      if (success) {
        setFormData({
          title: '',
          description: '',
          priority: 'MEDIUM',
          area: '',
          status: Status.OPEN,
          userId: null,
          assignedTo: null,
        });
      }
    } catch (err) {
      if (err instanceof z.ZodError) {
        const newErrors: { [key: string]: string } = {};
        err.errors.forEach(error => {
          if (error.path[0]) {
            newErrors[error.path[0].toString()] = error.message;
          }
        });
        setErrors(newErrors);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Nuevo Incidente</h2>
      </div>

      <div>
        <label htmlFor="title" className="block text-sm font-medium text-gray-700">
          Título
        </label>
        <input
          type="text"
          id="title"
          name="title"
          value={formData.title}
          onChange={handleChange}
          className={`mt-1 block w-full rounded-md shadow-sm
            ${errors.title ? 'border-red-300' : 'border-gray-300'}
            focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm`}
        />
        {errors.title && (
          <p className="mt-2 text-sm text-red-600">{errors.title}</p>
        )}
      </div>

      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700">
          Descripción
        </label>
        <textarea
          id="description"
          name="description"
          rows={4}
          value={formData.description}
          onChange={handleChange}
          className={`mt-1 block w-full rounded-md shadow-sm
            ${errors.description ? 'border-red-300' : 'border-gray-300'}
            focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm`}
        />
        {errors.description && (
          <p className="mt-2 text-sm text-red-600">{errors.description}</p>
        )}
      </div>

      <div>
        <label htmlFor="priority" className="block text-sm font-medium text-gray-700">
          Prioridad
        </label>
        <select
          id="priority"
          name="priority"
          value={formData.priority}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        >
          <option value="HIGH">Alta</option>
          <option value="MEDIUM">Media</option>
          <option value="LOW">Baja</option>
        </select>
      </div>

      <div>
        <label htmlFor="area" className="block text-sm font-medium text-gray-700">
          Área
        </label>
        <input
          type="text"
          id="area"
          name="area"
          value={formData.area}
          onChange={handleChange}
          className={`mt-1 block w-full rounded-md shadow-sm
            ${errors.area ? 'border-red-300' : 'border-gray-300'}
            focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm`}
        />
        {errors.area && (
          <p className="mt-2 text-sm text-red-600">{errors.area}</p>
        )}
      </div>

      <div className="flex justify-end gap-3">
        <button
          type="button"
          onClick={onCancel}
          className="inline-flex justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
        >
          Cancelar
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className={`inline-flex justify-center rounded-md border border-transparent px-4 py-2 text-sm font-medium text-white shadow-sm
            ${isSubmitting
              ? 'bg-indigo-400 cursor-not-allowed'
              : 'bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2'
            }`}
        >
          {isSubmitting ? 'Guardando...' : 'Guardar'}
        </button>
      </div>
    </form>
  );
} 