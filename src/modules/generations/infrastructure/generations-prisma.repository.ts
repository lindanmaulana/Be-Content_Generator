import { BaseRepository } from '@/core/database/prisma/base.repository';
import { Inject, Injectable } from '@nestjs/common';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';

@Injectable()
export class GenerationPrismaRepository extends BaseRepository {
	constructor(@Inject(WINSTON_MODULE_NEST_PROVIDER) public logger: Logger) {
		super(logger, GenerationPrismaRepository.name);
	}
}
