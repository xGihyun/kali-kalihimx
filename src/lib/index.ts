import { ArrowClockwise, Guide, History, Home, People, Sword, Trophy } from './assets/icons';
import type { BattleCard, Navigation } from './types';

export const CACHE_DURATION = 600;

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

export const STRIKE_CARDS: BattleCard[] = [
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

export const BLOCK_CARDS: BattleCard[] = [
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
