import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import bcrypt from 'bcrypt';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';
import { AuthLoginDto, AuthLoginResponseDto } from './dto/auth-login.dto';
import type { AuthRepository } from './domain/auth.repository';
import { AuthResponseMapper } from './infrastructure/auth-response.mapper';
import { JwtPayload } from '@/common/interfaces/jwt-payload.interface';
import { AuthRegisterDto, AuthRegisterResponseDto } from './dto/auth-register.dto';
import { Auth } from './domain/auth.entity';
import { ROLE_USERS } from '@prisma/client';

@Injectable()
export class AuthsService {
	protected logContext = this.constructor.name;
	constructor(
		@Inject(WINSTON_MODULE_NEST_PROVIDER) private readonly logger: Logger,
		@Inject('LIB_HASH') private libHash: typeof bcrypt,
		@Inject('AUTH_REPOSITORY') private readonly authRepository: AuthRepository,
		private readonly jwtService: JwtService,
	) {}

	async login(dto: AuthLoginDto): Promise<AuthLoginResponseDto> {
		this.logger.log('User login started', { context: this.logContext, email: dto.email });

		const user = await this.authRepository.findByEmail(dto.email);
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

		const isEmailExists = await this.authRepository.findByEmail(dto.email);
		if (isEmailExists) throw new BadRequestException('Email telah digunakan');

		const hashPassword = this.libHash.hashSync(dto.password, 6);

		const user = Auth.create({
			name: dto.name,
			email: dto.email,
			role: ROLE_USERS.CUSTOMER,
			password: hashPassword,
		});

		console.log({ 1: user });

		const result = await this.authRepository.create(user);
		this.logger.log('User register success', { context: this.logContext, email: dto.email });

		return AuthResponseMapper.toRegisterResponse(result);
	}
}
