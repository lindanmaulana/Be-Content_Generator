import { Body, Controller, HttpCode, HttpStatus, Post, UseInterceptors } from '@nestjs/common';
import { AuthsService } from './auths.service';
import { ResponseMessage } from '@/common/decorators/response-message.decorator';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { SetApiSuccessResponse } from '@/common/decorators/set-api-success-response.decorator';
import { AuthLoginDto, AuthLoginResponseDto } from './dto/auth-login.dto';
import { AuthRegisterDto, AuthRegisterResponseDto } from './dto/auth-register.dto';
import { CookieInterceptor } from '@/common/interceptors/cookie.interceptor';
import { SetCookie } from '@/common/decorators/set-cookie.decorator';
import { Cookies } from '@/common/enums/cookies_enum';

@Controller('auth')
@ApiTags('Authentication')
export class AuthsController {
	constructor(private readonly authService: AuthsService) {}

	@Post('login')
	@HttpCode(HttpStatus.OK)
	@UseInterceptors(CookieInterceptor)
	@SetCookie(Cookies.ACCESS_TOKEN)
	@ResponseMessage('Login berhasil')
	@ApiOperation({ summary: 'Auth login' })
	@SetApiSuccessResponse(AuthLoginResponseDto, HttpStatus.OK)
	async login(@Body() dto: AuthLoginDto): Promise<AuthLoginResponseDto> {
		return await this.authService.login(dto);
	}

	@Post('register')
	@ResponseMessage('Register berhasil')
	@ApiOperation({ summary: 'Auth Register' })
	@SetApiSuccessResponse(AuthRegisterResponseDto, HttpStatus.CREATED)
	async register(@Body() dto: AuthRegisterDto): Promise<AuthRegisterResponseDto> {
		return this.authService.register(dto);
	}
}
