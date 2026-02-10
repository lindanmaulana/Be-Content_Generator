import { User } from '@/modules/users/domain/users.entity';
import { UserResponseMapper } from '@/modules/users/infrastructure/user-response.mapper';
import { Injectable } from '@nestjs/common';
import { AuthLoginResponseDto } from '../dto/auth-login.dto';
import { AuthRegisterResponseDto } from '../dto/auth-register.dto';

@Injectable()
export class AuthResponseMapper {
	static toLoginResponse(accessToken: string, user: User): AuthLoginResponseDto {
		return {
			access_token: accessToken,
			data: UserResponseMapper.base(user),
		};
	}

	static toRegisterResponse(user: User): AuthRegisterResponseDto {
		return UserResponseMapper.base(user);
	}
}
