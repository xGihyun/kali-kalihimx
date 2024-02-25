import { BACKEND_URL } from '$env/static/private';
import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

// NOTE: Could use supabase sdk instead
export const GET: RequestHandler = async ({ url, fetch, setHeaders }) => {
	const section = url.searchParams.get('section');

	console.log('Section ', section);
	console.log('Fetching users...');

	const response = await fetch(`${BACKEND_URL}/users?section=${section}&order_by=last_name`, {
		method: 'GET'
	});

	const users = await response.json();

	setHeaders({ 'cache-control': `max-age=${60 * 2}, must-revalidate` });

	return json(users);
};

export const PATCH: RequestHandler = async ({ fetch, locals, request }) => {
	const session = await locals.getSession();

	if (!session) {
		return new Response();
	}

	const user_id = session.user.id;
	const { is_private } = await request.json();

	const response = await fetch(`${BACKEND_URL}/users/${user_id}/private`, {
		method: 'PATCH',
		body: JSON.stringify({
			is_private
		}),
		headers: {
			'Content-Type': 'application/json'
		}
	});

	if (!response.ok) {
		console.log('Failed to update private status');
		console.log(await response.text());
	}

	return new Response();
};
