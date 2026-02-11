export const CACHE_KEYS = {
	USERS: {
		VERSION_POINTER: (id: string) => `users:version:${id}`,
		DATA: (id: string, version: number, feature: string) => `users:${feature}:${id}:${version}`,
	},
};
