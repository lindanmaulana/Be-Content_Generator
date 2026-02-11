import { CACHE_KEYS } from '@/common/constants/cache.constans';
import { Cache, CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, Injectable } from '@nestjs/common';

@Injectable()
export class UsersCacheService {
	constructor(@Inject(CACHE_MANAGER) private readonly cacheManager: Cache) {}

	async getVersion(userId: string): Promise<number> {
		return (await this.cacheManager.get<number>(CACHE_KEYS.USERS.VERSION_POINTER(userId))) || 1;
	}

	async bumpVersion(userId: string, ttl?: number): Promise<void> {
		const versionKey = CACHE_KEYS.USERS.VERSION_POINTER(userId);
		const currentVersion = (await this.getVersion(userId)) || 1;

		await this.cacheManager.set(versionKey, currentVersion + 1, ttl);
	}

	generateKey(userId: string, version: number, feature: string): string {
		return CACHE_KEYS.USERS.DATA(userId, version, feature);
	}
}
