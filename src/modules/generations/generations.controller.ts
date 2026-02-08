import { JwtAuthGuard } from '@/common/guards/jwt-auth.guard';
import { Body, Controller, Get, HttpStatus, Post, Query, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { CreateGenerationDto, CreateGenerationResponseDto } from './dto/create-generation.dto';
import { ResponseMessage } from '@/common/decorators/response-message.decorator';
import { SetApiSuccessResponse } from '@/common/decorators/set-api-success-response.decorator';
import { GenerationsService } from './generations.service';
import { GetUser } from '@/common/decorators/get-user.decorator';
import type { JwtPayload } from '@/common/interfaces/jwt-payload.interface';
import { FindAllGenerationDto, FindAllGenerationResponseDto } from './dto/find-all-generation.dto';

@Controller('generations')
@ApiTags('Generations')
@UseGuards(JwtAuthGuard)
export class GenerationsController {
	constructor(private readonly generationService: GenerationsService) {}

	@Get()
	@ResponseMessage('Data generate telah berhasil diambil')
	@ApiOperation({ summary: 'Get all generation' })
	@SetApiSuccessResponse(FindAllGenerationResponseDto, 200)
	async getAll(
		@GetUser() user: JwtPayload,
		@Query() query: FindAllGenerationDto,
	): Promise<FindAllGenerationResponseDto> {
		return this.generationService.findAll(user.id, query);
	}

	@Post()
	@ResponseMessage('Berhasil mengirim prompt')
	@ApiOperation({ summary: 'Generate Content' })
	@SetApiSuccessResponse(CreateGenerationResponseDto, HttpStatus.CREATED)
	async create(
		@GetUser() authUser: JwtPayload,
		@Body() dto: CreateGenerationDto,
	): Promise<CreateGenerationResponseDto> {
		return this.generationService.create(authUser, dto);
	}
}
