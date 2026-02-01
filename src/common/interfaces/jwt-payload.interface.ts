import { ROLE_USERS } from '@prisma/client';

export interface JwtPayload {
	id: string;
	email: string;
	role: ROLE_USERS;
}
