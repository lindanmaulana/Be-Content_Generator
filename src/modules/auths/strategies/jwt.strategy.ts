import { JwtPayload } from '@/common/interfaces/jwt-payload.interface';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
	constructor(private configService: ConfigService) {
		const jwtSecretKey = configService.get<string>('JWT_SECRET');

		if (!jwtSecretKey) {
			console.error('[JwtStrategy] JWT_SECRET_KEY is missing');
			throw new Error('System error: please try again later');
		}

		super({
			jwtFromRequest: ExtractJwt.fromExtractors([
				(req: Request) => {
					return (req?.cookies?.access_token as string) || null;
				},
			]),
			ignoreExpiration: false,
			secretOrKey: jwtSecretKey,
		});
	}

	validate(payload: JwtPayload): JwtPayload {
		return { id: payload.id, name: payload.name, email: payload.email, role: payload.role };
	}
}
