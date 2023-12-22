import { CACHE_DURATION } from '$lib';
import { BACKEND_URL } from '$lib/server';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params, fetch, setHeaders }) => {
	const { section } = params;
	const response = await fetch(`${BACKEND_URL}/users`, { method: 'GET' });

	const users = await response.json();

	console.log('Section: ', section);
	console.log(users);

	setHeaders({ 'cache-control': `max-age=${CACHE_DURATION}, must-revalidate` });

	return {
		users
	};
};
