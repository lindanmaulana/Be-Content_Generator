import { BaseRepository } from '@/core/database/prisma/base.repository';
import { PrismaService } from '@/core/database/prisma/prisma.service';
import { Inject, Injectable } from '@nestjs/common';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';
import { Generation } from '../domain/generations.entity';
import { GenerationPersistanceMapper } from './generations-persistance.mapper';

@Injectable()
export class GenerationPrismaRepository extends BaseRepository {
	constructor(
		@Inject(WINSTON_MODULE_NEST_PROVIDER) public logger: Logger,
		private prismaService: PrismaService,
	) {
		super(logger, GenerationPrismaRepository.name);
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
