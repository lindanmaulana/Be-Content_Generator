import { PaginationQuerySchema } from '@/common/schemas/pagination.schema';
import z from 'zod';

export const findAllGenerationSchema = PaginationQuerySchema;
export type findAllGenerationFilter = z.infer<typeof findAllGenerationSchema>;
