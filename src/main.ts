import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './modules/apps/app.module';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import { GlobalExceptionFilter } from './common/filters/http-exception.filter';
import { ZodValidationPipe } from './common/pipes/zod-validation.pipe';
import { ResponseInterceptor } from './common/interceptors/response.interceptor';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { NestExpressApplication } from '@nestjs/platform-express';

async function bootstrap() {
	const app = await NestFactory.create<NestExpressApplication>(AppModule);

	app.enableCors({
		origin: (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) => {
			const allowOrigins = ['https://domain-kamu.com', 'http://localhost:3000'];

			if (!origin || allowOrigins.includes(origin)) {
				callback(null, true);
			} else {
				callback(new Error('System access denied, enable cors'));
			}
		},
		methods: 'GET, HEAD, PUT, PATCH, POST, DELETE',
		credentials: true,
	});

	app.use(
		helmet({
			contentSecurityPolicy: {
				directives: {
					...helmet.contentSecurityPolicy.getDefaultDirectives(),
					'script-src': ["'self'", "'unsafe-inline'"],
				},
			},

			frameguard: {
				action: 'deny',
			},
		}),
	);

	app.set('trust proxy', 'loopback');
	app.use(cookieParser());
	app.useGlobalFilters(new GlobalExceptionFilter());
	app.useGlobalPipes(new ZodValidationPipe());
	app.useGlobalInterceptors(new ResponseInterceptor(app.get(Reflector)));

	const config = new DocumentBuilder()
		.setTitle('Ai Content Generator')
		.setDescription('Dokumentasi API Service Ai Content Generator Nestjs')
		.setVersion('1.0')
		.build();
	const document = SwaggerModule.createDocument(app, config);
	SwaggerModule.setup('Api', app, document);

	await app.listen(process.env.PORT ?? 3000);
}

void bootstrap();
