import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Response } from 'express';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { RESPONSE_MESSAGE_KEY } from '../decorators/response-message.decorator';

interface StandardPayload {
	data?: unknown;
	meta?: unknown;
	access_token?: string;
}

interface FinalResponse {
	statusCode: number;
	success: boolean;
	message: string;
	data: unknown;
	meta?: unknown;
	access_token?: string;
}

@Injectable()
export class ResponseInterceptor implements NestInterceptor {
	constructor(private reflector: Reflector) {}

	intercept(ctx: ExecutionContext, next: CallHandler<any>): Observable<any> | Promise<Observable<any>> {
		const httpContext = ctx.switchToHttp();
		const res: Response = httpContext.getResponse();

		const resMessage = this.reflector.get<string>(RESPONSE_MESSAGE_KEY, ctx.getHandler()) || 'Operation Successful';

		const isObject = (val: unknown): val is Record<string, any> => {
			return val !== null && typeof val === 'object';
		};

		return next.handle().pipe(
			map((payload: unknown): FinalResponse => {
				const response = {
					statusCode: res.statusCode,
					success: true,
					message: resMessage,
				};

				if (isObject(payload)) {
					const base = payload as StandardPayload;

					if (base.meta) {
						return { ...response, data: base.data, meta: base.meta };
					}

					if (base.access_token) return { ...response, data: base.data };

					if (base.data !== undefined) return { ...response, data: base.data };
				}

				return { ...response, data: payload };
			}),
		);
	}
}
