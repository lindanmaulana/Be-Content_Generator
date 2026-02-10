import { BadRequestException } from '@nestjs/common';
import { ROLE_USERS } from '@prisma/client';

export class User {
	constructor(
		private readonly _id: string | undefined,
		private _name: string,
		private _email: string,
		private _password: string,
		private _role: ROLE_USERS,
		private _created_at: Date,
		private _updated_at: Date,
	) {
		if (this._role === ROLE_USERS.CUSTOMER) {
			const normalize = this._name.toLocaleLowerCase();

			if (normalize.includes('admin')) throw new BadRequestException('Nama pengguna tidak diperbolehkan');
		}
	}

	static restore(props: {
		id: string;
		name: string;
		email: string;
		password: string;
		role: ROLE_USERS;
		created_at: Date;
		updated_at: Date;
	}): User {
		return new User(
			props.id,
			props.name,
			props.email,
			props.password,
			props.role,
			props.created_at,
			props.updated_at,
		);
	}

	static create(props: { name: string; email: string; password: string; role: ROLE_USERS }): User {
		return new User(undefined, props.name, props.email, props.password, props.role, new Date(), new Date());
	}

	changeEmail(email: string) {
		const normalize = email.trim().toLowerCase();
		if (!normalize.endsWith('@gmail.com')) throw new BadRequestException('Format email tidak valid');

		this._email = email;
		this.updated();
	}

	get id(): string {
		if (this._id === undefined) throw new Error('Id cannot be accessed because the entity is not persisted yet.');

		return this._id;
	}

	get name(): string {
		return this._name;
	}

	get email(): string {
		return this._email;
	}

	get role(): ROLE_USERS {
		return this._role;
	}

	get password(): string {
		return this._password;
	}

	get createdAt(): Date {
		return this._created_at;
	}

	get updatedAt(): Date {
		return this._updated_at;
	}

	private updated() {
		this._updated_at = new Date();
	}

	private thisTime() {
		return new Date();
	}
}
