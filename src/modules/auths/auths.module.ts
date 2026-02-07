import { JwtConfigService } from '@/common/configs/jwt,config';
import { LIBRARY_TOKENS } from '@/common/constants/tokens';
import { PrismaModule } from '@/core/database/prisma/prisma.module';
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import bcrypt from 'bcrypt';
import { UsersModule } from '../users/users.module';
import { AuthsController } from './auths.controller';
import { AuthsService } from './auths.service';
import { JwtStrategy } from './strategies/jwt.strategy';

@Module({
	imports: [PrismaModule, PassportModule, UsersModule, JwtModule.registerAsync({ useClass: JwtConfigService })],
	controllers: [AuthsController],
	providers: [
		AuthsService,
		JwtStrategy,
		{
			provide: LIBRARY_TOKENS.HASH,
			useValue: bcrypt,
		},
	],
})
export class AuthsModule {}
