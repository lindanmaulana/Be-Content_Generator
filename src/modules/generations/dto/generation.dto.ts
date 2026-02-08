import z from 'zod';

export const BaseGenerationSchema = z.object({
	id: z.string().min(1, { error: 'Id generation tidak boleh kosong!' }),
	user_id: z.string().min(1, { error: 'Id user tidak boleh kosong!' }),
	prompt: z
		.string()
		.min(1, { error: 'Prompt tidak boleh kosong!' })
		.max(200, { error: 'Teks terlalu panjang (Maks: 200)' }),
	result: z.string().optional().nullable(),
	prompt_tokens: z.coerce.number().int().positive(),
	completion_tokens: z.coerce.number().int().positive(),
	throught_tokens: z.coerce.number().int().positive(),
	total_tokens: z.coerce.number().int().positive(),
	created_at: z.string().refine((v) => !Number.isNaN(Date.parse(v)), { error: 'Invalid iso date!' }),
	updated_at: z.string().refine((v) => !Number.isNaN(Date.parse(v)), { error: 'Invalid iso date!' }),
});
