import { BACKEND_URL } from '$env/static/private';
import type { User } from '$lib/types';
import { json, type RequestHandler } from '@sveltejs/kit';

export const GET: RequestHandler = async ({ fetch, params, setHeaders }) => {
	const { id } = params;

	if (!id) {
		return new Response('ID not found.');
	}

	const response = await fetch(`${BACKEND_URL}/users/${id}?filter=first_name,last_name`, {
		method: 'GET'
	});

	const result: Pick<User, 'first_name' | 'last_name'> = await response.json();

	setHeaders({ 'cache-control': `max-age=60, must-revalidate` });

	return json(result);
};
