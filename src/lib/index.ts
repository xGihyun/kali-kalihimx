import { ArrowClockwise, Guide, History, Home, People, Sword, Trophy } from './assets/icons';
import type { Navigation } from './types';

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
		name: 'Battle',
		path: '/battle',
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
