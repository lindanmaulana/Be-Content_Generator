import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Reflector } from '@nestjs/core';
import { Response } from 'express';
import { Observable, tap } from 'rxjs';
import { SET_COOKIE_KEY } from '../decorators/set-cookie.decorator';

@Injectable()
export class CookieInterceptor implements NestInterceptor {
	constructor(
		private reflector: Reflector,
		private configService: ConfigService,
	) {}

	intercept(context: ExecutionContext, next: CallHandler<any>): Observable<any> | Promise<Observable<any>> {
		const res = context.switchToHttp().getResponse<Response>();

		const cookieName = this.reflector.getAllAndOverride<string | undefined>(SET_COOKIE_KEY, [
			context.getHandler(),
			context.getClass(),
		]);
		const COOKIE_MAX_AGE_ACCESS_TOKEN = this.configService.get<number>('COOKIE_MAX_AGE_ACCESS_TOKEN');

		return next.handle().pipe(
			tap((data: Record<string, unknown>) => {
				if (!cookieName) return;

				const cookieValue = data[cookieName];
				if (!cookieValue || typeof cookieValue !== 'string') return;

				res.cookie(cookieName, cookieValue, {
					httpOnly: false,
					maxAge: COOKIE_MAX_AGE_ACCESS_TOKEN,
				});
			}),
		);
	}
}
