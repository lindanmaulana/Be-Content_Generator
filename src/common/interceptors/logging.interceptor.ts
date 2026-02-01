import { CallHandler, ExecutionContext, HttpException, Inject, Injectable, NestInterceptor } from '@nestjs/common';
import { Request, Response } from 'express';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { catchError, Observable, tap } from 'rxjs';
import { Logger } from 'winston';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
	constructor(@Inject(WINSTON_MODULE_NEST_PROVIDER) private readonly logger: Logger) {}

	intercept(context: ExecutionContext, next: CallHandler<any>): Observable<any> | Promise<Observable<any>> {
		const req = context.switchToHttp().getRequest<Request>();
		const res = context.switchToHttp().getResponse<Response>();

		const { method, originalUrl } = req;
		const start = Date.now();

		return next.handle().pipe(
			tap(() => {
				const duration = Date.now() - start;

				this.logger.log('HTTP Request', {
					context: 'HTTPS',
					method,
					url: originalUrl,
					statusCode: res.statusCode,
					duration_ms: duration,
				});
			}),

			catchError((err: unknown) => {
				const duration = Date.now() - start;

				if (err instanceof HttpException) {
					this.logger.error('HTTP Request Error', {
						context: 'HTTP',
						method,
						url: originalUrl,
						statusCode: res.statusCode,
						duration_ms: duration,
						message: err.message,
					});
				} else if (err instanceof Error) {
					this.logger.error('Unhandle Error', {
						context: 'HTTP',
						message: err.message,
						stack: err.stack,
					});
				}

				throw err;
			}),
		);
	}
}
