import type { Matchmake, PowerCard, UpdatePowerCard, LatestOpponent } from '$lib/types';
import type { Actions } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { BACKEND_URL } from '$env/static/private';
import { LoginSchema } from '$lib/schemas';
import { superValidate } from 'sveltekit-superforms/server';

export const load: PageServerLoad = async ({ fetch, locals, setHeaders, depends }) => {
	const session = await locals.getSession();
	const user_id = session?.user.id;

	const getLatestMatches = async () => {
		if (!user_id) return [];

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
		if (!user_id) return [];

		const response = await fetch(`${BACKEND_URL}/power_cards?user_id=${user_id}`, {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json'
			}
		});

		const powerCards: PowerCard[] = await response.json();

		return powerCards;
	};

	const getLatestOpponentDetails = async () => {
		if (!user_id) return null;

		const response = await fetch(`${BACKEND_URL}/matches/latest/${user_id}`, {
			method: 'GET'
		});

		const latestOpponent: LatestOpponent | null = await response.json();

		return latestOpponent;
	};

	depends('user:power_cards');

	setHeaders({ 'cache-control': `max-age=120, must-revalidate` });

	return {
		powerCards: await getPowerCards(),
		matches: await getLatestMatches(),
		opponentDetails: await getLatestOpponentDetails(),
		form: await superValidate(LoginSchema)
	};
};

export const actions: Actions = {
	power_card: async ({ fetch, request, locals }) => {
		const session = await locals.getSession();
		const user_id = session?.user.id;

		if (!user_id) return;

		const formData = await request.formData();
		const card_id = formData.get('card_id') as string;

		const payload: UpdatePowerCard = {
			user_id,
			card_id,
			is_used: false,
			is_activated: true
		};

		console.log('Activating power card...');

		const response = await fetch(`${BACKEND_URL}/power_cards`, {
			method: 'PATCH',
			body: JSON.stringify(payload),
			headers: {
				'Content-Type': 'application/json'
			}
		});

		// console.log(await response.text())

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
