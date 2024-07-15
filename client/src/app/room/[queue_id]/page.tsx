import MemberTable from '@/components/room/MemberTable';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { prisma } from '@/lib/db';
import { getAuthSession } from '@/lib/nextauth';
import { socket } from '@/utils/socket';
import { redirect } from 'next/navigation';
import React from 'react';

type Props = {
  params: {
    queue_id: string;
  };
};

const QueueRoom = async ({ params: { queue_id } }: Props) => {
  const session = await getAuthSession();
  if (!session?.user) {
    return redirect('/');
  }
  const queue = await prisma.queue.findUnique({
    where: {
      id: queue_id,
    },
    include: {
      members: {},
    },
  });
  if (!queue) {
    return redirect('/');
  }

  return (
    <main className="p-8 mx-auto max-w-7xl">
      <div className="flex items-center">
        <h2 className="mr-2 text-3xl font-bold tracking-tight">
          {queue?.name}
        </h2>
      </div>
      <div className="grid gap-4 mt-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Room Details</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Max Capacity: {queue?.maxCapacity}</p>
            <p>Duration: {queue?.maxDuration}hrs</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-center font-bold tracking-widest text-4xl">
              {queue?.join_id}
            </CardTitle>
            <CardDescription className="text-center">
              Share this code with your friends to join the queue
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
      <div className="grid mt-4">
        <MemberTable allMembers={queue.members} />
      </div>
    </main>
  );
};

export default QueueRoom;
