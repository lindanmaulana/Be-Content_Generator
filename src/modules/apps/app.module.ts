import { WinstonConfig } from '@/common/configs/winston.config';
import { LoggingInterceptor } from '@/common/interceptors/logging.interceptor';
import { PrismaModule } from '@/core/database/prisma/prisma.module';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { WinstonModule } from 'nest-winston';
import 'winston-daily-rotate-file';
import { AiRequestsModule } from '../ai-requests/ai-requests.module';
import { UsersModule } from '../users/users.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
	imports: [
		ConfigModule.forRoot({ isGlobal: true }),
		ThrottlerModule.forRoot({
			throttlers: [
				{
					name: 'short',
					ttl: 1000,
					limit: 10,
				},
				{
					name: 'medium',
					ttl: 60000,
					limit: 20,
				},
				{
					name: 'long',
					ttl: 3600000,
					limit: 1000,
				},
			],
			errorMessage: 'Batas permintaan terlampaui. Silahkan coba lagi nanti.',
		}),
		WinstonModule.forRootAsync({ useClass: WinstonConfig }),
		PrismaModule,
		UsersModule,
		AiRequestsModule,
	],
	controllers: [AppController],
	providers: [
		{
			provide: APP_INTERCEPTOR,
			useClass: LoggingInterceptor,
		},
		{
			provide: APP_GUARD,
			useClass: ThrottlerGuard,
		},
		AppService,
	],
})
export class AppModule {}
