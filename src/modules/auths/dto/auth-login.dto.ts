import { UserBaseSchema } from '@/modules/users/dto/user.dto';
import { ApiProperty } from '@nestjs/swagger';
import { createZodDto } from 'nestjs-zod';
import z from 'zod';

export const AuthLoginSchema = z.object({
	email: z.email({ error: 'Email tidak valid' }).min(1, { error: 'Email tidak boleh kosong' }),
	password: z.string().min(1, { error: 'Password tidak boleh kosong' }),
});

export class AuthLoginDto {
	static schema = AuthLoginSchema;

	@ApiProperty({ example: 'lindan@gmail.com' })
	email!: string;

	@ApiProperty({ example: 'lindan123' })
	password!: string;
}

export const AuthLoginReponseSchema = z.object({
	access_token: z.string(),
	data: UserBaseSchema.omit({
		password: true,
	}),
});

export class AuthLoginResponseDto extends createZodDto(AuthLoginReponseSchema) {}
