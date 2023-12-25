import type { PageLoad } from './$types';

export const load: PageLoad = async ({ url, data }) => {
	const section = url.searchParams.get('section');
	const set = Number(url.searchParams.get('set')) || 1;
	const matchType = url.searchParams.get('match_type') || 'arnis';

	return {
		matches: data.matches,
		sections: data.sections,
		maxSets: data.maxSets,
		selectedSection: section,
		selectedSet: set,
		selectedMatchType: matchType
	};
};
