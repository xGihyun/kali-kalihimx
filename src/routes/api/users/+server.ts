import { BACKEND_URL } from '$env/static/private';
import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ url, fetch, setHeaders }) => {
	const section = url.searchParams.get('section');

	console.log('Section ', section);
	console.log('Fetching users...');

	const response = await fetch(`${BACKEND_URL}/users?section=${section}&order_by=last_name`, {
		method: 'GET'
	});

	const users = await response.json();

	setHeaders({ 'cache-control': `max-age=0, s-maxage=120, proxy-revalidate` });

	return json(users);
};
