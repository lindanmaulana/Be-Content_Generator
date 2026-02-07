import { REPOSITORY_TOKENS } from '@/common/constants/tokens';
import type { JwtPayload } from '@/common/interfaces/jwt-payload.interface';
import { Generation } from '@/modules/generations/domain/generations.entity';
import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';
import type { UserRepository } from '../users/domain/user.repository';
import type { GenerationRepository } from './domain/generations.repository';
import { CreateGenerationDto, CreateGenerationResponseDto } from './dto/create-generation.dto';
import { GenerationResponseMapper } from './infrastructure/generations-response.mapper';

@Injectable()
export class GenerationsService {
	protected logContext = this.constructor.name;

	constructor(
		@Inject(WINSTON_MODULE_NEST_PROVIDER) private readonly logger: Logger,
		@Inject(REPOSITORY_TOKENS.GENERATION) private readonly generationRepository: GenerationRepository,
		@Inject(REPOSITORY_TOKENS.USER) private readonly userRepository: UserRepository,
	) {}

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
		});

		const result = await this.generationRepository.create(record);

		return GenerationResponseMapper.toCreateResponse(result);
	}
}
