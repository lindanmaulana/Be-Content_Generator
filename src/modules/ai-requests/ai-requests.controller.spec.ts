import { Test, TestingModule } from '@nestjs/testing';
import { AiRequestsController } from './ai-requests.controller';

describe('AiRequestsController', () => {
  let controller: AiRequestsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AiRequestsController],
    }).compile();

    controller = module.get<AiRequestsController>(AiRequestsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
