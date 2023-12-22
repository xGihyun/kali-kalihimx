import { redirect, type Handle } from '@sveltejs/kit';

export const handle: Handle = async ({ event, resolve }) => {
	const session = event.cookies.get('session');

	if (session) {
		event.locals.user_id = session;
	}

	if (event.url.pathname !== '/login' && !session) {
		console.log('Access Denied');

		throw redirect(307, '/login');
	}

	return await resolve(event);
};
