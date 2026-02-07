import { PrismaModule } from '@/core/database/prisma/prisma.module';
import { Module } from '@nestjs/common';
import { UserPrismaRepository } from './infrastructure/user-prisma.repository';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { REPOSITORY_TOKENS } from '@/common/constants/tokens';

@Module({
	imports: [PrismaModule],
	providers: [
		UsersService,
		{
			provide: REPOSITORY_TOKENS.USER,
			useClass: UserPrismaRepository,
		},
	],
	controllers: [UsersController],
	exports: [REPOSITORY_TOKENS.USER],
})
export class UsersModule {}
