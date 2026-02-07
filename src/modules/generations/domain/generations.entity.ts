export class Generation {
	constructor(
		private readonly _id: string | undefined,
		private readonly _user_id: string,
		private _prompt: string,
		private _result: string | null,
		private _created_at: Date,
		private _updated_at: Date,
	) {}

	static restore(props: {
		id: string;
		user_id: string;
		prompt: string;
		result: string | null;
		created_at: Date;
		updated_at: Date;
	}): Generation {
		return new Generation(props.id, props.user_id, props.prompt, props.result, props.created_at, props.updated_at);
	}

	static create(props: { user_id: string; prompt: string }): Generation {
		const generate = new Generation(undefined, props.user_id, props.prompt, null, new Date(), new Date());
		generate.validate();

		return generate;
	}

	private validate() {
		// if (!this._email.endsWith('@gmail.com')) throw new BadRequestException('Format email tidak valid');
		// if (this._name.length < 3) throw new BadRequestException('Nama terlalu pendek');
	}

	private updated() {
		this._updated_at = new Date();
	}

	private thisTime() {
		return new Date();
	}

	get id(): string {
		if (this._id === undefined) throw new Error('Id cannot be accessed because the entity is not persisted yet.');

		return this._id;
	}

	get userId(): string {
		return this._user_id;
	}

	get prompt(): string {
		return this._prompt;
	}

	get result(): string | null {
		return this._result;
	}

	get createdAt(): Date {
		return this._created_at;
	}

	get updatedAt(): Date {
		return this._updated_at;
	}
}
