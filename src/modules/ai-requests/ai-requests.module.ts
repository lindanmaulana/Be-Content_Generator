import { Module } from '@nestjs/common';
import { AiRequestsController } from './ai-requests.controller';
import { AiRequestsService } from './ai-requests.service';

@Module({
	providers: [AiRequestsService],
	controllers: [AiRequestsController],
})
export class AiRequestsModule {}
