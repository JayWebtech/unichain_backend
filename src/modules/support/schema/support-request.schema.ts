import { z } from 'zod';

export const supportRequestSchema = z
  .object({
    name: z.string()
      .min(1, 'Name is required')
      .max(100, 'Name must not exceed 100 characters'),
    company: z.string()
      .min(1, 'Company is required')
      .max(100, 'Company name must not exceed 100 characters'),
    email: z.string()
      .min(1, 'Email is required')
      .email('Please enter a valid email address'),
    request: z.string()
      .min(1, 'Request details are required')
      .max(2000, 'Request must not exceed 2000 characters')
  })
  .required();

export type SupportRequestDTO = z.infer<typeof supportRequestSchema>;