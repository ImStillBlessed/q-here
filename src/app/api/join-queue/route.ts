import { prisma } from '@/lib/db';
import { getAuthSession } from '@/lib/nextauth';
import { JoinSchema } from '@/schemas/form/queue';
import { socket } from '@/utils/socket';
import { NextResponse } from 'next/server';
import { ZodError } from 'zod';

export async function POST(req: Request, res: Response) {
  try {
    const session = await getAuthSession();
    if (!session?.user) {
      return NextResponse.json(
        { error: 'User must be logged in' },
        { status: 401 }
      );
    }
    const body = await req.json();

    const { join_id } = body.join_id;

    const queue = await prisma.queue.findFirst({
      where: {
        join_id,
      },
      include: {
        members: {},
      },
    });

    if (queue && queue.status == 'open') {
      const member = await prisma.member.create({
        data: {
          active: true,
          image: session?.user.image,
          userId: session?.user.id,
          queueId: queue.id,
        },
      });
      console.log('adding:', member, '\nMembers:', queue.members);
      socket.emit('update_room', member);
      return NextResponse.json({ member: member }, { status: 201 });
    } else {
      return NextResponse.json(
        { error: 'unable to join Queue' },
        { status: 400 }
      );
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
