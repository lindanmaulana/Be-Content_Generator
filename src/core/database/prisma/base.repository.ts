import { Prisma } from '@prisma/client';
import { Logger } from 'winston';

export abstract class BaseRepository {
	constructor(
		protected readonly logger: Logger,
		protected readonly context: string,
	) {}

	protected async tryCatch<T>(operation: () => Promise<T>): Promise<T> {
		try {
			return await operation();
		} catch (err: unknown) {
			const logData: Record<string, unknown> = {
				context: this.context,
				message: 'Unknow error occurred',
			};

			if (err instanceof Error) {
				logData.message = err.message;
				logData.stack = err.stack;
			}

			if (err instanceof Prisma.PrismaClientKnownRequestError) {
				logData.message = err.message;
				logData.code = err.code;
				logData.meta = err.meta;
			}

			if (err instanceof Prisma.PrismaClientInitializationError) logData.message = 'Database Connection Failed';

			this.logger.error(`Database Operation Failed`, logData);
			throw err;
		}
	}
}
