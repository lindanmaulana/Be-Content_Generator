import { BaseRepository } from '@/core/database/prisma/base.repository';
import { PrismaService } from '@/core/database/prisma/prisma.service';
import { Inject, Injectable } from '@nestjs/common';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';
import { Auth } from '../domain/auth.entity';
import { AuthPersistanceMapper } from './auth-persistance.mapper';

@Injectable()
export class AuthPrismaRepository extends BaseRepository {
	constructor(
		@Inject(WINSTON_MODULE_NEST_PROVIDER) public logger: Logger,
		private prisma: PrismaService,
	) {
		super(logger, AuthPrismaRepository.name);
	}

	async findByEmail(email: string): Promise<Auth | null> {
		return this.tryCatch(async () => {
			const result = await this.prisma.user.findUnique({ where: { email: email } });
			if (!result) return null;

			return AuthPersistanceMapper.toEntity(result);
		});
	}

	async create(user: Auth): Promise<Auth> {
		return this.tryCatch(async () => {
			console.log({ 2: user });
			const data = AuthPersistanceMapper.toPersistence(user);

			console.log({ 3: data });
			const result = await this.prisma.user.create({ data: data });

			return AuthPersistanceMapper.toEntity(result);
		});
	}
}
