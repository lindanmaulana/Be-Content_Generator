import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { ROLES_KEY } from '../decorators/set-roles.decorator';
import { Request } from 'express';

@Injectable()
export class RolesGuard implements CanActivate {
	constructor(private reflector: Reflector) {}

	canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
		const requiredRoles = this.reflector.get<string[]>(ROLES_KEY, context.getHandler());

		const req: Request = context.switchToHttp().getRequest();
		const user = req.user;

		if (!user || !user.role) throw new ForbiddenException('User data not found or session is invalid!');

		const havePermission = requiredRoles.includes(user.role);
		if (!havePermission) throw new ForbiddenException('You do not have permission to access this resource');

		return true;
	}
}
