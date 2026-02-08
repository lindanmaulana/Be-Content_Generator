import { LIBRARY_TOKENS } from '@/common/constants/tokens';
import { GoogleGenAI } from '@google/genai';
import { BadRequestException, Inject, Injectable, InternalServerErrorException } from '@nestjs/common';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';
import { GeminiResponse } from './interfaces/google-ai-response.interface';

@Injectable()
export class GoogleAiService {
	protected logContext = this.constructor.name;
	constructor(
		@Inject(LIBRARY_TOKENS.GEMINI_AI) private readonly genAI: GoogleGenAI,
		@Inject(WINSTON_MODULE_NEST_PROVIDER) private readonly logger: Logger,
	) {}

	async generateContent(prompt: string): Promise<GeminiResponse> {
		this.logger.log(`Generating content for prompt: ${prompt.substring(0, 50)}...`, { context: this.logContext });

		if (prompt.length > 200) {
			this.logger.warn('Text terlalu panjang', { context: this.logContext, prompt_length: prompt.length });
			throw new BadRequestException('Teks terlalu panjang (Maks. 200 karakter).');
		}

		try {
			const result = await this.genAI.models.generateContent({
				model: 'gemini-3-flash-preview',
				contents: prompt,
				config: {
					maxOutputTokens: 1000,
					temperature: 0.7,
					systemInstruction: `Kamu adalah Content Generator.
						User hanya memberi JUDUL atau TOPIK.
						Tugasmu membuat artikel SEO friendly.

						Gunakan format WAJIB:

						# [JUDUL]
						## Pendahuluan
						## Pembahasan Utama
						## Kesimpulan
						---
						**Tag SEO:** #tag1 #tag2

						Aturan:
						- Bahasa kasual sopan
						- Langsung ke judul
						- Tanpa penjelasan tambahan
						`,
				},
			});

			const response = result as unknown as GeminiResponse;

			if (!response.text) {
				this.logger.warn('Gemini tidak meresponse', { context: this.logContext });
			}

			return response;
		} catch (error) {
			const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
			this.logger.error('Gemini Error:', errorMessage, { context: this.logContext });

			if (errorMessage.includes('quota')) {
				throw new InternalServerErrorException('Layanan sedang mencapai batas kapasitas, coba lagi nanti.');
			}

			if (errorMessage.includes('safety')) {
				throw new BadRequestException('Topik yang Anda masukkan melanggar kebijakan konten kami.');
			}

			throw new InternalServerErrorException('Terjadi kesalahan pada sistem pembuat konten.');
		}
	}
}
