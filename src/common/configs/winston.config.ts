import { Injectable } from '@nestjs/common';
import { WinstonModuleOptions, WinstonModuleOptionsFactory } from 'nest-winston';
import * as winston from 'winston';
import 'winston-daily-rotate-file';

@Injectable()
export class WinstonConfig implements WinstonModuleOptionsFactory {
	constructor() {}

	protected isProd = process.env.NODE_ENV === 'production';

	createWinstonModuleOptions(): Promise<WinstonModuleOptions> | WinstonModuleOptions {
		const options: WinstonModuleOptions = {
			level: 'info',
			format: winston.format.combine(winston.format.timestamp(), winston.format.json()),
			transports: this.isProd
				? [
						new winston.transports.Console(),

						new winston.transports.DailyRotateFile({
							dirname: 'logs',
							filename: 'app-%DATE%.log',
							datePattern: 'YYYY-MM-DD',
							zippedArchive: true,
							maxSize: '20m',
							maxFiles: '14d',
						}),

						new winston.transports.DailyRotateFile({
							level: 'error',
							dirname: 'logs',
							filename: 'error-%DATE%.log',
							datePattern: 'YYYY-MM-DD',
							zippedArchive: true,
							maxSize: '20m',
							maxFiles: '30d',
						}),
					]
				: [
						new winston.transports.Console({
							format: winston.format.combine(winston.format.colorize(), winston.format.simple()),
						}),
					],
		};

		return options;
	}
}
