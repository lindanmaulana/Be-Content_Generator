import { Generation } from '@/modules/generations/domain/generations.entity';
import { findAllGenerationFilter } from './generation.repository.interface';

export interface GenerationRepository {
	findAll(query: findAllGenerationFilter): Promise<Generation[]>;
	create(generation: Generation): Promise<Generation>;
	update(generation: Generation): Promise<Generation>;
}
