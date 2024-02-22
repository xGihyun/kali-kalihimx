// See https://kit.svelte.dev/docs/types#app

import type { CardBattleTurn, User } from '$lib/types';
import type { Session, SupabaseClient } from '@supabase/supabase-js';

// for information about these interfaces
declare global {
	namespace App {
		// interface Error {}
		interface Locals {
			user_id: string | undefined;
			supabase: SupabaseClient;
			supabaseAdmin: SupabaseClient;
			getSession: () => Promise<Session | null>;
			getUserData: () => Promise<User>;
		}
		// interface PageData {}
		interface PageState {
			selected: {
				turns: {
					user1: CardBattleTurn[];
					user2: CardBattleTurn[];
				};
				user: User | undefined;
			};
		}
		// interface Platform {}
	}
}

export {};
