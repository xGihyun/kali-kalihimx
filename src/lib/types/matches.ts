export type Status = 'pending' | 'done';
export type Verdict = 'win' | 'lose' | 'draw' | 'pending';

export type MatchUserClient = {
	id: string;

	user_id: string;
	match_id: string;
	score: number;
	card_damage: number;
	arnis_verdict: Verdict;
	des_count: number;
	ap_count: number;
	is_swapped: boolean;
};

export type MatchClient = {
	id: string;

	created_at: string;
	card_deadline: string;
	batch: number;
	section: string;
	status: Status;
	arnis_skill: string;
	users: MatchUserClient[];
};

export type Opponent = {
	id: string;
	first_name: string;
	last_name: string;
	score: number;
	avatar_url?: string;
	banner_url?: string;
};
