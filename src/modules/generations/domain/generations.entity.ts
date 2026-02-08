import { BadRequestException } from '@nestjs/common';
import { GenerationStatus } from '@prisma/client';

export class Generation {
	constructor(
		private readonly _id: string | undefined,
		private readonly _user_id: string,
		private _prompt: string,
		private _result: string | null,
		private _status: GenerationStatus,
		private _prompt_tokens: number,
		private _completion_tokens: number,
		private _total_tokens: number,
		private _thoughts_tokens: number,
		private _created_at: Date,
		private _updated_at: Date,
	) {}

	static restore(props: {
		id: string;
		user_id: string;
		prompt: string;
		result: string | null;
		status: GenerationStatus;
		prompt_tokens: number;
		completion_tokens: number;
		total_tokens: number;
		thoughts_tokens: number;
		created_at: Date;
		updated_at: Date;
	}): Generation {
		return new Generation(
			props.id,
			props.user_id,
			props.prompt,
			props.result,
			props.status,
			props.prompt_tokens,
			props.completion_tokens,
			props.total_tokens,
			props.thoughts_tokens,
			props.created_at,
			props.updated_at,
		);
	}

	static create(props: {
		user_id: string;
		prompt: string;
		prompt_tokens: number;
		completion_tokens: number;
		total_tokens: number;
		thoughts_tokens: number;
	}): Generation {
		const generate = new Generation(
			undefined,
			props.user_id,
			props.prompt,
			null,
			GenerationStatus.PENDING,
			props.prompt_tokens,
			props.completion_tokens,
			props.total_tokens,
			props.thoughts_tokens,
			new Date(),
			new Date(),
		);
		generate.validate();

		return generate;
	}

	update(props: {
		result?: string;
		status?: GenerationStatus;
		promptTokens?: number;
		completionTokens?: number;
		thoughtsTokens?: number;
		totalTokens?: number;
	}) {
		if (props.result !== undefined) this._result = props.result;
		if (props.status) this._status = props.status;

		if (props.promptTokens !== undefined) this._prompt_tokens = props.promptTokens;
		if (props.completionTokens !== undefined) this._completion_tokens = props.completionTokens;
		if (props.thoughtsTokens !== undefined) this._thoughts_tokens = props.thoughtsTokens;
		if (props.totalTokens !== undefined) this._total_tokens = props.totalTokens;

		this.updated();
	}

	private validate() {
		if (this._prompt.length > 200) throw new BadRequestException('Teks terlalu panjang (Maks: 200)!');
		// if (!this._email.endsWith('@gmail.com')) throw new BadRequestException('Format email tidak valid');
		// if (this._name.length < 3) throw new BadRequestException('Nama terlalu pendek');
	}

	private updated() {
		this._updated_at = new Date();
	}

	private thisTime() {
		return new Date();
	}

	changeStatus(status: GenerationStatus): void {
		this._status = status;
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

	get status(): GenerationStatus {
		return this._status;
	}

	get promptTokens(): number {
		return this._prompt_tokens;
	}

	get completionTokens(): number {
		return this._completion_tokens;
	}

	get totalTokens(): number {
		return this._total_tokens;
	}

	get thoughtsTokens(): number {
		return this._thoughts_tokens;
	}

	get createdAt(): Date {
		return this._created_at;
	}

	get updatedAt(): Date {
		return this._updated_at;
	}
}
