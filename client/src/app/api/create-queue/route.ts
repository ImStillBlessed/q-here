import { prisma } from '@/lib/db';
import { getAuthSession } from '@/lib/nextauth';
import { QueueSchema } from '@/schemas/form/queue';
import { NextResponse } from 'next/server';
import { ZodError } from 'zod';
import { socket } from '@/utils/socket';

export async function POST(req: Request) {
  try {
    const session = await getAuthSession();
    if (!session?.user) {
      return NextResponse.json(
        { error: 'You must be logged in' },
        { status: 401 }
      );
    }

    const body = await req.json();
    const { name, maxCapacity, maxDuration } = QueueSchema.parse(body);

    const queueData = await prisma.queue.create({
      data: {
        name,
        maxCapacity,
        maxDuration,
        userId: session.user.id,
        status: 'open',
        join_id: Math.random().toString(36).substring(7),
      },
    });

    if (queueData) {
      // Emit the created queue data to the socket server
      console.log('Emitting create_room:', queueData);
      socket.emit('create_room', queueData);
      return NextResponse.json({ queue: queueData }, { status: 201 });
    } else {
      return NextResponse.json(
        { error: 'Unable to create Queue' },
        { status: 400 }
      );
    }
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json({ error: error.issues }, { status: 400 });
    }
    return NextResponse.json({ error: 'An error occurred' }, { status: 500 });
  }
}
