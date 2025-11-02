export interface SignupInput {
	first_name: string;
	last_name: string;
	email: string;
	password: string;
	role?: string;
}

export interface LoginInput {
	email: string;
	password: string;
}

export interface AuthResponse {
	message: string;
	user: SessionUser;
	token: {
		accessToken: {
			token: string;
			type: string;
			expiresAt: string;
			expiresInSeconds: number;
		};
	};
}

export type Role = "invalide" | "admin" | "member";

export interface User {
	id: number;
	first_name: string;
	last_name: string;
	password: string;
	email: string;
	role: Role;
	status: boolean;
	created_at: Date;
	updated_at?: Date;
}

export interface Language {
	id: number;
	name: string;
	slug: string;
	status: boolean;
	created_at: Date;
	updated_at?: Date;
}

export interface Snippet {
	id: number;
	title: string;
	description?: string;
	code: string;
	language?: Language | null;
	tags?: Tag[];
	status: boolean;
	created_at: Date;
	updated_at?: Date;
}

export interface Tag {
	id: number;
	name: string;
	status: boolean;
	created_at: Date;
	updated_at?: Date;
}

export interface SnippetHasTag {
	snippet_id: number;
	tag_id: number;
	status: boolean;
	created_at: Date;
	updated_at?: Date;
}

export interface SnippetInput {
	title: string;
	description?: string;
	code: string;
	language_id: number;
	tagIds?: number[];
	status?: boolean;
}

export type SessionUser = Omit<User, "password">;
