import type { ComponentType, SvelteComponent } from 'svelte';

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

export type ArnisMatch = {
	section: string;
	skill: string;
	footwork: string;
};

export type Matchmake = {
	id: string;
	created_at: string;
	user1_id: string;
	user2_id: string;
	og_user1_id: string;
	og_user2_id: string;
	user1_first_name?: string;
	user1_last_name?: string;
	user2_first_name?: string;
	user2_last_name?: string;
	section: string;
	arnis_skill: string;
	arnis_footwork: string;
	card_deadline: string;
	status: string;
	set: number;
};

export type MaxSet = {
	section: string;
	max_set: number;
};
