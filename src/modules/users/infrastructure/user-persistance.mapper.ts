import { User as PrismaUser } from '@prisma/client';
import { User } from '@/modules/users/domain/users.entity';

export class UserPersistanceMapper {
	static toEntity(user: PrismaUser): User {
		return User.restore({
			id: user.id,
			name: user.name,
			email: user.email,
			password: user.password,
			role: user.role,
			created_at: user.created_at,
			updated_at: user.updated_at,
		});
	}

	static toPersistence(entity: User) {
		const data = {
			name: entity.name,
			email: entity.email,
			password: entity.password,
			role: entity.role,
			created_at: entity.createdAt,
			updated_at: entity.updatedAt,
		};

		Object.keys(data).forEach((key) => data[key] === undefined && delete data[key]);

		return data;
	}
}
