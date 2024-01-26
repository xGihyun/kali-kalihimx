import { BACKEND_URL } from '$env/static/private';
import type { Matchmake } from '$lib/types';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ fetch, params, setHeaders }) => {
	const { match_set_id } = params;

	const response = await fetch(`${BACKEND_URL}/matches/${match_set_id}`, {
		method: 'GET'
	});

	if (!response.ok) {
		return {
			match: undefined
		};
	}

	const match: Matchmake = await response.json();

	console.log(match);

	setHeaders({ 'cache-control': `max-age=${60 * 2}, must-revalidate` });

	return {
		match
	};
};
