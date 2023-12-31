import { BACKEND_URL } from '$env/static/private';
import { CACHE_DURATION } from '$lib';
import type { Section, User } from '$lib/types';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ fetch, setHeaders, url }) => {
	const limit = url.searchParams.get('limit') || 5;
	const skip = Number(url.searchParams.get('skip')) || 0;
	const sections = url.searchParams.get('sections');

	const getUsers = async () => {
		const response = await fetch(
			`${BACKEND_URL}/users?order_by=score&order=desc&skip=${skip}${
				sections ? `&section=${sections}` : `&limit=${limit}`
			}`,
			{
				method: 'GET'
			}
		);
		const users: User[] = await response.json();

		return users;
	};

	const getUserCount = async () => {
		const response = await fetch(`${BACKEND_URL}/users/count`, {
			method: 'GET'
		});
		const { total } = await response.json();

		return (total as number) || 0;
	};

	const getSections = async () => {
		const response = await fetch(`${BACKEND_URL}/sections`, { method: 'GET' });
		const sections: Section[] = await response.json();

		return sections;
	};

	const foo = Promise.all([getUsers(), getSections(), getUserCount()]);

	setHeaders({ 'cache-control': `max-age=0, s-maxage=${CACHE_DURATION}, proxy-revalidate` });

	return {
		lazy: {
			foo
		},
		skip,
		filteredSections: sections
	};
};
