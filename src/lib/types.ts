export type User = {
	id: string;
	email: string;
	password: string;
	section: string;
	first_name: string;
	last_name: string;
	age: number;
	contact_number: number;
	sex: number;
	rank_overall: number;
	rank_section: number;
	rank_title?: string;
	score: number;
	role: string;
	avatar_url?: string;
	banner_url?: string;
};

export type Register = {
	email: string;
	password: string;
	section: string;
	first_name: string;
	last_name: string;
	age: number;
	contact_number: number;
	sex: number;
};

export type Login = {
	email: string;
	password: string;
};

export type Section = {
	id: string;
	name: string;
	user_limit: number;
};

export type Navigation = {
	name: string;
	path: string;
	icon?: ComponentType<SvelteComponent>;
}[];
