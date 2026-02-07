import { Injectable } from '@nestjs/common';
import { Generation } from '../domain/generations.entity';
import { CreateGenerationResponseDto } from '../dto/create-generation.dto';

@Injectable()
export class GenerationResponseMapper {
	static base(generation: Generation) {
		return {
			id: generation.id,
			user_id: generation.userId,
			prompt: generation.prompt,
			result: generation.result,
			created_at: generation.createdAt,
			updated_at: generation.updatedAt,
		};
	}

	static toCreateResponse(generation: Generation): CreateGenerationResponseDto {
		return {
			id: generation.id,
			user_id: generation.userId,
			prompt: generation.prompt,
			result: generation.result,
			created_at: generation.createdAt.toISOString(),
			updated_at: generation.updatedAt.toISOString(),
		};
	}
}
