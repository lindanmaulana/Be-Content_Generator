import { LIBRARY_TOKENS, REPOSITORY_TOKENS } from '@/common/constants/tokens';
import { JwtPayload } from '@/common/interfaces/jwt-payload.interface';
import { User } from '@/modules/users/domain/users.entity';
import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ROLE_USERS } from '@prisma/client';
import bcrypt from 'bcrypt';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';
import type { UserRepository } from '../users/domain/users.repository';
import { AuthLoginDto, AuthLoginResponseDto } from './dto/auth-login.dto';
import { AuthRegisterDto, AuthRegisterResponseDto } from './dto/auth-register.dto';
import { AuthResponseMapper } from './infrastructure/auth-response.mapper';

@Injectable()
export class AuthsService {
	protected logContext = this.constructor.name;
	constructor(
		@Inject(WINSTON_MODULE_NEST_PROVIDER) private readonly logger: Logger,
		@Inject(LIBRARY_TOKENS.HASH) private libHash: typeof bcrypt,
		@Inject(REPOSITORY_TOKENS.USER) private readonly userRepository: UserRepository,
		private readonly jwtService: JwtService,
	) {}

	async login(dto: AuthLoginDto): Promise<AuthLoginResponseDto> {
		this.logger.log('User login started', { context: this.logContext, email: dto.email });

		const user = await this.userRepository.findByEmail(dto.email);
		if (user === null) {
			this.logger.warn('User login failed: User tidak ditemukan');
			throw new BadRequestException('Invalid Credentials');
		}

		const isPasswordMatch = await this.libHash.compare(dto.password, user.password);
		if (!isPasswordMatch) {
			this.logger.warn('User login failed: Password salah');
			throw new BadRequestException('Invalid Credentials');
		}

		this.logger.log('User login success', { context: this.logContext, user_id: user.id });

		const payloadToken: JwtPayload = { id: user.id, name: user.name, email: user.email, role: user.role };
		const accessToken: string = this.jwtService.sign(payloadToken);

		return AuthResponseMapper.toLoginResponse(accessToken, user);
	}

	async register(dto: AuthRegisterDto): Promise<AuthRegisterResponseDto> {
		this.logger.log('User register started', { context: this.logContext, email: dto.email });

		const isEmailExists = await this.userRepository.findByEmail(dto.email);
		if (isEmailExists) throw new BadRequestException('Email telah digunakan');

		const hashPassword = this.libHash.hashSync(dto.password, 6);

		const user = User.create({
			name: dto.name,
			email: dto.email,
			role: ROLE_USERS.CUSTOMER,
			password: hashPassword,
		});

		const result = await this.userRepository.create(user);
		this.logger.log('User register success', { context: this.logContext, email: dto.email });

		return AuthResponseMapper.toRegisterResponse(result);
	}
}
