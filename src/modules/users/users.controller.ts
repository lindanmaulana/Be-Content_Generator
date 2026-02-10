import { GetUser } from '@/common/decorators/get-user.decorator';
import { ResponseMessage } from '@/common/decorators/response-message.decorator';
import { SetApiSuccessResponse } from '@/common/decorators/set-api-success-response.decorator';
import { SetRoles } from '@/common/decorators/set-roles.decorator';
import { JwtAuthGuard } from '@/common/guards/jwt-auth.guard';
import type { JwtPayload } from '@/common/interfaces/jwt-payload.interface';
import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { ROLE_USERS } from '@prisma/client';
import { FindAllUserDto, FindAllUserResponseDto } from './dto/find-all-user.dto';
import { UsersService } from './users.service';
import { RolesGuard } from '@/common/guards/roles.guard';

@Controller('users')
@ApiTags('Users')
@UseGuards(JwtAuthGuard)
export class UsersController {
	constructor(private readonly usersService: UsersService) {}

	@Get()
	@SetRoles(ROLE_USERS.ADMIN)
	@UseGuards(RolesGuard)
	@ResponseMessage('Data user telah berhasil diambil')
	@ApiOperation({ summary: 'GET ALL users' })
	@SetApiSuccessResponse(FindAllUserResponseDto, 200)
	async findAll(@GetUser() user: JwtPayload, @Query() query: FindAllUserDto): Promise<FindAllUserResponseDto> {
		return this.usersService.findAll(user.id, query);
	}
}
