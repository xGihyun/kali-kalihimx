import { redirect, type RequestHandler } from '@sveltejs/kit';

export const POST: RequestHandler = async ({ cookies, locals }) => {
	if (!locals.user_id) {
		redirect(303, '/login');
	}

	cookies.delete('session', { path: '/' });

	locals.user_id = undefined;

	console.log('Deleted cookies.');

	redirect(303, '/login');
};
