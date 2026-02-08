import { Generation } from '@/modules/generations/domain/generations.entity';
import { Generation as prismaGeneration } from '@prisma/client';

export class GenerationPersistanceMapper {
	static toEntity(generation: prismaGeneration): Generation {
		return Generation.restore({
			id: generation.id,
			user_id: generation.user_id,
			prompt: generation.prompt,
			result: generation.result,
			status: generation.status,
			prompt_tokens: generation.prompt_tokens,
			completion_tokens: generation.completion_tokens,
			total_tokens: generation.total_tokens,
			thoughts_tokens: generation.thoughts_tokens,
			created_at: generation.created_at,
			updated_at: generation.updated_at,
		});
	}

	static toPersistance(generation: Generation) {
		return {
			user_id: generation.userId,
			prompt: generation.prompt,
			result: generation.result,
			status: generation.status,
			prompt_tokens: generation.promptTokens,
			completion_tokens: generation.completionTokens,
			total_tokens: generation.totalTokens,
			thoughts_tokens: generation.thoughtsTokens,
			created_at: generation.createdAt,
			updated_at: generation.updatedAt,
		};
	}
}
