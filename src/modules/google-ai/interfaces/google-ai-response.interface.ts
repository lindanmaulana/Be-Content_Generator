export interface GeminiUsageMetadata {
	promptTokenCount: number;
	candidatesTokenCount: number;
	totalTokenCount: number;
	thoughtsTokenCount?: number; // Properti baru untuk Gemini 3
	promptTokensDetails?: any[];
}

export interface GeminiCandidate {
	content: {
		role: string;
		parts: Array<{ text: string }>;
	};
	finishReason: string;
	avgLogprobs?: number;
}

export interface GeminiResponse {
	text: string;
	responseId?: string;
	modelVersion: string;
	usageMetadata: GeminiUsageMetadata;
	candidates: GeminiCandidate[];
}
