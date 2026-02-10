import { Injectable } from '@nestjs/common';
import { User } from '../domain/users.entity';
import { PaginationMeta } from '@/common/schemas/pagination.schema';
import { FindAllUserResponseDto } from '../dto/find-all-user.dto';

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

	static toFindAll(pagination: PaginationMeta, users: User[]): FindAllUserResponseDto {
		return {
			data: users.map((user) => this.base(user)),
			meta: pagination,
		};
	}
}
