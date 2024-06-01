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
type Input = z.infer<typeof JoinSchema>;

const JoinQueue = (props: Props) => {
  const router = useRouter();
  const { mutate: addMember } = useMutation({
    mutationFn: async (join_id: Input) => {
      const response = await axios.post('/api/join-queue', { join_id });
      return response.data;
    },
  });

  const form = useForm<Input>({
    resolver: zodResolver(JoinSchema),
  });
  function onSubmit(input: Input) {
    addMember(
      {
        join_id: input.join_id,
      },
      {
        onSuccess: ({ member }) => {
          router.push(`/room/${member.queueId}`);
        },
        onError: () => {
          console.log('error');
        },
      }
    );
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
                      type in the unique join id
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
