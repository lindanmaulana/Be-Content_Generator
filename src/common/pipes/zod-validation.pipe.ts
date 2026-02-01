import { ArgumentMetadata, BadRequestException, Injectable, PipeTransform } from '@nestjs/common';
import z, { ZodError } from 'zod';
import { ZodTypeDef } from 'zod/v3';

type ZodSchemaType = z.ZodType<unknown, ZodTypeDef>;

interface ZodSchemaClass {
	schema: ZodSchemaType;
}

@Injectable()
export class ZodValidationPipe implements PipeTransform {
	transform(value: unknown, metadata: ArgumentMetadata) {
		if (this.isZodSchema(metadata.metatype)) {
			const schema = metadata.metatype.schema;
			const result = schema.safeParse(value);

			if (!result.success) {
				throw new BadRequestException({
					message: 'Validation Failed',
					errors: this.formatErrors(result.error),
					statusCode: 400,
				});
			}

			return result.data;
		}

		return value;
	}

	private isZodSchema(metatype?: unknown): metatype is ZodSchemaClass {
		if (typeof metatype !== 'function') return false;

		const schema = (metatype as unknown as ZodSchemaClass).schema;
		return schema !== undefined && typeof schema.safeParse === 'function';
	}

	private formatErrors(errors: ZodError): Record<string, string> {
		const result: Record<string, string> = {};

		for (const error of errors.issues) {
			const field = error.path.join('.');

			result[field] = error.message;
		}

		return result;
	}
}
