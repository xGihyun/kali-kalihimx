import { BACKEND_URL } from '$lib/server';
import type { Matchmake, PowerCard, UpdatePowerCard } from '$lib/types';
import type { Actions } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ fetch, locals, setHeaders, depends }) => {
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

	depends('user:power_cards');

	setHeaders({ 'cache-control': `max-age=120, must-revalidate` });

	return {
		powerCards: await getPowerCards(),
		matches: await getLatestMatches()
	};
};

export const actions: Actions = {
	power_card: async ({ fetch, request, locals }) => {
		const { user_id } = locals;

		const formData = await request.formData();
		const card_id = formData.get('card_id') as string;

		const payload: UpdatePowerCard = {
			user_id,
			card_id,
			is_used: false,
			is_activated: true
		};

		console.log('Activating power card');

		const response = await fetch(`${BACKEND_URL}/power_cards/update`, {
			method: 'POST',
			body: JSON.stringify(payload),
			headers: {
				'Content-Type': 'application/json'
			}
		});

		if (response.ok) {
			console.log('Successfully activated power card.');

			return {
				success: true
			};
		}

		return {
			success: false
		};
	}
};
