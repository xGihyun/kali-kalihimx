import { BACKEND_URL } from '$env/static/private';
import type { PageServerLoad } from './$types';
import type { PowerCard, Section, User } from '$lib/types';
import { superValidate } from 'sveltekit-superforms/server';
import { UpdateUserSchema } from '$lib/schemas';
import { fail, type Actions, error } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ params, locals, setHeaders }) => {
	const { user_id } = params;
	const current_user_id = locals.user_id;

	const getUser = async () => {
		const { data, error: err } = await locals.supabase.from('users').select('*').eq('id', user_id);

		if (err) {
			console.log(err.code);
			error(500, err.message);
		}

		return data[0] as User;
	};

	const getPowerCards = async () => {
		const { data, error: err } = await locals.supabase
			.from('power_cards')
			.select('*')
			.eq('user_id', user_id)
			.order('name');

		if (err) {
			console.log(err.code);
			error(500, err.message);
		}

		return data as PowerCard[];
	};

	const getSections = async () => {
		const { data, error: err } = await locals.supabase.from('sections').select('*').order('name');

		if (err) {
			console.log(err.code);
			error(500, err.message);
		}

		return data as Section[];
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
