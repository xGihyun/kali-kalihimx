import { BACKEND_URL } from '$env/static/private';
import { CACHE_DURATION } from '$lib';
import type { Section, User } from '$lib/types';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ fetch, setHeaders }) => {
	const getUsers = async () => {
		const response = await fetch(`${BACKEND_URL}/users?order_by=true`, { method: 'GET' });
		const users: User[] = await response.json();

		return users;
	};

	const getSections = async () => {
		const response = await fetch(`${BACKEND_URL}/sections`, { method: 'GET' });
		const sections: Section[] = await response.json();

		return sections;
	};

	setHeaders({ 'cache-control': `max-age=${CACHE_DURATION}, must-revalidate` });

	return {
		users: await getUsers(),
		sections: await getSections()
	};
};
