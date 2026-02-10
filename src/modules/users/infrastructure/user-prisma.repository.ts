import { BaseRepository } from '@/core/database/prisma/base.repository';
import { Inject, Injectable } from '@nestjs/common';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';
import { User } from '@/modules/users/domain/users.entity';
import { PrismaService } from '@/core/database/prisma/prisma.service';
import { UserPersistanceMapper } from './user-persistance.mapper';
import { PaginationUserParams } from '../domain/users.repository.interface';

@Injectable()
export class UserPrismaRepository extends BaseRepository {
	constructor(
		@Inject(WINSTON_MODULE_NEST_PROVIDER) public logger: Logger,
		private prismaService: PrismaService,
	) {
		super(logger, UserPrismaRepository.name);
	}

	async findAll(pagination: PaginationUserParams): Promise<User[]> {
		return this.tryCatch(async () => {
			const result = await this.prismaService.user.findMany({
				skip: (pagination.page - 1) * pagination.limit,
				take: pagination.limit,
			});

			return result.map((user) => UserPersistanceMapper.toEntity(user));
		});
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

	async findCount(pagination: PaginationUserParams): Promise<number> {
		return this.tryCatch(() =>
			this.prismaService.user.count({ skip: (pagination.page - 1) * pagination.limit, take: pagination.limit }),
		);
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
