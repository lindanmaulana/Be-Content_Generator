import { REPOSITORY_TOKENS } from '@/common/constants/tokens';
import type { JwtPayload } from '@/common/interfaces/jwt-payload.interface';
import { calculatePagination } from '@/common/utils/pagination.util';
import { Generation } from '@/modules/generations/domain/generations.entity';
import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { GenerationStatus } from '@prisma/client';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';
import { GoogleAiService } from '../google-ai/google-ai.service';
import { GeminiUsageMetadata } from '../google-ai/interfaces/google-ai-response.interface';
import type { UserRepository } from '../users/domain/user.repository';
import type { GenerationRepository } from './domain/generations.repository';
import { CreateGenerationDto, CreateGenerationResponseDto } from './dto/create-generation.dto';
import { FindAllGenerationDto, FindAllGenerationResponseDto } from './dto/find-all-generation.dto';
import { GenerationResponseMapper } from './infrastructure/generations-response.mapper';

@Injectable()
export class GenerationsService {
	protected logContext = this.constructor.name;

	constructor(
		@Inject(WINSTON_MODULE_NEST_PROVIDER) private readonly logger: Logger,
		@Inject(REPOSITORY_TOKENS.GENERATION) private readonly generationRepository: GenerationRepository,
		@Inject(REPOSITORY_TOKENS.USER) private readonly userRepository: UserRepository,
		private readonly googleAiService: GoogleAiService,
	) {}

	async findAll(userId: string, query: FindAllGenerationDto): Promise<FindAllGenerationResponseDto> {
		const checkUser = await this.userRepository.findById(userId);
		if (!checkUser) {
			this.logger.warn('Pegguna tidak di temukan', { context: this.logContext, user_id: userId });
			throw new NotFoundException('Pengguna belum terdaftar, please check your account!');
		}

		const countResult = await this.generationRepository.findCount({ user_id: userId }, query);
		const pagination = calculatePagination(countResult, query);

		const result = await this.generationRepository.findAll({ user_id: userId }, query);

		return GenerationResponseMapper.toFindAllResponse(pagination, result);
	}

	async create(user: JwtPayload, dto: CreateGenerationDto): Promise<CreateGenerationResponseDto> {
		this.logger.log('Generation create started', { context: this.logContext, email: user.email });

		const checkUser = await this.userRepository.findById(user.id);
		if (!checkUser) {
			this.logger.warn('Generation Create failed: User tidak ditemukan', {
				context: this.logContext,
				email: user.email,
			});
			throw new NotFoundException('Akun anda belum terdaftar!');
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

		try {
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
		}

		return GenerationResponseMapper.toCreateResponse(result);
	}
}
