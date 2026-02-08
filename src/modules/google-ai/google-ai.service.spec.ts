import { Test, TestingModule } from '@nestjs/testing';
import { GoogleAiService } from './google-ai.service';

describe('GoogleAiService', () => {
	let service: GoogleAiService;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [GoogleAiService],
		}).compile();

		service = module.get<GoogleAiService>(GoogleAiService);
	});

	it('should be defined', () => {
		expect(service).toBeDefined();
	});
});
