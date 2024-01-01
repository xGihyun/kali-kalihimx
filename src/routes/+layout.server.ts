import type { LayoutServerLoad } from './$types';
import { redirect } from '@sveltejs/kit';

export const load: LayoutServerLoad = async ({
	locals: { getSession, getUserData },
	depends,
	url
}) => {
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

	const user = await getUserData();

	depends('user:images');

	return {
		session,
		user
	};
};
