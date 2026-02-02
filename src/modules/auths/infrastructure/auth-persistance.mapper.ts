import { User } from '@prisma/client';
import { Auth } from '../domain/auth.entity';

export class AuthPersistanceMapper {
	static toEntity(user: User): Auth {
		return Auth.restore({
			id: user.id,
			name: user.name,
			email: user.email,
			password: user.password,
			role: user.role,
			created_at: user.created_at,
			updated_at: user.updated_at,
		});
	}

	static toPersistence(entity: Auth) {
		return {
			name: entity.name,
			email: entity.email,
			password: entity.password,
			role: entity.role,
			created_at: entity.createdAt,
			updated_at: entity.updatedAt,
		};
	}
}
