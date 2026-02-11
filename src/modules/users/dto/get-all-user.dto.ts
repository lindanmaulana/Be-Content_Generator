import { PaginationSchema } from '@/modules/generations/domain/generation.repository.interface';
import { createZodDto } from 'nestjs-zod';
import z from 'zod';
import { UserBaseSchema } from './user.dto';
import { PaginationMetaSchema } from '@/common/schemas/pagination.schema';

export const GetAllUserSchema = PaginationSchema;
export class GetAllUserDto extends createZodDto(GetAllUserSchema) {
	static schema = GetAllUserSchema;
}

export const GetAllUserResponseSchema = z.object({
	data: z.array(UserBaseSchema.omit({ password: true })),
	meta: PaginationMetaSchema,
});
export class GetAllUserResponseDto extends createZodDto(GetAllUserResponseSchema) {}
