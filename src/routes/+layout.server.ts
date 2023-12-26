import { BACKEND_URL } from '$lib/server';
import type { LayoutServerLoad } from './$types';
import type { User } from '$lib/types';

export const load: LayoutServerLoad = async ({ fetch, locals }) => {
	const { user_id } = locals;

	if (!user_id) {
		return {
			user: undefined
		};
	}

	const response = await fetch(`${BACKEND_URL}/users/${user_id}`, {
		method: 'GET'
	});

	const user: User = await response.json();

	return {
		user
	};
};
