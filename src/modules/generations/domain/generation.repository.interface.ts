import { PaginationQuerySchema } from '@/common/schemas/pagination.schema';
import z from 'zod';

export interface GenerationFilters {
	user_id?: string;
}

export const PaginationSchema = PaginationQuerySchema;
export type GenerationPaginationParams = z.infer<typeof PaginationSchema>;
