import { ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { Observable } from 'rxjs';
import { ISPUBLIC_KEY } from '../decorators/is-public.decorator';

interface PassportInfo {
	message?: string;
}

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
	constructor(private reflector: Reflector) {
		super();
	}

	canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
		const isPublic = this.reflector.getAllAndOverride<string>(ISPUBLIC_KEY, [
			context.getHandler(),
			context.getClass(),
		]);

		if (isPublic) return true;

		return super.canActivate(context);
	}

	handleRequest<TUser = any>(err: any, user: TUser, info: PassportInfo): TUser {
		if (err || !user) {
			const details = info?.message || 'No details';

			throw err || new UnauthorizedException(`Authentication failed: ${details}`);
		}

		return user;
	}
}
