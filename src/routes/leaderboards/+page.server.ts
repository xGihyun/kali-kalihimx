import { CACHE_DURATION } from '$lib';
import { BACKEND_URL } from '$lib/server';
import type { User } from '$lib/types';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ fetch, setHeaders }) => {
	const response = await fetch(`${BACKEND_URL}/users?order_by=true`, { method: 'GET' });

	const users: User[] = await response.json();

	console.log(users);

	setHeaders({ 'cache-control': `max-age=${CACHE_DURATION}, must-revalidate` });

	return {
		users
	};
};
