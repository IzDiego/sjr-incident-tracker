import { z } from 'zod';
import { Priority, Status } from '@prisma/client';

export const incidentSchema = z.object({
  title: z.string()
    .min(3, 'Title must be at least 3 characters')
    .max(100, 'Title must be less than 100 characters')
    .trim(),
  description: z.string()
    .min(10, 'Description must be at least 10 characters')
    .trim(),
  priority: z.nativeEnum(Priority),
  area: z.string()
    .min(2, 'Area must be at least 2 characters')
    .max(50, 'Area must be less than 50 characters')
    .trim(),
  userId: z.string().optional(),
});

export const userSchema = z.object({
  email: z.string()
    .email('Invalid email address')
    .trim(),
  name: z.string()
    .min(2, 'Name must be at least 2 characters')
    .max(50, 'Name must be less than 50 characters')
    .trim(),
});

export const updateIncidentSchema = z.object({
  status: z.nativeEnum(Status),
  userId: z.string().optional(),
}); 