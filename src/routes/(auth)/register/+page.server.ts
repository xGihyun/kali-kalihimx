import { BACKEND_URL } from '$lib/server';
import { redirect, type Actions, fail } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import type { Section } from '$lib/types.ts';
import { CACHE_DURATION } from '$lib';
import { RegisterSchema } from '$lib/schemas';
import { superValidate } from 'sveltekit-superforms/server';
import { supabase } from '$lib/supabase';

export const load: PageServerLoad = async ({ locals, fetch, setHeaders }) => {
	if (locals.user_id) {
		redirect(302, '/');
	}

	const response = await fetch(`${BACKEND_URL}/sections`, {
		method: 'GET'
	});

	const sections: Section[] = await response.json();

	setHeaders({ 'cache-control': `max-age=${CACHE_DURATION}, must-revalidate` });

	return {
		sections,
		form: await superValidate(RegisterSchema)
	};
};

export const actions: Actions = {
	default: async (event) => {
		const form = await superValidate(event, RegisterSchema);

		console.log(form.data);

		if (!form.valid) {
			return fail(400, {
				form,
				success: false
			});
		}

		const { user, error } = await supabase.auth.signUp({
			email: form.data.email,
			password: form.data.password
		});

		console.log(user);

		if (error) {
			return fail(400, {
				form,
				success: false
			});
		}

		const response = await event.fetch(`${BACKEND_URL}/register`, {
			method: 'POST',
			body: JSON.stringify(form.data),
			headers: {
				'Content-Type': 'application/json'
			}
		});

		if (response.ok) {
			redirect(303, '/login');
		}

		if (response.status === 409) {
			console.error('User already exists.');

			return fail(409, {
				form,
				success: false
			});
		} else {
			return fail(500, {
				form,
				success: false
			});
		}
	}
};
