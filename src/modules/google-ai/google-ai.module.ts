import { InternalServerErrorException, Module } from '@nestjs/common';
import { GoogleAiService } from './google-ai.service';
import { LIBRARY_TOKENS } from '@/common/constants/tokens';
import { GoogleGenAI } from '@google/genai';

@Module({
	providers: [
		GoogleAiService,
		{
			provide: LIBRARY_TOKENS.GEMINI_AI,
			useFactory: () => {
				const apiKey = process.env.GEMINI_API_KEY;
				if (!apiKey)
					throw new InternalServerErrorException('Terjadi kesalahan pada sistem, please try again later!');
				return new GoogleGenAI({ apiKey: apiKey });
			},
		},
	],

	exports: [GoogleAiService],
})
export class GoogleAiModule {}
