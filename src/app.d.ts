// See https://kit.svelte.dev/docs/types#app

import type { CardBattleTurn, Matchmake, User } from '$lib/types';

// for information about these interfaces
declare global {
	namespace App {
		// interface Error {}
		interface Locals {
			user_id: string | undefined;
		}
		// interface PageData {}
		interface PageState {
			selected: {
				turns: {
					user1: CardBattleTurn[];
					user2: CardBattleTurn[];
				};
				user: User | undefined;
				// match: Matchmake | undefined;
			};
		}
		// interface Platform {}
	}
}

export {};
