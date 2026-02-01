import { SetMetadata } from '@nestjs/common';
import { ROLE_USERS } from '@prisma/client';

export const ROLES_KEY = 'ROLES_KEY';
export const Roles = (...roles: ROLE_USERS[]) => SetMetadata(ROLES_KEY, roles);
