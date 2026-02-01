import { Test, TestingModule } from '@nestjs/testing';
import { AiRequestsService } from './ai-requests.service';

describe('AiRequestsService', () => {
	let service: AiRequestsService;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [AiRequestsService],
		}).compile();

		service = module.get<AiRequestsService>(AiRequestsService);
	});

	it('should be defined', () => {
		expect(service).toBeDefined();
	});
});
