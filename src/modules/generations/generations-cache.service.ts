import { CACHE_KEYS } from '@/common/constants/cache.constans';
import { Cache, CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, Injectable } from '@nestjs/common';

@Injectable()
export class GenerationsCacheService {
	constructor(@Inject(CACHE_MANAGER) private readonly cacheManager: Cache) {}

	async getVersion(userId: string): Promise<number> {
		return (await this.cacheManager.get<number>(CACHE_KEYS.GENERATIONS.VERSION_POINTER(userId))) || 1;
	}

	async bumpVersion(userId: string, ttl?: number) {
		const versionKey = CACHE_KEYS.GENERATIONS.VERSION_POINTER(userId);
		const currentVersion = await this.getVersion(userId);

		await this.cacheManager.set(versionKey, currentVersion + 1, ttl);
	}

	generateKey(feature: string, userId: string, version?: number): string {
		return CACHE_KEYS.GENERATIONS.DATA(feature, userId, version);
	}
}
