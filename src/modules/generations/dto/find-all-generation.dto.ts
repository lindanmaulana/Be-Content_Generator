import { PaginationMetaSchema, PaginationQuerySchema } from '@/common/schemas/pagination.schema';
import { createZodDto } from 'nestjs-zod';
import { BaseGenerationSchema } from './generation.dto';
import z from 'zod';

export const FindAllGenerationSchema = PaginationQuerySchema;
export class FindAllGenerationDto extends createZodDto(FindAllGenerationSchema) {
	static schema = FindAllGenerationSchema;
}

export const FindAllGenerationResponseSchema = z.object({
	data: BaseGenerationSchema,
	meta: PaginationMetaSchema,
});
export class FindAllGenerationResponseDto extends createZodDto(FindAllGenerationResponseSchema) {}
