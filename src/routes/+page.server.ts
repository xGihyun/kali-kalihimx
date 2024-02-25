import type { PowerCard, UpdatePowerCard, Badge, HttpResult } from '$lib/types';
import { type Actions, fail } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { BACKEND_URL } from '$env/static/private';
import { loginSchema } from '$lib/schemas';
import { superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { PUBLIC_SUPABASE_URL } from '$env/static/public';
import { isAuthApiError } from '@supabase/supabase-js';
import type { MatchClient, Opponent } from '$lib/types/matches';
import { displaySupabaseError } from '$lib/server';

export const load: PageServerLoad = async ({ fetch, locals, setHeaders }) => {
	const session = await locals.getSession();
	const userId = session?.user.id;

	const getMatches = async (): Promise<HttpResult<MatchClient[]>> => {
		if (!userId) {
			return {
				code: 404,
				message: 'User not found.',
				success: false
			};
		}

		const response = await fetch(`${BACKEND_URL}/users/${userId}/matches`, {
			method: 'GET'
		});

		if (!response.ok) {
			return {
				code: response.status,
				message: await response.text(),
				success: false
			};
		}

		const matches: MatchClient[] = await response.json();

		console.log(matches);

		return {
			code: response.status,
			message: 'Successfully fetched matches.',
			success: true,
			data: matches
		};
	};

	const getPowerCards = async (): Promise<HttpResult<PowerCard[]>> => {
		const { data, error: err } = await locals.supabase
			.from('power_cards')
			.select('*')
			.eq('user_id', userId);

		if (err) {
			displaySupabaseError(err);

			return {
				code: +err.code,
				message: err.message,
				success: false
			};
		}

		return {
			code: 200,
			message: 'Successfully fetched Power Cards.',
			success: true,
			data
		};
	};

	const getOpponent = async (): Promise<HttpResult<Opponent>> => {
		if (!userId) {
			return {
				code: 404,
				message: 'User not found.',
				success: false
			};
		}

		const response = await fetch(`${BACKEND_URL}/users/${userId}/matches/opponent`, {
			method: 'GET'
		});

		if (!response.ok) {
			return {
				code: response.status,
				message: await response.text(),
				success: false
			};
		}

		const opponent: Opponent = await response.json();

		console.log(opponent);

		return {
			code: response.status,
			message: 'Successfully fetched opponent.',
			success: true,
			data: opponent
		};
	};

	const getBadges = async (): Promise<HttpResult<Badge[]>> => {
		if (!userId) {
			return {
				code: 404,
				message: 'User not found.',
				success: false
			};
		}

		const { data, error: err } = await locals.supabase
			.from('badges')
			.select('*')
			.eq('user_id', userId);

		if (err) {
			// displaySupabaseError(err);
			// error(toErrorCode(+err.code), err.message);
			return {
				code: +err.code,
				message: err.message,
				success: false
			};
		}

		return {
			code: 200,
			message: 'Successfully fetched badges.',
			success: true,
			data
		};
	};

	setHeaders({ 'cache-control': `max-age=10, must-revalidate` });

	return {
		lazy: {
			matches: getMatches(),
			badges: getBadges(),
			powerCards: getPowerCards(),
			opponent: getOpponent()
		},
		form: await superValidate(zod(loginSchema))
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
		const form = await superValidate(event, zod(loginSchema));

		let result: HttpResult<undefined> = {
			message: 'Server error. Try again later.',
			success: false,
			code: 500
		};

		if (!form.valid) {
			result.message = 'Invalid form data.';
			result.code = 400;

			return fail(400, {
				form,
				result
			});
		}

		const { error, data } = await event.locals.supabase.auth.signInWithPassword({
			email: form.data.email,
			password: form.data.password
		});

		if (error) {
			if (isAuthApiError(error) && error.status === 400) {
				result.message = 'Invalid credentials.';
				result.code = 400;

				return fail(400, {
					form,
					result
				});
			}

			return fail(500, {
				form,
				result
			});
		}

		result = {
			message: 'Successfully logged in.',
			success: true,
			code: 200
		};

		console.log('->> LOGIN: ', data.user.email);

		return {
			form,
			result
		};
	},
	image: async ({ locals, request }) => {
		const session = await locals.getSession();
		const user_id = session?.user.id;

		if (!user_id) {
			return fail(404, {
				success: false,
				message: 'User not found.'
			});
		}

		const formData = await request.formData();

		// const photoName = formData.get('filename') as string;
		const blob = formData.get('file') as Blob;
		const fileName = formData.get('file_name') as string;
		const type = formData.get('type') as 'avatar' | 'banner';

		const newFileName = `${user_id}_${fileName}`;

		const file = new File([blob], newFileName, { type: 'image/avif' });

		const { error } = await locals.supabase.storage.from(`${type}s`).upload(newFileName, file, {
			cacheControl: '600',
			upsert: true,
			contentType: 'image/*'
		});

		if (error) {
			return fail(500, {
				success: false,
				message: error.message
			});
		}

		const url = `${PUBLIC_SUPABASE_URL}/storage/v1/object/public/${type}s/${newFileName}`;

		const { error: err } = await locals.supabase
			.from('users')
			.update(type === 'avatar' ? { avatar_url: url } : { banner_url: url })
			.eq('id', user_id);

		if (err) {
			return fail(500, {
				success: false,
				message: err.message
			});
		}

		return {
			success: true,
			message: 'Succesfully updated image.'
		};
	}
};

async function activatePowerCard(
	fetch: (input: URL | RequestInfo, init?: RequestInit | undefined) => Promise<Response>,
	card_id: string,
	payload: UpdatePowerCard
) {
	console.log('Activating power card...');

	const response = await fetch(`${BACKEND_URL}/power_cards/${card_id}`, {
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

	const response = await fetch(`${BACKEND_URL}/power-cards/twist-of-fate`, {
		method: 'PATCH',
		body: JSON.stringify({
			user_id,
			selected_user_id: opponent_id
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
