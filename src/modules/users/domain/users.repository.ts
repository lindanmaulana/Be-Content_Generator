import { User } from '@/modules/users/domain/users.entity';
import { PaginationUserParams } from './users.repository.interface';

export interface UserRepository {
	findAll(pagination: PaginationUserParams): Promise<User[]>;
	findById(id: string): Promise<User | null>;
	findByEmail(email: string): Promise<User | null>;
	findCount(pagination: PaginationUserParams): Promise<number>;

	create(user: User): Promise<User>;
}
