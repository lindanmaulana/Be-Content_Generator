import { PaginationSchema } from '@/modules/generations/domain/generation.repository.interface';
import z from 'zod';

export const PaginationUserSchema = PaginationSchema;
export type PaginationUserParams = z.infer<typeof PaginationUserSchema>;
