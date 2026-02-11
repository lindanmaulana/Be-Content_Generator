import { createZodDto } from 'nestjs-zod';
import { UserBaseSchema } from './user.dto';

export const GetProfileUserSchema = UserBaseSchema.omit({
	password: true,
});

export class GetProfileUserResponseDto extends createZodDto(GetProfileUserSchema) {}
