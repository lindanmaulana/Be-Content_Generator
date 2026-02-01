import { Inject, Injectable, InternalServerErrorException, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
	protected logContext = this.constructor.name;
	constructor(@Inject(WINSTON_MODULE_NEST_PROVIDER) private readonly logger: Logger) {
		const pool = new Pool({ connectionString: process.env.DATABASE_URL });
		const adapter = new PrismaPg(pool);

		super({ adapter });
	}

	async onModuleInit() {
		try {
			await this.$connect();
			this.logger.log('DN Connected Successfully', {
				context: this.logContext,
			});
		} catch (err: unknown) {
			this.logger.error('Data connected failed', {
				context: this.logContext,
				error: err instanceof Error ? err.message : 'Unknown error',
			});
			throw new InternalServerErrorException('Terjadi kesalahan pada sistem, please try again later');
		}
	}

	async onModuleDestroy() {
		await this.$disconnect();
		this.logger.log('DB Disconnected successfully', {
			context: this.logContext,
		});
	}
}
