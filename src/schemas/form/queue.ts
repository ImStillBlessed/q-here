import { z } from 'zod';

export const QueueSchema = z.object({
  name: z
    .string()
    .min(3, { message: 'name must be at least 3 characters long' }),
  maxCapacity: z.number().int().positive(),
  maxDuration: z.number().int().positive().max(350),
});

export const JoinSchema = z.object({
  join_id: z.string(),
});
