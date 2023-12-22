import { BACKEND_URL } from '$lib/server';
import { redirect } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types';
import type { User } from '$lib/types';

export const load: LayoutServerLoad = async ({ fetch, locals }) => {
	const { user_id } = locals;

	console.log(user_id);

	// Fix error 500 when logging out
	if (!user_id) {
		return;
		// throw redirect(307, '/login');
	}

	const response = await fetch(`${BACKEND_URL}/users/${user_id}`, {
		method: 'GET'
	});

	const user: User = await response.json();

	return {
		user
	};
};
