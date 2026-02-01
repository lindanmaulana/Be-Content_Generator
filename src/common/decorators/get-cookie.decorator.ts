import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';

export const GetCookie = createParamDecorator((data: string | undefined, ctx: ExecutionContext) => {
	const req: Request = ctx.switchToHttp().getRequest();
	const cookies: Record<string, string> = req.cookies || {};

	if (!data) return cookies;

	return cookies[data];
});
