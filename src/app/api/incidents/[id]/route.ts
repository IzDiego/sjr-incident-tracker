import { NextResponse } from 'next/server';
import { z } from 'zod';
import { Status } from '@prisma/client';
import { prisma } from '@/lib/prisma';

const updateSchema = z.object({
  status: z.nativeEnum(Status).optional(),
  userId: z.string().nullable().optional(),
});

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const validatedData = updateSchema.parse(body);

    const incident = await prisma.incident.update({
      where: { id: params.id },
      data: validatedData,
      include: {
        assignedTo: true,
      },
    });

    return NextResponse.json(incident);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation error', details: error.errors },
        { status: 400 }
      );
    }
    console.error('Error updating incident:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const incident = await prisma.incident.findUnique({
      where: {
        id: params.id,
      },
    });
    if (!incident) {
      return NextResponse.json(
        { error: 'Incident not found' },
        { status: 404 }
      );
    }
    return NextResponse.json(incident);
  } catch (error) {
    console.error('Error fetching incident:', error);
    return NextResponse.json(
      { error: 'Error fetching incident' },
      { status: 500 }
    );
  }
} 