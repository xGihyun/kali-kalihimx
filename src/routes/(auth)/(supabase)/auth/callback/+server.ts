import { error, redirect, type RequestHandler } from '@sveltejs/kit';

export const GET: RequestHandler = async ({ url, locals: { supabase } }) => {
	const code = url.searchParams.get('code');

	if (code) {
		const { error: err } = await supabase.auth.exchangeCodeForSession(code);

		if (err) {
			console.log(err.message);
			throw error(500, `Failed to exchange code for session: ${err.message}`);
		}
	}

	redirect(303, '/');
};
