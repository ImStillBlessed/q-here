'use client';
import { Card, CardDescription, CardHeader } from '@/components/ui/card';
import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();
  return (
    <div className="grid place-items-center justify-center">
      <h1>Home</h1>
      <p>Welcome to the home page</p>

      <div className="flex items-center justify-between max-w-[400px] space-x-2 cursor-pointer">
        <Card
          onClick={() => {
            router.push('/create-queue');
          }}
        >
          <CardHeader>create a queue</CardHeader>
          <CardDescription>create a queue description</CardDescription>
        </Card>

        <Card
          onClick={() => {
            router.push('/join-queue');
          }}
        >
          <CardHeader>join a queue</CardHeader>
          <CardDescription>create a queue description</CardDescription>
        </Card>
      </div>
    </div>
  );
}
