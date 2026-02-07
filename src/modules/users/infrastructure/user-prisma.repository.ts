import { BaseRepository } from '@/core/database/prisma/base.repository';
import { Inject, Injectable } from '@nestjs/common';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';
import { User } from '@/modules/users/domain/user.entity';
import { PrismaService } from '@/core/database/prisma/prisma.service';
import { UserPersistanceMapper } from './user-persistance.mapper';

@Injectable()
export class UserPrismaRepository extends BaseRepository {
	constructor(
		@Inject(WINSTON_MODULE_NEST_PROVIDER) public logger: Logger,
		private prismaService: PrismaService,
	) {
		super(logger, UserPrismaRepository.name);
	}

	async findById(id: string): Promise<User | null> {
		return this.tryCatch(async () => {
			const result = await this.prismaService.user.findUnique({ where: { id: id } });

			if (!result) return null;

			return UserPersistanceMapper.toEntity(result);
		});
	}

	async findByEmail(email: string): Promise<User | null> {
		return this.tryCatch(async () => {
			const result = await this.prismaService.user.findFirst({ where: { email: email } });

			if (!result) return null;

			return UserPersistanceMapper.toEntity(result);
		});
	}

	async create(user: User): Promise<User> {
		return this.tryCatch(async () => {
			const data = UserPersistanceMapper.toPersistence(user);

			const result = await this.prismaService.user.create({
				data: data,
			});

			return UserPersistanceMapper.toEntity(result);
		});
	}
}
