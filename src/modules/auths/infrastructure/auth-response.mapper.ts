import { Injectable } from '@nestjs/common';
import { Auth } from '../domain/auth.entity';
import { AuthLoginResponseDto } from '../dto/auth-login.dto';
import { AuthRegisterResponseDto } from '../dto/auth-register.dto';

@Injectable()
export class AuthResponseMapper {
	static base(userAuth: Auth) {
		return {
			id: userAuth.id,
			name: userAuth.name,
			email: userAuth.email,
			role: userAuth.role,
			created_at: userAuth.createdAt.toISOString(),
			updated_at: userAuth.updatedAt.toISOString(),
		};
	}

	static toLoginResponse(accessToken: string, userAuth: Auth): AuthLoginResponseDto {
		return {
			access_token: accessToken,
			data: this.base(userAuth),
		};
	}

	static toRegisterResponse(user: Auth): AuthRegisterResponseDto {
		return this.base(user);
	}
}
