import { REPOSITORY_TOKENS } from '@/common/constants/tokens';
import { calculatePagination } from '@/common/utils/pagination.util';
import { MS } from '@/common/utils/time.utils';
import { Cache, CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';
import type { UserRepository } from './domain/users.repository';
import { GetAllUserDto, GetAllUserResponseDto } from './dto/get-all-user.dto';
import { GetProfileUserResponseDto } from './dto/get-profile-user.dto';
import { UpdateProfileUserDto, UpdateProfileUserResponseDto } from './dto/update-profile-user.dto';
import { UserResponseMapper } from './infrastructure/user-response.mapper';
import { UsersCacheService } from './users-cache.service';
import { UsersSharedService } from './users-shared.service';

@Injectable()
export class UsersService {
	protected logContext = this.constructor.name;
	protected nameContext = 'users';

	constructor(
		@Inject(WINSTON_MODULE_NEST_PROVIDER) private readonly logger: Logger,
		@Inject(REPOSITORY_TOKENS.USER) private readonly userRepository: UserRepository,
		@Inject(CACHE_MANAGER) private cacheManager: Cache,
		private readonly usersSharedService: UsersSharedService,
		private readonly userCacheService: UsersCacheService,
	) {}

	async findAll(userId: string, query: GetAllUserDto): Promise<GetAllUserResponseDto> {
		this.logger.log('GET users all started:', { context: this.logContext, userId: userId });
		const version = await this.userCacheService.getVersion(userId);

		const cacheKey = this.userCacheService.generateKey(userId, version, 'findAll');
		const cacheData = await this.cacheManager.get(cacheKey);
		if (cacheData) return cacheData as GetAllUserResponseDto;

		await this.usersSharedService.validateUserExists(userId);

		const countResult = await this.userRepository.findCount(query);
		const pagination = calculatePagination(countResult, query);
		const result = await this.userRepository.findAll(query);

		const finalResponse = UserResponseMapper.toGetAll(pagination, result);
		await this.cacheManager.set(cacheKey, finalResponse);

		return finalResponse;
	}

	async findProfile(userId: string): Promise<GetProfileUserResponseDto> {
		this.logger.log('GET users profile started', { context: this.logContext, userId: userId });

		const version = await this.userCacheService.getVersion(userId);
		const cacheKey = this.userCacheService.generateKey(userId, version, 'profile');
		const cacheData = await this.cacheManager.get(cacheKey);

		if (cacheData) {
			this.logger.log('GET users profile retrieve on cache', { context: this.logContext, userId: userId });
			return cacheData as GetProfileUserResponseDto;
		}

		const result = await this.userRepository.findById(userId);
		if (!result) {
			this.logger.warn('Data profile pengguna tidak ditemukan', { context: this.logContext, userId: userId });
			throw new NotFoundException('Profile pengguna tidak ditemukan!');
		}

		const finalResponse = UserResponseMapper.toGetProfile(result);
		await this.cacheManager.set(cacheKey, finalResponse, MS.MINUTE * 5);

		return finalResponse;
	}

	async updateProfile(userId: string, dto: UpdateProfileUserDto): Promise<UpdateProfileUserResponseDto> {
		this.logger.log('UPDATE users profile started: ', { context: this.logContext, userId: userId });

		const userEntity = await this.usersSharedService.validateUserExists(userId);

		userEntity.update({
			name: dto.name,
		});

		const result = await this.userRepository.update(userId, userEntity);
		await this.userCacheService.bumpVersion(userId);

		return UserResponseMapper.toUpdateProfile(result);
	}
}
