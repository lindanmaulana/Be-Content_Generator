import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { JwtPayload } from '../interfaces/jwt-payload.interface';
import { Request } from 'express';

export const GetUser = createParamDecorator((data: keyof JwtPayload | undefined, ctx: ExecutionContext) => {
	const req: Request = ctx.switchToHttp().getRequest();
	const user: JwtPayload = req.user;

	if (!user) return null;

	if (data) return user[data];

	return user;
});
