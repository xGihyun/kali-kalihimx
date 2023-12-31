import type { Matchmake, PowerCard, UpdatePowerCard, LatestOpponent } from '$lib/types';
import { redirect, type Actions, fail } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { BACKEND_URL } from '$env/static/private';
import { LoginSchema } from '$lib/schemas';
import { superValidate } from 'sveltekit-superforms/server';
import { AuthApiError } from '@supabase/supabase-js';

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

	setHeaders({ 'cache-control': `max-age=0, s-maxage=${60 * 2}, proxy-revalidate` });

	const data = Promise.all([getPowerCards(), getLatestMatches(), getLatestOpponentDetails()]);

	return {
		lazy: {
			data
		},
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
		const new_opponent_id = formData.get('new_opponent_id') as string | undefined;
		const new_power_card = formData.get('new_power_card') as string | undefined;
		const new_skill = formData.get('new_skill') as string | undefined;
		const match_set_id = formData.get('match_set_id') as string | undefined;

		const payload: UpdatePowerCard = {
			user_id,
			is_used: false,
			is_activated: true
		};

		console.log('Card: ', card_id);
		console.log('New Skill: ', new_skill);
		console.log('New Opponent: ', new_opponent_id);
		console.log('New Power Card: ', new_power_card);
		console.log('Match ID: ', match_set_id);

		const response = await Promise.all([
			twistOfFate(fetch, user_id, new_opponent_id),
			extraWind(fetch, user_id, new_power_card),
			warlordsDomain(fetch, user_id, match_set_id, new_skill)
		]);

		if (response.includes(false)) {
			return {
				success: false
			};
		}

		// Put this down here since we don't want to activate cards if previous requests results into an error
		const activate = await activatePowerCard(fetch, card_id, payload);

		if (!activate) {
			return {
				success: false
			};
		}

		return {
			success: true
		};
	},
	login: async (event) => {
		const form = await superValidate(event, LoginSchema);

		console.log(form.data);

		if (!form.valid) {
			return fail(400, {
				form,
				message: 'Invalid form data.'
			});
		}

		const { error, data } = await event.locals.supabase.auth.signInWithPassword({
			email: form.data.email,
			password: form.data.password
		});

		if (error) {
			if (error instanceof AuthApiError && error.status === 400) {
				return fail(400, {
					form,
					success: false,
					message: 'Invalid credentials.'
				});
			}

			return fail(500, {
				form,
				success: false,
				message: 'Server error. Try again later.'
			});
		}

		console.log('->> LOGIN');
		console.log(data);

		throw redirect(303, '/');
	}
};

async function activatePowerCard(
	fetch: (input: URL | RequestInfo, init?: RequestInit | undefined) => Promise<Response>,
	card_id: string,
	payload: UpdatePowerCard
) {
	console.log('Activating power card...');

	const response = await fetch(`${BACKEND_URL}/power_cards/${payload.card_id}`, {
		method: 'PATCH',
		body: JSON.stringify(payload),
		headers: {
			'Content-Type': 'application/json'
		}
	});

	if (!response.ok) {
		console.log(await response.text());
		return false;
	}

	console.log('Successfully activated power card.');
	return true;
}

async function twistOfFate(
	fetch: (input: URL | RequestInfo, init?: RequestInit | undefined) => Promise<Response>,
	user_id: string,
	opponent_id: string | undefined
) {
	if (!opponent_id) return;

	console.log('Switching opponent...');

	const response = await fetch(`${BACKEND_URL}/power_cards/twist_of_fate`, {
		method: 'PATCH',
		body: JSON.stringify({
			user_id,
			selected_opponent_id: opponent_id
		}),
		headers: {
			'Content-Type': 'application/json'
		}
	});

	if (!response.ok) {
		console.log(await response.text());
		return false;
	}

	console.log('Successfully switched opponents.');
	return true;
}

async function extraWind(
	fetch: (input: URL | RequestInfo, init?: RequestInit | undefined) => Promise<Response>,
	user_id: string,
	card: string | undefined
) {
	if (!card) return;

	console.log('Adding new card...');

	const response = await fetch(`${BACKEND_URL}/power_cards`, {
		method: 'POST',
		body: JSON.stringify({
			user_id,
			name: card
		}),
		headers: {
			'Content-Type': 'application/json'
		}
	});

	if (!response.ok) {
		console.log(await response.text());
		return false;
	}

	console.log('Successfully added new card.');
	return true;
}

async function warlordsDomain(
	fetch: (input: URL | RequestInfo, init?: RequestInit | undefined) => Promise<Response>,
	user_id: string,
	match_set_id: string | undefined,
	skill: string | undefined
) {
	if (!skill || !match_set_id) return;

	console.log('Switching skill...');

	const response = await fetch(`${BACKEND_URL}/power_cards/warlords_domain`, {
		method: 'PATCH',
		body: JSON.stringify({
			user_id,
			match_set_id,
			arnis_skill: skill
		}),
		headers: {
			'Content-Type': 'application/json'
		}
	});

	if (!response.ok) {
		console.log(await response.text());
		return false;
	}

	console.log('Successfully switched Arnis Skill.');
	return true;
}
