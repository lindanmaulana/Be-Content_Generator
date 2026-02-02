import { UserBaseSchema } from '@/modules/users/dto/user.dto';
import { ApiProperty } from '@nestjs/swagger';
import { createZodDto } from 'nestjs-zod';

export const AuthRegisterSchema = UserBaseSchema.pick({
	name: true,
	email: true,
	password: true,
});

export class AuthRegisterDto {
	static schema = AuthRegisterSchema;

	@ApiProperty({ example: 'Lindan Maulana' })
	name!: string;

	@ApiProperty({ example: 'lindan@gmail.com' })
	email!: string;

	@ApiProperty({ example: 'lindan123' })
	password!: string;
}

export const AuthRegisterResponseSchema = UserBaseSchema.omit({ password: true });
export class AuthRegisterResponseDto extends createZodDto(AuthRegisterResponseSchema) {}
