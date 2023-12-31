import { BACKEND_URL } from '$env/static/private';
import type { Section } from 'radix-icons-svelte';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ fetch, setHeaders, depends }) => {
	const response = await fetch(`${BACKEND_URL}/sections/count`, { method: 'GET' });
	const sections: Section[] = await response.json();

	console.log(sections);

	depends('sections:table');

	setHeaders({ 'cache-control': `max-age=0, s-maxage=${60 * 5}, proxy-revalidate` });

	return {
		sections
	};
};
