import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { FindAllUserDto, FindAllUserResponseDto } from './dto/find-all-user.dto';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';
import { REPOSITORY_TOKENS } from '@/common/constants/tokens';
import type { UserRepository } from './domain/users.repository';
import { Cache, CACHE_MANAGER } from '@nestjs/cache-manager';
import { calculatePagination } from '@/common/utils/pagination.util';
import { UserResponseMapper } from './infrastructure/user-response.mapper';

@Injectable()
export class UsersService {
	protected logContext = this.constructor.name;
	protected nameContext = 'users';

	constructor(
		@Inject(WINSTON_MODULE_NEST_PROVIDER) private readonly logger: Logger,
		@Inject(REPOSITORY_TOKENS.USER) private readonly userRepository: UserRepository,
		@Inject(CACHE_MANAGER) private cacheManager: Cache,
	) {}

	async findAll(user_id: string, query: FindAllUserDto): Promise<FindAllUserResponseDto> {
		const versionKey = `user_version:${user_id}`;
		const version = (await this.cacheManager.get<number>(versionKey)) || 1;

		const cacheKey = `history:${user_id}:v${version}:ctx${this.nameContext}:p${query.page}`;
		const cacheData = await this.cacheManager.get(cacheKey);

		if (cacheData) return cacheData as FindAllUserResponseDto;

		const checkUser = await this.userRepository.findById(user_id);
		if (!checkUser) {
			this.logger.warn('Data pegguna tidak ditemukan', { context: this.logContext, user_id: user_id });
			throw new NotFoundException('Pengguna tidak ditemukan!');
		}

		const countResult = await this.userRepository.findCount(query);
		const pagination = calculatePagination(countResult, query);
		const result = await this.userRepository.findAll(query);

		const finalResponse = UserResponseMapper.toFindAll(pagination, result);
		await this.cacheManager.set(cacheKey, finalResponse);

		return finalResponse;
	}
}
