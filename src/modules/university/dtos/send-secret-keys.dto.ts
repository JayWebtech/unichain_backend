import { z } from 'zod';

export const sendSecretKeysSchema = z.object({
  data: z.array(
    z.object({
      email: z.string().email('Invalid email address'),
      secretKey: z.string().min(1, 'Secret key is required'),
    })
  ).min(1, 'At least one email and secret key pair is required'),
});

export type SendSecretKeysDTO = z.infer<typeof sendSecretKeysSchema>; 