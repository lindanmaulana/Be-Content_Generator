import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { User } from './domain/users.entity';
import { REPOSITORY_TOKENS } from '@/common/constants/tokens';
import type { UserRepository } from './domain/users.repository';

@Injectable()
export class UsersSharedService {
	constructor(@Inject(REPOSITORY_TOKENS.USER) private readonly userRepository: UserRepository) {}

	async validateUserExists(userId: string): Promise<User> {
		const user = await this.userRepository.findById(userId);

		if (!user) throw new NotFoundException('User not found!');

		return user;
	}
}
