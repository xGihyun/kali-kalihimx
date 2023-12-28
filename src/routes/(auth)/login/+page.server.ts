import { LoginSchema } from '$lib/schemas';
import type { User } from '$lib/types';
import { redirect, type Actions, fail } from '@sveltejs/kit';
import { APP_ENV, BACKEND_URL } from '$env/static/private';
import type { PageServerLoad } from './$types';
import { superValidate } from 'sveltekit-superforms/server';
import { supabase } from '$lib/supabase';

export const load: PageServerLoad = async ({ locals }) => {
	if (locals.user_id) {
		redirect(302, '/');
	}

	return {
		form: await superValidate(LoginSchema)
	};
};

export const actions: Actions = {
	default: async (event) => {
		const form = await superValidate(event, LoginSchema);

		console.log(form.data);

		if (!form.valid) {
			return fail(400, {
				form
			});
		}

		const { error } = await supabase.auth.signInWithPassword({
			email: form.data.email,
			password: form.data.password
		});

		if (error) {
			return fail(400, {
				form,
				success: false
			});
		}

		const response = await event.fetch(`${BACKEND_URL}/login`, {
			method: 'POST',
			body: JSON.stringify(form.data),
			headers: {
				'Content-Type': 'application/json'
			}
		});

		const user: User = await response.json();

		console.log(user);

		if (response.ok) {
			event.cookies.set('session', user.id, {
				maxAge: 60 * 60 * 24 * 7, // 1 week
				path: '/',
				httpOnly: true,
				sameSite: 'strict',
				secure: APP_ENV === 'production'
			});

			redirect(303, '/');
		} else {
			return fail(500, {
				form
			});
		}
	}
};
