import { SetMetadata } from '@nestjs/common';

export const SET_COOKIE_KEY = 'SET_COOKIE_KEY';
export const SetCookie = (cookieName: string) => SetMetadata(SET_COOKIE_KEY, cookieName);
