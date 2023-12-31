import type { ComponentType, SvelteComponent } from 'svelte';
import type { RegisterSchema, arnisMatchSchema } from './schemas';
import z from 'zod';

export type User = {
	id: string;
	email: string;
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
	is_private: boolean;
};

export type Register = Omit<z.infer<typeof RegisterSchema>, 'password'>;

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
	status: 'pending' | 'done';
	set: number;
	user1_total_damage?: number;
	user2_total_damage?: number;
};

export type LatestOpponent = {
	first_name: string;
	last_name: string;
	score: number;
	avatar_url: string;
	banner_url: string;
};

export type MaxSet = {
	section: string;
	max_set: number;
};

export type CardBattle = {
	user1_id: string;
	user2_id: string;
	user1_total_damage: number;
	user2_total_damage: number;
};

export type StrikeCard = {
	damage: number;
	accuracy: number;
	effect: string;
};

export type BlockCard = {
	damage_reduction: number;
	strike_to_cancel: string;
	effect: string;
};

// Data to pass as payload
export type BattleCardData = {
	id: string;
	name: string;
	skill: 'strike' | 'block';
};

export type StrikeData = {
	data: {
		id: string;
		name: string;
		skill: 'strike';
	};
	type: StrikeCard;
};

export type BlockData = {
	data: {
		id: string;
		name: string;
		skill: 'block';
	};
	type: BlockCard;
};

export type BattleCard = StrikeData | BlockData;

export type UpdateScore = {
	user_id: string;
	score: number;
	difference: number;
	is_winner: boolean;
};

export type PowerCard = {
	id: string;
	name: string;
	is_used: boolean;
	is_active: boolean;
	user_id: string;
};

export type CardBattleTurn = {
	id: string;
	card_name: string;
	card_effect?: string;
	damage: number;
	is_cancelled: boolean;
	turn_number: number;
	match_set_id: string;
	user_id: string;
};

export type UpdatePowerCard = {
	user_id: string;
	is_activated: boolean;
	is_used: boolean;
};

export type LoadingStatus = 'none' | 'pending' | 'success' | 'error';

export type RequestStatus = {
	type: 'none' | 'pending' | 'success' | 'error';
	code?: number;
};

export type Video = {
	title: string;
	url: string;
};

export type ArnisMatch = z.infer<typeof arnisMatchSchema>;
