import { SetMetadata } from '@nestjs/common';

export const ISPUBLIC_KEY = 'ISPUBLIC_KEY';
export const IsPublic = () => SetMetadata(ISPUBLIC_KEY, true);
