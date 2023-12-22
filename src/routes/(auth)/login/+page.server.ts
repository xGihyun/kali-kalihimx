import { BACKEND_URL } from '$lib/server';
import type { User } from '$lib/types';
import { redirect, type Actions } from '@sveltejs/kit';
import { email, object, string, parse, type Output } from 'valibot';

const LoginSchema = object({
	email: string([email()]),
	password: string()
});

export const actions: Actions = {
	default: async ({ request, locals, cookies }) => {
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
			cookies.set('session', user.id, { maxAge: 60 * 60 * 24 * 7, path: '/' });

			throw redirect(302, '/');
		}
	}
};
