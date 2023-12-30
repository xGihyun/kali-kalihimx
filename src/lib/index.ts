import { ArrowClockwise, Guide, History, Home, Sword, Trophy } from './assets/icons';
import type { BlockData, Matchmake, Navigation, StrikeData, Video } from './types';
import {
	ancients_protection,
	double_edged_sword,
	extra_wind,
	twist_of_fate,
	viral_x_rival,
	warlords_domain
} from './assets/images/cards';

export const ARNIS_STRIKES_VIDEOS: Video[] = [
	{
		title: 'Strikes',
		url: 'https://youtu.be/9ImJFGii6lg'
	},
	{
		title: 'Blocks',
		url: 'https://youtu.be/vsTbagtEiyA'
	},
	{
		title: 'Forward Sinawali',
		url: 'https://youtu.be/0VTyA7fAoNg'
	},
	{
		title: 'Sideward Sinawali',
		url: 'https://youtu.be/GbHiKTmVgJw?t=85'
	},
	{
		title: 'Reverse Sinawali',
		url: 'https://youtu.be/GbHiKTmVgJw?t=343'
	}
];

export const ARNIS_FOOTWORKS_VIDEOS: Video[] = [
	{
		title: 'Caballero',
		url: 'https://youtu.be/jrXYbouUFR8?t=312'
	},
	{
		title: 'Triangle',
		url: 'https://youtu.be/jrXYbouUFR8?t=457'
	},
	{
		title: 'Reversed Triangle',
		url: 'https://youtu.be/jrXYbouUFR8?t=591'
	},
	{
		title: 'Star Reach',
		url: 'https://youtu.be/jrXYbouUFR8?t=694'
	}
];

export const RANK_LOGO_COLORS: Map<string, string> = new Map([
	['likas', 'border-white bg-gradient-to-l from-red-900 to-red-600'],
	['likha', 'border-white bg-gradient-to-l from-orange-900 to-orange-500'],
	['lakan', 'border-black bg-gradient-to-l from-amber-900 to-amber-500'],
	['grandmaster', 'border-red-800 bg-gradient-to-l from-red-900 to-red-600'],
	['unranked', 'border-border bg-background']
]);

export const CACHE_DURATION = 60 * 60;

export const ADMIN_ROUTES: Navigation = [
	{
		name: 'Matchmake',
		path: '/matchmake',
		icon: ArrowClockwise
	},
	{
		name: 'Match History',
		path: '/match-history',
		icon: History
	}
	// {
	// 	name: 'Users',
	// 	path: '/manage-users',
	// 	icon: People
	// }
];

export const USER_ROUTES: Navigation = [
	{
		name: 'Home',
		path: '/',
		icon: Home
	},
	{
		name: 'Rankings',
		path: '/leaderboards',
		icon: Trophy
	},
	{
		name: 'Guide',
		path: '/guide',
		icon: Guide
	},
	{
		name: 'Card Battle',
		path: '/card-battle',
		icon: Sword
	}
];

export const POWER_CARDS = new Map([
	[
		"Ancient's Protection",
		{
			image_url: ancients_protection,
			description: 'Immunity to deduction upon losing the Arnis match.'
		}
	],
	[
		'Double-edged Sword',
		{
			image_url: double_edged_sword,
			description:
				'Receive double the points after winning the Arnis match. Deduct double the points otherwise.'
		}
	],
	[
		'Extra Wind',
		{
			image_url: extra_wind,
			description: 'Select a new power card (excluding Extra Wind).'
		}
	],
	[
		'Twist of Fate',
		{
			image_url: twist_of_fate,
			description: 'Switch opponents for the upcoming Arnis match.'
		}
	],
	[
		'Viral x Rival',
		{
			image_url: viral_x_rival,
			description: 'Current opponent will also be their opponent for the next Arnis match.'
		}
	],
	[
		"Warlord's Domain",
		{
			image_url: warlords_domain,
			description: 'Change the skill to perform for the upcoming Arnis match.'
		}
	]
]);

export const SKILLS = new Map([
	['strikes', 'Strikes'],
	['blocks', 'Blocks'],
	['forward_sinawali', 'Forward Sinawali'],
	['sideward_sinawali', 'Sideward Sinawali'],
	['reversed_sinawali', 'Reversed Sinawali']
]);

export const FOOTWORKS = new Map([
	['guerrero', 'Guerrero'],
	['cabellero', 'Cabellero'],
	['triangle', 'Triangle'],
	['reversed_triangle', 'Reversed Triangle']
]);

export const MATCH_TYPES = new Map([
	['arnis', 'Arnis'],
	['card_battle', 'Card Battle']
]);

