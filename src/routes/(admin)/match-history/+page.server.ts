import { CACHE_DURATION } from '$lib';
import { BACKEND_URL } from '$lib/server';
import type { Matchmake, MaxSet, Section, User } from '$lib/types';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ fetch, url, setHeaders }) => {
	const section = url.searchParams.get('section');
	const set = Number(url.searchParams.get('set')) || 1;

	const getMatches = async () => {
		const response = await fetch(`${BACKEND_URL}/matches?set=${set}&section=${section}`, {
			method: 'GET'
		});

		if (response.ok) {
			const matches: Matchmake[] = await response.json();

			return matches;
		}

		return null;
	};

	const getSections = async () => {
		const response = await fetch(`${BACKEND_URL}/sections`, { method: 'GET' });
		const sections: Section[] = await response.json();

		if (response.ok) {
			return sections;
		}

		return null;
	};

	const getMaxSets = async () => {
		const response = await fetch(`${BACKEND_URL}/max_sets`, { method: 'GET' });
		const maxSets: MaxSet[] = await response.json();

		if (response.ok) {
			return maxSets;
		}

		return null;
	};

	setHeaders({ 'cache-control': `max-age=${CACHE_DURATION}, must-revalidate` });

	return {
		matches: await getMatches(),
		sections: await getSections(),
		maxSets: await getMaxSets(),
		selectedSection: section,
		selectedSet: set
	};
};
