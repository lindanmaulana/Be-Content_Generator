import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtModuleOptions, JwtOptionsFactory } from '@nestjs/jwt';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';
import { StringValue } from 'ms';

@Injectable()
export class JwtConfigService implements JwtOptionsFactory {
	constructor(
		private configService: ConfigService,
		@Inject(WINSTON_MODULE_NEST_PROVIDER) private readonly logger: Logger,
	) {}

	createJwtOptions(): JwtModuleOptions {
		const jwtSecretKey = this.configService.get<string>('JWT_SECRET');
		const jwtExpiresIn = this.configService.get<string>('JWT_EXPIRES_IN');

		if (!jwtSecretKey || !jwtExpiresIn) throw new Error('Jwt Configuration is missing');

		return {
			secret: jwtSecretKey,
			signOptions: {
				expiresIn: jwtExpiresIn as StringValue,
			},
		};
	}
}
