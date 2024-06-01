'use client';
import {
  Card,
  CardHeader,
  CardDescription,
  CardContent,
} from '@/components/ui/card';
import { QueueSchema } from '@/schemas/form/queue';
import React from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
} from '@/components/ui/select';
import { useRouter } from 'next/navigation';
import { useMutation } from 'react-query';
import axios from 'axios';

type Props = {};

type FormValues = z.infer<typeof QueueSchema>;

const QueueCreation = (props: Props) => {
  const router = useRouter();
  const { mutate: startRoom } = useMutation({
    mutationFn: async ({ name, maxCapacity, maxDuration }: FormValues) => {
      const response = await axios.post('/api/create-queue', {
        name,
        maxCapacity,
        maxDuration,
      });
      return response.data;
    },
  });

  const form = useForm<FormValues>({
    resolver: zodResolver(QueueSchema),
    defaultValues: {
      name: 'untitled',
      maxCapacity: 30,
    },
  });

  function onSubmit(values: FormValues) {
    startRoom(
      {
        name: values.name,
        maxCapacity: values.maxCapacity,
        maxDuration: values.maxDuration,
      },
      {
        onSuccess: ({ queue }) => {
          router.push(`/room/${queue.id}`);
        },
        onError: () => {
          console.log('error');
        },
      }
    );
  }

  return (
    <div className="absolute -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2">
      <Card>
        <CardHeader>CREATE A QUEUE</CardHeader>
        <CardDescription></CardDescription>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input placeholder="untitled" {...field} />
                    </FormControl>
                    <FormDescription>Name of the Queue.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="maxCapacity"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Maximum Capacity</FormLabel>
                    <FormControl>
                      <Input
                        placeholder=""
                        {...field}
                        type="number"
                        onChange={(e) => {
                          form.setValue(
                            'maxCapacity',
                            parseInt(e.target.value)
                          );
                        }}
                      />
                    </FormControl>
                    <FormDescription>
                      Maximum number of members.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="maxDuration"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Close Time for in hours</FormLabel>
                    <FormControl>
                      {/* <Input
                        aria-label="Choose time"
                        className="w-full"
                        id="time"
                        type="time"
                        onChange={(e) => {
                          const selectedTime = e.target.value;
                          let [hours, minutes] = selectedTime.split(':');
                          const selectedDateTime = new Date();
                          selectedDateTime.setHours(
                            parseInt(hours),
                            parseInt(minutes),
                            0,
                            0
                          );
                          const now = new Date();
                          const differenceInMinutes = Math.floor(
                            (selectedDateTime.getTime() - now.getTime()) /
                              (1000 * 60)
                          );

                          console.log(differenceInMinutes);
                          form.setValue(
                            'maxDuration',
                            parseInt(e.target.value)
                          );
                        }}
                      /> */}

                      <Input
                        placeholder=""
                        {...field}
                        type="number"
                        onChange={(e) => {
                          form.setValue(
                            'maxDuration',
                            parseInt(e.target.value)
                          );
                        }}
                      />

                      {/* <Select>
                        <SelectTrigger aria-label="Hour" id="hour">
                          <SelectValue placeholder="Hour" />
                        </SelectTrigger>
                        <SelectContent />
                      </Select>
                      <Select>
                        <SelectTrigger aria-label="Minute" id="minute">
                          <SelectValue placeholder="Minute" />
                        </SelectTrigger>
                        <SelectContent />
                      </Select> */}
                    </FormControl>
                    <FormDescription>Close queue at.</FormDescription>
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

export default QueueCreation;
