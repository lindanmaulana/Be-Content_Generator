import { JwtConfigService } from '@/common/configs/jwt,config';
import { WinstonConfig } from '@/common/configs/winston.config';
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { WinstonModule } from 'nest-winston';
import { AuthsController } from './auths.controller';
import { AuthsService } from './auths.service';

@Module({
	imports: [
		PassportModule,
		WinstonModule.forRootAsync({ useClass: WinstonConfig }),
		JwtModule.registerAsync({ useClass: JwtConfigService }),
	],
	controllers: [AuthsController],
	providers: [AuthsService],
})
export class AuthsModule {}
