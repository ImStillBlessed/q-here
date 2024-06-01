import { prisma } from '@/lib/db';
import { getAuthSession } from '@/lib/nextauth';
import { QueueSchema } from '@/schemas/form/queue';
import { NextResponse } from 'next/server';
import { ZodError } from 'zod';
import { socket } from '@/utils/socket';

export async function POST(req: Request, res: Response) {
  try {
    const session = await getAuthSession();
    if (!session?.user) {
      return NextResponse.json(
        {
          error: 'you must be looged in',
        },
        { status: 401 }
      );
    }

    const body = await req.json();
    const { name, maxCapacity, maxDuration } = QueueSchema.parse(body);

    const queueData = await prisma.queue.create({
      data: {
        name: name,
        maxCapacity: maxCapacity,
        maxDuration: maxDuration,
        userId: session.user.id,
        status: 'open',
        join_id: Math.random().toString(36).substring(7),
      },
    });

    // send data to start the queue here
    socket.emit('createRoom', queueData);
    if (queueData === null) {
      return NextResponse.json(
        { error: 'unable to create Queue' },
        { status: 400 }
      );
    } else {
      return NextResponse.json({ queue: queueData }, { status: 201 });
    }
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json(
        {
          error: error.issues,
        },
        { status: 400 }
      );
    }
    return NextResponse.json(
      {
        error: 'An error occurred',
      },
      { status: 500 }
    );
  }
}
