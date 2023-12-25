import type { Actions } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {};

export const actions: Actions = {
	default: async ({ fetch, request }) => {
		return {
			success: false
		};
	}
};
