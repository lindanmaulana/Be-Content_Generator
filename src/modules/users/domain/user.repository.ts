import { User } from '@/modules/users/domain/user.entity';

export interface UserRepository {
	findById(id: string): Promise<User | null>;
	findByEmail(email: string): Promise<User | null>;

	create(user: User): Promise<User>;
}
