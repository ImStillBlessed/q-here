import { getAuthSession } from '@/lib/nextauth';
import { redirect } from 'next/navigation';
import JoinQueue from '@/components/JoinQueue';
import React from 'react';

type Props = {};

const JoinPage = async (props: Props) => {
  const session = await getAuthSession();
  if (!session?.user) {
    redirect('/');
  }
  return <JoinQueue />;
};

export default JoinPage;
