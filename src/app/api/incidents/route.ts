import { NextResponse } from 'next/server';
import { z } from 'zod';
import { Status } from '@prisma/client';
import { prisma } from '@/lib/prisma';

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
  status: z.nativeEnum(Status).optional(),
  userId: z.string().nullable().optional(),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const validatedData = incidentSchema.parse(body);

    const incident = await prisma.incident.create({
      data: {
        ...validatedData,
        status: validatedData.status || Status.OPEN,
      },
      include: {
        assignedTo: true,
      },
    });

    return NextResponse.json(incident, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation error', details: error.errors },
        { status: 400 }
      );
    }
    console.error('Error creating incident:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const incidents = await prisma.incident.findMany({
      include: {
        assignedTo: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json(incidents);
  } catch (error) {
    console.error('Error fetching incidents:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 