export const STRIKE_CARDS: StrikeData[] = [
	{
		data: {
			id: 'leg_strike',
			name: 'Leg Strike',
			skill: 'strike'
		},
		type: {
			damage: 5.0,
			accuracy: 0.9,
			effect: "Increase user's accuracy by 50%"
		}
	},
	{
		data: {
			id: 'temple_strike',
			name: 'Temple Strike',
			skill: 'strike'
		},
		type: {
			damage: 10.0,
			accuracy: 0.75,
			effect: "Decrease opponent's accuracy by 50%"
		}
	},
	{
		data: {
			id: 'shoulder_strike',
			name: 'Shoulder Strike',
			skill: 'strike'
		},
		type: {
			damage: 10.0,
			accuracy: 0.8,
			effect: "Decrease opponent's accuracy by 10%"
		}
	},
	{
		data: {
			id: 'shoulder_thrust',
			name: 'Shoulder Thrust',
			skill: 'strike'
		},
		type: {
			damage: 8.0,
			accuracy: 0.85,
			effect: "Decrease opponent's accuracy by 10%"
		}
	},
	{
		data: {
			id: 'eye_poke',
			name: 'Eye Poke',
			skill: 'strike'
		},
		type: {
			damage: 12.0,
			accuracy: 0.6,
			effect: "Decrease opponent's accuracy by 15%"
		}
	},
	{
		data: {
			id: 'stomach_thrust',
			name: 'Stomach Thrust',
			skill: 'strike'
		},
		type: {
			damage: 10.0,
			accuracy: 0.85,
			effect: "Increase user's damage by 50%"
		}
	},
	{
		data: {
			id: 'head_strike',
			name: 'Head Strike',
			skill: 'strike'
		},
		type: {
			damage: 18.0,
			accuracy: 0.5,
			effect: "Decrease opponent's accuracy by 15%"
		}
	}
];

export const BLOCK_CARDS: BlockData[] = [
	{
		data: {
			id: 'leg_strike',
			name: 'Leg Strike Block',
			skill: 'block'
		},
		type: {
			damage_reduction: 0.1,
			strike_to_cancel: 'Leg Strike',
			effect: "Increase user's accuracy by 10%"
		}
	},
	{
		data: {
			id: 'temple_strike',
			name: 'Temple Strike Block',
			skill: 'block'
		},
		type: {
			damage_reduction: 0.15,
			strike_to_cancel: 'Temple Strike',
			effect: "Decrease opponent's accuracy by 10%"
		}
	},
	{
		data: {
			id: 'shoulder_strike',
			name: 'Shoulder Strike Block',
			skill: 'block'
		},
		type: {
			damage_reduction: 0.15,
			strike_to_cancel: 'Shoulder Strike',
			effect: "Increase user's damage by 50%"
		}
	},
	{
		data: {
			id: 'shoulder_thrust',
			name: 'Shoulder Thrust Block',
			skill: 'block'
		},
		type: {
			damage_reduction: 0.15,
			strike_to_cancel: 'Shoulder Thrust',
			effect: "Decrease opponent's accuracy by 10%"
		}
	},
	{
		data: {
			id: 'eye_poke',
			name: 'Eye Poke Block',
			skill: 'block'
		},
		type: {
			damage_reduction: 0.15,
			strike_to_cancel: 'Eye Poke',
			effect: "Decrease opponent's accuracy by 10%"
		}
	},
	{
		data: {
			id: 'stomach_thrust',
			name: 'Stomach Thrust Block',
			skill: 'block'
		},
		type: {
			damage_reduction: 0.15,
			strike_to_cancel: 'Stomach Thrust',
			effect: "Increase user's damage by 10%"
		}
	},
	{
		data: {
			id: 'head_strike',
			name: 'Head Strike Block',
			skill: 'block'
		},
		type: {
			damage_reduction: 0.15,
			strike_to_cancel: 'Head Strike',
			effect: "Decrease opponent's damage by 20%"
		}
	}
];

export function getRankTitle(score: number): string | null {
	let rankTitle: string | null = null;

	if (score < 100) {
		rankTitle = 'unranked';
	} else if (score >= 100 && score < 200) {
		rankTitle = 'likas';
	} else if (score >= 200 && score < 250) {
		rankTitle = 'likha';
	} else if (score >= 250 && score < 300) {
		rankTitle = 'lakan';
	} else {
		rankTitle = 'grandmaster';
	}

	return rankTitle;
}

export function snakeCaseToTitleCase(input: string | null): string | undefined {
	if (!input) return;

	// Split the input string into words
	const words = input.split('_');

	// Capitalize the first letter of each word and join them with a space
	const titleCase = words.map((word) => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');

	return titleCase;
}

export function getOpponent(
	userId: string | undefined,
	match: Matchmake | undefined,
	original?: boolean
): { id: string | undefined; name: string; totalDamage: number | undefined } {
	// if (!match || userId) {
	// 	return {
	// 		id: undefined,
	// 		name: 'Unknown',
	// 		totalDamage: undefined
	// 	};
	// }

	// if (original) {
	// 	if (userId === match.og_user1_id) {
	// 		return {
	// 			id: match.og_user2_id,
	// 			name: `${match.og_user2_first_name} ${match.og_user2_last_name}`
	// 		};
	// 	}
	// }
	if (userId === match.user1_id) {
		return {
			id: match.user2_id,
			name: `${match.user2_first_name} ${match.user2_last_name}`,
			totalDamage: match.user1_total_damage
		};
	}

	return {
		id: match.user1_id,
		name: `${match.user1_first_name} ${match.user1_last_name}`,
		totalDamage: match.user1_total_damage
	};
}
