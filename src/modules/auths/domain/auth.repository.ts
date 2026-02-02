import { Auth } from './auth.entity';

export interface AuthRepository {
	findByEmail(email: string): Promise<Auth | null>;
	create(user: Auth): Promise<Auth>;
}
