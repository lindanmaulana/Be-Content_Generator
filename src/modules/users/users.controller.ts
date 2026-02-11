import { GetUser } from '@/common/decorators/get-user.decorator';
import { ResponseMessage } from '@/common/decorators/response-message.decorator';
import { SetApiSuccessResponse } from '@/common/decorators/set-api-success-response.decorator';
import { SetRoles } from '@/common/decorators/set-roles.decorator';
import { JwtAuthGuard } from '@/common/guards/jwt-auth.guard';
import type { JwtPayload } from '@/common/interfaces/jwt-payload.interface';
import { Body, Controller, Get, HttpStatus, Patch, Query, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { ROLE_USERS } from '@prisma/client';
import { UsersService } from './users.service';
import { RolesGuard } from '@/common/guards/roles.guard';
import { GetAllUserDto, GetAllUserResponseDto } from './dto/get-all-user.dto';
import { GetProfileUserResponseDto } from './dto/get-profile-user.dto';
import { UpdateProfileUserResponseDto, UpdateProfileUserDto } from './dto/update-profile-user.dto';

@Controller('users')
@ApiTags('Users')
@UseGuards(JwtAuthGuard)
export class UsersController {
	constructor(private readonly usersService: UsersService) {}

	@Get()
	@SetRoles(ROLE_USERS.ADMIN)
	@UseGuards(RolesGuard)
	@ResponseMessage('Data user telah berhasil diambil')
	@ApiOperation({ summary: 'GET all users' })
	@SetApiSuccessResponse(GetAllUserResponseDto, HttpStatus.OK)
	async getAll(@GetUser() user: JwtPayload, @Query() query: GetAllUserDto): Promise<GetAllUserResponseDto> {
		return this.usersService.findAll(user.id, query);
	}

	@Get('profile')
	@ResponseMessage('Data profile berhasil di ambil')
	@ApiOperation({ summary: 'GET profile users' })
	@SetApiSuccessResponse(GetProfileUserResponseDto, HttpStatus.OK)
	async getProfile(@GetUser() user: JwtPayload): Promise<GetProfileUserResponseDto> {
		return this.usersService.findProfile(user.id);
	}

	@Patch('profile')
	@ResponseMessage('Data profile berhasil di ubah')
	@ApiOperation({ summary: 'UPDATE profile users' })
	@SetApiSuccessResponse(UpdateProfileUserResponseDto, HttpStatus.OK)
	async updateProfile(
		@GetUser() user: JwtPayload,
		@Body() dto: UpdateProfileUserDto,
	): Promise<UpdateProfileUserResponseDto> {
		return this.usersService.updateProfile(user.id, dto);
	}
}
