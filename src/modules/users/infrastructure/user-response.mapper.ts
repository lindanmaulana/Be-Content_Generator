import { Injectable } from '@nestjs/common';
import { User } from '../domain/user.entity';

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
}
