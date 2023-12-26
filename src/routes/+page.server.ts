import { BACKEND_URL } from '$lib/server';
import type { Matchmake, PowerCard } from '$lib/types';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ fetch, locals, setHeaders }) => {
	const { user_id } = locals;

	const getLatestMatches = async () => {
		const response = await fetch(`${BACKEND_URL}/matches/latest`, {
			method: 'POST',
			body: JSON.stringify({
				user_id
			}),
			headers: {
				'Content-Type': 'application/json'
			}
		});

		const matches: Matchmake[] = await response.json();

		console.log(matches);

		return matches;
	};

	const getPowerCards = async () => {
		const response = await fetch(`${BACKEND_URL}/power_cards`, {
			method: 'POST',
			body: JSON.stringify({
				user_id
			}),
			headers: {
				'Content-Type': 'application/json'
			}
		});

		const powerCards: PowerCard[] = await response.json();

		return powerCards;
	};

	setHeaders({ 'cache-control': `max-age=120, must-revalidate` });

	return {
		powerCards: await getPowerCards(),
		matches: await getLatestMatches()
	};
};
