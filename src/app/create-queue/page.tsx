import React from 'react';
import QueueCreation from '@/components/QueueCreation';
import { getAuthSession } from '@/lib/nextauth';
import { redirect } from 'next/navigation';

type Props = {};

const QueuePage = async (props: Props) => {
  const session = await getAuthSession();
  if (!session?.user) {
    redirect('/');
  }
  return <QueueCreation />;
};

export default QueuePage;
