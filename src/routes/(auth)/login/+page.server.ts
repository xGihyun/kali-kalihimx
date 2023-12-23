import { LoginSchema } from '$lib/schemas';
import { BACKEND_URL } from '$lib/server';
import type { User } from '$lib/types';
import { redirect, type Actions } from '@sveltejs/kit';
import { parse } from 'valibot';
import { APP_ENV } from '$env/static/private';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
	if (locals.user_id) {
		redirect(302, '/');
	}
};

export const actions: Actions = {
	default: async ({ request, cookies }) => {
		const formData = await request.formData();
		const formEntries = Object.fromEntries(formData.entries());

		const userData = parse(LoginSchema, formEntries);

		console.log(userData);

		const response = await fetch(`${BACKEND_URL}/login`, {
			method: 'POST',
			body: JSON.stringify(userData),
			headers: {
				'Content-Type': 'application/json'
			}
		});

		const user: User = await response.json();

		console.log(user);

		if (response.ok) {
			cookies.set('session', user.id, {
				maxAge: 60 * 60 * 24 * 7, // 1 week
				path: '/',
				httpOnly: true,
				sameSite: 'strict',
				secure: APP_ENV === 'production'
			});

			redirect(303, '/');
		}
	}
};
