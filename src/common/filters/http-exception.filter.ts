import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus } from '@nestjs/common';
import { Response } from 'express';

interface ExceptionResponse {
	message: string;
	errors?: Record<string, string>;
	statusCode: number;
}

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
	catch(exception: any, host: ArgumentsHost) {
		const ctx = host.switchToHttp();
		const response = ctx.getResponse<Response>();

		let status = HttpStatus.INTERNAL_SERVER_ERROR;
		let message = 'Internal Server Error';
		let errors: Record<string, string> | undefined = undefined;

		if (exception instanceof HttpException) {
			status = exception.getStatus();
			const resContent = exception.getResponse() as string | ExceptionResponse;

			if (typeof resContent === 'object' && resContent !== null) {
				message = resContent.message;
				errors = resContent.errors;
			} else {
				message = resContent;
			}
		}

		if (exception instanceof Error) message = exception.message;

		response.status(status).json({
			statusCode: status,
			success: false,
			message: message,
			...(errors ? { errors: errors } : { errors: null }),
		});
	}
}
