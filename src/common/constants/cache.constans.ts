export const CACHE_KEYS = {
	USERS: {
		VERSION_POINTER: (id: string) => `users:version:${id}`,
		DATA: (feature: string, userId: string, version: number) =>
			`users:${feature}:${userId}${version ? `:${version}` : ''}`,
	},

	GENERATIONS: {
		VERSION_POINTER: (userId: string) => `generations:users:version:${userId}`,
		DATA: (feature: string, userId: string, version?: number) =>
			`generations:${feature}:${userId}${version ? `:${version}` : ''}`,
	},
};
