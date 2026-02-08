import z from 'zod';

export const PaginationQuerySchema = z.object({
	page: z.coerce.number().int().positive().default(1),
	limit: z.coerce.number().int().positive().default(10),
});

export const PaginationMetaSchema = z.object({
	total_count: z.number().int().nonnegative(),
	total_page: z.number().int().nonnegative(),
	current_page: z.number().int().positive(),
	limit: z.number().int().positive(),
	next_page: z.number().int().positive().nullable(),
	prev_page: z.number().int().positive().nullable(),
	links: z.array(z.number().int().positive()),
});

export type PaginationQuery = z.infer<typeof PaginationQuerySchema>;
export type PaginationMeta = z.infer<typeof PaginationMetaSchema>;
