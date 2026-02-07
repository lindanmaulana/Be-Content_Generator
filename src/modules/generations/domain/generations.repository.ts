import { Generation } from '@/modules/generations/domain/generations.entity';

export interface GenerationRepository {
	create(generation: Generation): Promise<Generation>;
}
