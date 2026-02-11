import { createZodDto } from 'nestjs-zod';
import { UserBaseSchema } from './user.dto';

export const UpdateProfileUserSchema = UserBaseSchema.pick({
	name: true,
});
export class UpdateProfileUserDto extends createZodDto(UpdateProfileUserSchema) {
	static schema = UpdateProfileUserSchema;
}

export const UpdateProfileUserResponseSchema = UserBaseSchema.omit({
	password: true,
});
export class UpdateProfileUserResponseDto extends createZodDto(UpdateProfileUserResponseSchema) {}
