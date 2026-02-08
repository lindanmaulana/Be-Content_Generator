export const REPOSITORY_TOKENS = {
	USER: Symbol('USER_REPOSITORY'),
	AUTH: Symbol('AUTH_REPOSITORY'),
	GENERATION: Symbol('GENERATION_REPOSITORY'),
} as const;

export const LIBRARY_TOKENS = {
	HASH: Symbol('LIB_HASH'),
	GEMINI_AI: Symbol('GEMINI_CLIENT'),
} as const;
