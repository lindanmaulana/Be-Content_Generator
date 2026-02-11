import { Injectable } from '@nestjs/common';
import { User } from '../domain/users.entity';
import { PaginationMeta } from '@/common/schemas/pagination.schema';
import { GetAllUserResponseDto } from '../dto/get-all-user.dto';
import { GetProfileUserResponseDto } from '../dto/get-profile-user.dto';
import { UpdateProfileUserResponseDto } from '../dto/update-profile-user.dto';

@Injectable()
export class UserResponseMapper {
	static base(user: User) {
		return {
			id: user.id,
			name: user.name,
			email: user.email,
			role: user.role,
			created_at: user.createdAt.toISOString(),
			updated_at: user.updatedAt.toISOString(),
		};
	}

	static toGetAll(pagination: PaginationMeta, users: User[]): GetAllUserResponseDto {
		return {
			data: users.map((user) => this.base(user)),
			meta: pagination,
		};
	}

	static toGetProfile(user: User): GetProfileUserResponseDto {
		return this.base(user);
	}

	static toUpdateProfile(user: User): UpdateProfileUserResponseDto {
		return this.base(user);
	}
}
