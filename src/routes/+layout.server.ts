import type { LayoutServerLoad } from './$types';
import type { User } from '$lib/types';
import { BACKEND_URL } from '$env/static/private';
import { redirect } from '@sveltejs/kit';

export const load: LayoutServerLoad = async ({ locals: { getSession }, depends, fetch, url }) => {
	// User session
	const session = await getSession();

	if (session && url.pathname === '/register') {
		throw redirect(302, '/');
	}

	if (!session) {
		return {
			session: null,
			user: undefined
		};
	}

	// User data
	const response = await fetch(`${BACKEND_URL}/users/${session?.user.id}`, {
		method: 'GET'
	});

	const user: User = await response.json();

	depends('user:images');

	return {
		session,
		user
	};
};
