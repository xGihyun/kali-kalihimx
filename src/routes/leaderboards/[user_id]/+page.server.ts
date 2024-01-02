import { BACKEND_URL } from '$env/static/private';
import type { PageServerLoad } from './$types';
import type { PowerCard, User } from '$lib/types';
import { superValidate } from 'sveltekit-superforms/server';
import { UpdateUserSchema } from '$lib/schemas';
import type { Section } from 'radix-icons-svelte';
import { fail, type Actions } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ fetch, params, locals, setHeaders }) => {
	const { user_id } = params;
	const current_user_id = locals.user_id;

	const getUser = async () => {
		const response = await fetch(`${BACKEND_URL}/users/${user_id}`, {
			method: 'GET'
		});

		const user: User = await response.json();

		return user;
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

	const getSections = async () => {
		const response = await fetch(`${BACKEND_URL}/sections`, {
			method: 'GET'
		});

		const sections: Section[] = await response.json();

		return sections;
	};

	const userData = Promise.all([getUser(), getPowerCards()]);

	setHeaders({ 'cache-control': `max-age=0, s-maxage=${60 * 2}, proxy-revalidate` });

	return {
		lazy: {
			userData
		},
		currentUserId: current_user_id,
		form: await superValidate(UpdateUserSchema),
		sections: getSections()
	};
};

export const actions: Actions = {
	update_user: async (event) => {
		const form = await superValidate(event, UpdateUserSchema);
		const { user_id } = event.params;

		if (!form.valid) {
			console.log('Invalid data');
			return fail(400, {
				form
			});
		}

		const response = await event.fetch(`${BACKEND_URL}/users/${user_id}`, {
			method: 'PATCH',
			body: JSON.stringify(form.data),
			headers: {
				'Content-Type': 'application/json'
			}
		});

		if (!response.ok) {
			console.log('Failed to update user data');
			return fail(500, {
				form
			});
		}

		return {
			form
		};
	}
};
