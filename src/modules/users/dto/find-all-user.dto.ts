import { PaginationSchema } from '@/modules/generations/domain/generation.repository.interface';
import { createZodDto } from 'nestjs-zod';
import z from 'zod';
import { UserBaseSchema } from './user.dto';
import { PaginationMetaSchema } from '@/common/schemas/pagination.schema';

export const FindAllUserSchema = PaginationSchema;
export class FindAllUserDto extends createZodDto(FindAllUserSchema) {
	static schema = FindAllUserSchema;
}

export const FindAllUserResponseSchema = z.object({
	data: z.array(UserBaseSchema.omit({ password: true })),
	meta: PaginationMetaSchema,
});
export class FindAllUserResponseDto extends createZodDto(FindAllUserResponseSchema) {}
