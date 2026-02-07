import { Generation } from '@/modules/generations/domain/generations.entity';
import { Generation as prismaGeneration } from '@prisma/client';

export class GenerationPersistanceMapper {
	static toEntity(generation: prismaGeneration): Generation {
		return Generation.restore({
			id: generation.id,
			user_id: generation.user_id,
			prompt: generation.prompt,
			result: generation.result,
			created_at: generation.created_at,
			updated_at: generation.updated_at,
		});
	}

	static toPersistance(generation: Generation) {
		return {
			id: generation.id,
			user_id: generation.userId,
			prompt: generation.prompt,
			result: generation.result,
			created_at: generation.createdAt,
			updated_at: generation.updatedAt,
		};
	}
}
