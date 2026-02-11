import { BaseRepository } from '@/core/database/prisma/base.repository';
import { PrismaService } from '@/core/database/prisma/prisma.service';
import { Inject, Injectable } from '@nestjs/common';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';
import { Generation } from '../domain/generations.entity';
import { GenerationPersistanceMapper } from './generations-persistance.mapper';
import { GenerationFilters, GenerationPaginationParams } from '../domain/generation.repository.interface';

@Injectable()
export class GenerationPrismaRepository extends BaseRepository {
	constructor(
		@Inject(WINSTON_MODULE_NEST_PROVIDER) public logger: Logger,
		private prismaService: PrismaService,
	) {
		super(logger, GenerationPrismaRepository.name);
	}

	async findAll(filters: GenerationFilters, pagination: GenerationPaginationParams): Promise<Generation[]> {
		return this.tryCatch(async () => {
			const result = await this.prismaService.generation.findMany({
				where: { user_id: filters.user_id },
				skip: (pagination.page - 1) * pagination.limit,
				take: pagination.limit,
			});

			return result.map((generation) => GenerationPersistanceMapper.toEntity(generation));
		});
	}

	async findCount(filters: GenerationFilters, pagination: GenerationPaginationParams): Promise<number> {
		return this.tryCatch(async () =>
			this.prismaService.generation.count({
				where: {
					user_id: filters.user_id,
				},
				skip: (pagination.page - 1) * pagination.limit,
				take: pagination.limit,
			}),
		);
	}

	async sumDailyTokenUsage(userId: string): Promise<number> {
		return this.tryCatch(async () => {
			const startOfDay = new Date();
			startOfDay.setHours(0, 0, 0, 0);

			const result = await this.prismaService.generation.aggregate({
				where: { user_id: userId, created_at: { gte: startOfDay } },
				_sum: {
					total_tokens: true,
				},
			});

			if (!result._sum.total_tokens) return 0;

			return result._sum.total_tokens;
		});
	}

	async create(generation: Generation): Promise<Generation> {
		return this.tryCatch(async () => {
			const record = GenerationPersistanceMapper.toPersistance(generation);
			const result = await this.prismaService.generation.create({ data: record });

			return GenerationPersistanceMapper.toEntity(result);
		});
	}

	async update(generation: Generation): Promise<Generation> {
		return this.tryCatch(async () => {
			const record = GenerationPersistanceMapper.toPersistance(generation);
			const result = await this.prismaService.generation.update({
				where: { id: generation.id },
				data: record,
			});

			return GenerationPersistanceMapper.toEntity(result);
		});
	}
}
