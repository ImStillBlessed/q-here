'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { useForm } from 'react-hook-form';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from './ui/form';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { useMutation } from 'react-query';
import axios from 'axios';
import { zodResolver } from '@hookform/resolvers/zod';
import { JoinSchema } from '@/schemas/form/queue';
import { useRouter } from 'next/navigation';
import { z } from 'zod';

type Props = {};

// Define input type based on the Zod schema
type Input = z.infer<typeof JoinSchema>;

const JoinQueue = (props: Props) => {
  const router = useRouter();

  // Setup the mutation for joining the queue
  const { mutate: addMember } = useMutation({
    mutationFn: async (input: Input) => {
      const response = await axios.post('/api/join-queue', input);
      return response.data;
    },
  });

  // Setup the form using react-hook-form with Zod resolver
  const form = useForm<Input>({
    resolver: zodResolver(JoinSchema),
  });

  // Handle form submission
  function onSubmit(input: Input) {
    addMember(input, {
      onSuccess: ({ member }) => {
        router.push(`/room/${member.queueId}`);
      },
      onError: (error) => {
        console.error('Error joining queue:', error);
      },
    });
  }

  return (
    <div>
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Join a Queue</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField
                control={form.control}
                name="join_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Join ID</FormLabel>
                    <FormControl>
                      <Input placeholder="######" {...field} />
                    </FormControl>
                    <FormDescription>
                      Type in the unique join ID.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit">Submit</Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};

export default JoinQueue;
