import { createZodDto } from 'nestjs-zod';
import { BaseGenerationSchema } from './generation.dto';

export const CreateGenerationSchema = BaseGenerationSchema.pick({
	prompt: true,
});

export class CreateGenerationDto extends createZodDto(CreateGenerationSchema) {
	static schema = CreateGenerationSchema;
}

export const CreateGenerationResponseSchema = BaseGenerationSchema;
export class CreateGenerationResponseDto extends createZodDto(CreateGenerationResponseSchema) {}
