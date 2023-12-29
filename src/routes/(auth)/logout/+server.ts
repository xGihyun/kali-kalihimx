import { redirect, type RequestHandler } from '@sveltejs/kit';
import { error } from '@sveltejs/kit';

export const POST: RequestHandler = async ({ locals: { supabase } }) => {
	const { error: err } = await supabase.auth.signOut();

	if (err) {
		error(500, {
			message: 'Failed to log out.'
		});
	}

	console.log('Successfully logged out.');

	throw redirect(303, '/');
};
