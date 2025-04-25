import { z } from 'zod';

export const registerUniversitySchema = z
  .object({
    university_name: z.string()
      .min(1, 'University name is required')
      .max(200, 'University name must not exceed 200 characters'),
    website_domain: z.string()
      .min(1, 'Website domain is required')
      .max(50, 'Website domain must not exceed 50 characters'),
    country: z.string()
      .min(1, 'Country is required')
      .max(50, 'Country name must not exceed 50 characters'),
    accreditation_body: z.string()
      .optional()
      .transform(val => val || undefined),
    university_email: z.string()
      .min(1, 'Email is required')
      .email('Please enter a valid email address'),
    wallet_address: z.string()
      .min(1, 'Wallet address is required')
      .max(50, 'Wallet address must not exceed 50 characters'),
    staff_name: z.string()
      .min(1, 'Staff name is required')
      .max(50, 'Staff name must not exceed 50 characters'),
    job_title: z.string()
      .min(1, 'Job title is required')
      .max(50, 'Job title must not exceed 50 characters'),
    phone_number: z.string()
      .min(1, 'Phone number is required')
      .max(15, 'Phone number must not exceed 15 characters'),
    password: z.string()
      .min(8, 'Password must be at least 8 characters')
      .max(50, 'Password must not exceed 50 characters')
      .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
      .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
      .regex(/[0-9]/, 'Password must contain at least one number')
      .regex(/[^A-Za-z0-9]/, 'Password must contain at least one special character'),
    is_verified: z.boolean()
      .default(false)
      .optional()
  })
  .required();

export type RegisterUniversityDTO = z.infer<typeof registerUniversitySchema>;