import {
	Inject,
	Injectable,
	InternalServerErrorException,
	NotFoundException,
	ServiceUnavailableException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios, { AxiosResponse } from 'axios';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';

interface HuggingFaceGenerationResponse {
	generated_text: string;
}

@Injectable()
export class AiService {
	protected logContext = this.constructor.name;
	constructor(
		@Inject(WINSTON_MODULE_NEST_PROVIDER) private readonly logger: Logger,
		private readonly configService: ConfigService,
	) {}
	async generate(prompt: string): Promise<string> {
		const baseUrl = this.configService.get<string>('HF_BASE_URL');
		const apiKey = this.configService.get<string>('HF_API_KEY');

		if (!baseUrl) {
			this.logger.warn('Base url ai tidak ditemukan', { context: this.logContext });
			throw new NotFoundException('');
		}

		if (!apiKey) {
			this.logger.warn('Api key ai tidak ditemukan', { context: this.logContext });
			throw new InternalServerErrorException('Terjadi kesalahan pada sistem, please try again later.');
		}

		const response: AxiosResponse<HuggingFaceGenerationResponse[]> = await axios.post(
			baseUrl,
			{ inputs: prompt },
			{
				headers: {
					Authorization: `Bearer ${apiKey}`,
					'Content-Type': 'application/json',
				},
				timeout: 60000,
			},
		);

		if (!Array.isArray(response.data) || !response.data[0]?.generated_text) {
			this.logger.warn('Ai tidak dapat meresponse dengan baik', { context: this.logContext, prompt: prompt });
			throw new ServiceUnavailableException('Ai response tidak valid');
		}

		return response.data[0].generated_text;
	}
}
