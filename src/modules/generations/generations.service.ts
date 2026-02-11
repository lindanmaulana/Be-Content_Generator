import { REPOSITORY_TOKENS, TOKENS_USAGE_LIMIT } from '@/common/constants/tokens';
import { GenerationCacheFeature } from '@/common/enums/cache-feature.enum';
import type { JwtPayload } from '@/common/interfaces/jwt-payload.interface';
import { calculatePagination } from '@/common/utils/pagination.util';
import { MS } from '@/common/utils/time.utils';
import { Generation } from '@/modules/generations/domain/generations.entity';
import { Cache, CACHE_MANAGER } from '@nestjs/cache-manager';
import { ConflictException, ForbiddenException, Inject, Injectable } from '@nestjs/common';
import { GenerationStatus } from '@prisma/client';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';
import { GoogleAiService } from '../google-ai/google-ai.service';
import { GeminiUsageMetadata } from '../google-ai/interfaces/google-ai-response.interface';
import { UsersSharedService } from '../users/users-shared.service';
import type { GenerationRepository } from './domain/generations.repository';
import { CreateGenerationDto, CreateGenerationResponseDto } from './dto/create-generation.dto';
import { FindAllGenerationDto, FindAllGenerationResponseDto } from './dto/find-all-generation.dto';
import { GenerationsCacheService } from './generations-cache.service';
import { GenerationResponseMapper } from './infrastructure/generations-response.mapper';

@Injectable()
export class GenerationsService {
	protected logContext = this.constructor.name;

	constructor(
		@Inject(WINSTON_MODULE_NEST_PROVIDER) private readonly logger: Logger,
		@Inject(REPOSITORY_TOKENS.GENERATION) private readonly generationRepository: GenerationRepository,
		@Inject(CACHE_MANAGER) private cacheManager: Cache,
		private readonly googleAiService: GoogleAiService,
		private readonly usersSharedService: UsersSharedService,
		private readonly generationsCacheService: GenerationsCacheService,
	) {}

	async findAll(userId: string, query: FindAllGenerationDto): Promise<FindAllGenerationResponseDto> {
		this.logger.log('GET all generation started', { context: this.logContext, userId: userId });

		const version = await this.generationsCacheService.getVersion(userId);
		const cacheKey = this.generationsCacheService.generateKey(GenerationCacheFeature.LIST, userId, version);
		const cacheData = await this.cacheManager.get(cacheKey);

		if (cacheData) {
			this.logger.log('GET all generation retrieved on cache', { context: this.logContext, userId: userId });
			return cacheData as FindAllGenerationResponseDto;
		}

		await this.usersSharedService.validateUserExists(userId);

		const countResult = await this.generationRepository.findCount({ user_id: userId }, query);
		const pagination = calculatePagination(countResult, query);
		const result = await this.generationRepository.findAll({ user_id: userId }, query);

		const finalResponse = GenerationResponseMapper.toFindAllResponse(pagination, result);
		await this.cacheManager.set(cacheKey, finalResponse, MS.MINUTE * 5);

		return finalResponse;
	}

	async create(user: JwtPayload, dto: CreateGenerationDto): Promise<CreateGenerationResponseDto> {
		this.logger.log('CREATE generation started', { context: this.logContext, email: user.email });

		const checkUser = await this.usersSharedService.validateUserExists(user.id);

		const checkTokenUsage = await this.generationRepository.sumDailyTokenUsage(checkUser.id);
		if (checkTokenUsage >= TOKENS_USAGE_LIMIT) {
			this.logger.warn('Request generate kontent gagal, jatah kuota harian habis', {
				context: this.logContext,
				user_id: checkUser.id,
			});
			throw new ForbiddenException('Jatah token harian kamu sudah habis! Coba lagi besok!');
		}

		const record = Generation.create({
			user_id: checkUser.id,
			prompt: dto.prompt,
			prompt_tokens: 0,
			completion_tokens: 0,
			total_tokens: 0,
			thoughts_tokens: 0,
		});

		let result = await this.generationRepository.create(record);
		const lockGen = this.generationsCacheService.generateKey(GenerationCacheFeature.LOCK, user.id);

		try {
			const isLockedGen = await this.cacheManager.get(lockGen);
			if (isLockedGen) throw new ConflictException('Sabar ya, proses sebelumnya masih jalan!');
			await this.cacheManager.set(lockGen, true, 30000);

			const aiResult = await this.googleAiService.generateContent(dto.prompt);
			const usageTokens: GeminiUsageMetadata = {
				promptTokenCount: aiResult.usageMetadata.promptTokenCount,
				candidatesTokenCount: aiResult.usageMetadata.candidatesTokenCount,
				thoughtsTokenCount: aiResult.usageMetadata.thoughtsTokenCount,
				totalTokenCount: aiResult.usageMetadata.totalTokenCount,
			};

			this.logger.log('Update generation started: ', { context: this.logContext });
			result.update({
				result: aiResult.text,
				promptTokens: usageTokens.promptTokenCount,
				completionTokens: usageTokens.candidatesTokenCount,
				thoughtsTokens: usageTokens.thoughtsTokenCount ?? 0,
				totalTokens: usageTokens.totalTokenCount,
				status: GenerationStatus.SUCCESS,
			});

			result = await this.generationRepository.update(result);
		} catch (err: unknown) {
			const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred!';
			this.logger.warn('Generate content error: ', { context: this.logContext, message: errorMessage });

			result.changeStatus(GenerationStatus.FAILED);
			await this.generationRepository.update(result);

			throw err;
		} finally {
			await this.cacheManager.del(lockGen);
		}

		return GenerationResponseMapper.toCreateResponse(result);
	}
}
