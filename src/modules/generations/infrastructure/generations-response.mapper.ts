import { Injectable } from '@nestjs/common';
import { Generation } from '../domain/generations.entity';
import { CreateGenerationResponseDto } from '../dto/create-generation.dto';
import { FindAllGenerationResponseDto } from '../dto/find-all-generation.dto';
import { Pagination } from '@/common/utils/pagination.util';

@Injectable()
export class GenerationResponseMapper {
	static base(generation: Generation) {
		return {
			id: generation.id,
			user_id: generation.userId,
			prompt: generation.prompt,
			result: generation.result,
			status: generation.status,
			prompt_tokens: generation.promptTokens,
			completion_tokens: generation.completionTokens,
			throught_tokens: generation.thoughtsTokens,
			total_tokens: generation.totalTokens,
			created_at: generation.createdAt.toISOString(),
			updated_at: generation.updatedAt.toISOString(),
		};
	}

	static toFindAllResponse(pagination: Pagination, generations: Generation[]): FindAllGenerationResponseDto {
		return {
			data: generations.map((generation) => this.base(generation)),
			meta: pagination,
		};
	}

	static toCreateResponse(generation: Generation): CreateGenerationResponseDto {
		return this.base(generation);
	}

	static toUpdateResponse(generation: Generation): CreateGenerationResponseDto {
		return this.base(generation);
	}
}
