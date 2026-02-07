import { Test, TestingModule } from '@nestjs/testing';
import { GenerationsController } from './generations.controller';

describe('GenerationsController', () => {
	let controller: GenerationsController;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			controllers: [GenerationsController],
		}).compile();

		controller = module.get<GenerationsController>(GenerationsController);
	});

	it('should be defined', () => {
		expect(controller).toBeDefined();
	});
});
