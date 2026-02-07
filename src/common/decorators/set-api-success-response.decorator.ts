import { applyDecorators, Type } from '@nestjs/common';
import { ApiExtraModels, ApiResponse, getSchemaPath } from '@nestjs/swagger';

export const SetApiSuccessResponse = <TModel extends Type<any>>(model: TModel, status: number = 200) => {
	console.log({ model, status });
	return applyDecorators(
		ApiExtraModels(model),
		ApiResponse({
			status: status,
			schema: {
				properties: {
					statusCode: { type: 'number', example: status },
					success: { type: 'boolean', example: true },
					message: { type: 'string', example: 'Success' },
					data: { $ref: getSchemaPath(model) },
				},
			},
		}),
	);
};
