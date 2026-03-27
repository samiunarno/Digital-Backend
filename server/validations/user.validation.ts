import { z } from 'zod';

const usernameSchema = z.string()
  .trim()
  .min(3, 'Username must be at least 3 characters long')
  .max(20, 'Username must be at most 20 characters long')
  .regex(/^[a-zA-Z0-9_]+$/, 'Username can only contain letters, numbers, and underscores');

const passwordSchema = z.string()
  .min(8, 'Password must be at least 8 characters long')
  .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
  .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
  .regex(/[0-9]/, 'Password must contain at least one number')
  .regex(/[^a-zA-Z0-9]/, 'Password must contain at least one special character');

const roleSchema = z.enum(['admin', 'editor'], {
  message: 'Role must be either admin or editor',
});

const paramsSchema = z.object({
  id: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid user ID'),
});

export const loginSchema = z.object({
  body: z.object({
    username: z.string().min(1, 'Please provide a username'),
    password: z.string().min(1, 'Please provide a password'),
  }),
});

export const createUserSchema = z.object({
  body: z.object({
    username: usernameSchema,
    password: passwordSchema,
    role: roleSchema,
  }),
});

export const updateUserSchema = z.object({
  params: paramsSchema,
  body: z.object({
    username: usernameSchema.optional(),
    password: passwordSchema.optional(),
    role: roleSchema.optional(),
  }),
});

export const deleteUserSchema = z.object({
  params: paramsSchema,
});
