import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Response } from 'express';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { RESPONSE_MESSAGE_KEY } from '../decorators/response-message.decorator';

interface PaginatedPayload<T> {
	data: T[];
	meta: Record<string, any>;
}

@Injectable()
export class ResponseInterceptor implements NestInterceptor {
	constructor(private reflector: Reflector) {}

	intercept(ctx: ExecutionContext, next: CallHandler<any>): Observable<any> | Promise<Observable<any>> {
		const httpContext = ctx.switchToHttp();
		const res: Response = httpContext.getResponse();

		const resMessage = this.reflector.get<string>(RESPONSE_MESSAGE_KEY, ctx.getHandler()) || 'Operation Successful';

		return next.handle().pipe(
			map((payload: unknown) => {
				const hasPagination = payload && typeof payload === 'object' && 'data' in payload && 'meta' in payload;

				if (hasPagination) {
					const paginated = payload as PaginatedPayload<unknown>;

					return {
						statusCode: res.statusCode,
						success: true,
						message: resMessage,
						data: paginated.data,
						meta: paginated.meta,
					};
				}

				return {
					statusCode: res.statusCode,
					success: true,
					message: resMessage,
					data: payload,
				};
			}),
		);
	}
}
