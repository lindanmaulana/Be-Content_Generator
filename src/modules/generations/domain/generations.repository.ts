import { Generation } from '@/modules/generations/domain/generations.entity';
import { GenerationFilters, GenerationPaginationParams } from './generation.repository.interface';

export interface GenerationRepository {
	findAll(filters: GenerationFilters, pagination: GenerationPaginationParams): Promise<Generation[]>;
	findCount(filters: GenerationFilters, pagination: GenerationPaginationParams): Promise<number>;
	create(generation: Generation): Promise<Generation>;
	update(generation: Generation): Promise<Generation>;

	findDailyTokenUsage(userId: string): Promise<number>;
}
