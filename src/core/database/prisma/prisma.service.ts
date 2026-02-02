import { Inject, Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '@prisma/client';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';
import { Pool } from 'pg';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
	protected logContext = this.constructor.name;
	constructor(@Inject(WINSTON_MODULE_NEST_PROVIDER) private readonly logger: Logger) {
		const dbUrl = process.env.DATABASE_URL;

		if (!dbUrl) {
			throw new Error('DATABASE_URL is missing in environment variables');
		}

		const pool = new Pool({ connectionString: dbUrl });
		const adapter = new PrismaPg(pool);

		super({
			adapter,
			log: [
				{
					emit: 'event',
					level: 'query',
				},
				{
					emit: 'event',
					level: 'error',
				},
				{
					emit: 'event',
					level: 'info',
				},
				{
					emit: 'event',
					level: 'warn',
				},
			],
		});
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

			process.exit(1);
		}
	}

	async onModuleDestroy() {
		await this.$disconnect();
		this.logger.log('DB Disconnected successfully', {
			context: this.logContext,
		});
	}
}
