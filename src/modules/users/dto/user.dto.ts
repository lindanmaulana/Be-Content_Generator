import { ROLE_USERS } from '@prisma/client';
import z from 'zod';

export const UserBaseSchema = z.object({
	id: z.string(),
	name: z.string().min(1, { error: 'Nama tidak boleh kosong' }),
	email: z.email({ error: 'Format email tidak valid' }).min(1, { error: 'Email tidak boleh kosong' }),
	password: z.string().min(8, { error: 'Password minimal 8 karakter' }),
	role: z.enum(ROLE_USERS).default(ROLE_USERS.CUSTOMER),
	created_at: z.string().refine((v) => !Number.isNaN(Date.parse(v)), { error: 'Invalid iso date' }),
	updated_at: z.string().refine((v) => !Number.isNaN(Date.parse(v)), { error: 'Invalid iso date' }),
});
