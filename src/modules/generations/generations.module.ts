import { REPOSITORY_TOKENS } from '@/common/constants/tokens';
import { PrismaModule } from '@/core/database/prisma/prisma.module';
import { Module } from '@nestjs/common';
import { UsersModule } from '../users/users.module';
import { GenerationsController } from './generations.controller';
import { GenerationsService } from './generations.service';
import { GenerationPrismaRepository } from './infrastructure/generations-prisma.repository';
import { GoogleAiModule } from '../google-ai/google-ai.module';
import { GenerationsCacheService } from './generations-cache.service';

@Module({
	imports: [PrismaModule, UsersModule, GoogleAiModule],
	controllers: [GenerationsController],
	providers: [
		GenerationsService,
		GenerationsCacheService,
		{
			provide: REPOSITORY_TOKENS.GENERATION,
			useClass: GenerationPrismaRepository,
		},
	],
})
export class GenerationsModule {}
