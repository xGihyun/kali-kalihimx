import { redirect, type RequestHandler } from '@sveltejs/kit';

export const POST: RequestHandler = async ({ cookies, locals }) => {
	cookies.delete('session', { path: '/' });

	locals.user_id = '';

	console.log('Deleted cookies.');

	redirect(302, '/login');
};
