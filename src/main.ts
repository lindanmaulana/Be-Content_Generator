import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './modules/apps/app.module';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import { GlobalExceptionFilter } from './common/filters/http-exception.filter';
import { ZodValidationPipe } from './common/pipes/zod-validation.pipe';
import { ResponseInterceptor } from './common/interceptors/response.interceptor';

async function bootstrap() {
	const app = await NestFactory.create(AppModule);

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

	app.use(cookieParser());
	app.useGlobalFilters(new GlobalExceptionFilter());
	app.useGlobalPipes(new ZodValidationPipe());
	app.useGlobalInterceptors(new ResponseInterceptor(app.get(Reflector)));

	await app.listen(process.env.PORT ?? 3000);
}

void bootstrap();
