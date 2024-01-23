import { redirect, type Actions, fail } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import type { Register, Section, User } from '$lib/types.ts';
import { RegisterSchema } from '$lib/schemas';
import { superValidate } from 'sveltekit-superforms/server';
import { AuthApiError } from '@supabase/supabase-js';
import { BACKEND_URL } from '$env/static/private';

export const load: PageServerLoad = async ({ locals, fetch, setHeaders }) => {
	if (locals.user_id) {
		redirect(302, '/');
	}

	const response = await fetch(`${BACKEND_URL}/sections`, {
		method: 'GET'
	});

	const sections: Section[] = await response.json();

	setHeaders({ 'cache-control': `max-age=${60 * 2}, must-revalidate` });

	return {
		sections,
		form: await superValidate(RegisterSchema)
	};
};

export const actions: Actions = {
	default: async (event) => {
		const form = await superValidate(event, RegisterSchema);

		console.log('->> FORM DATA');
		console.log(form.data);

		if (!form.valid) {
			return fail(400, {
				form,
				success: false
			});
		}

		const { error, data } = await event.locals.supabase.auth.signUp({
			email: form.data.email,
			password: form.data.password,
			options: {
				emailRedirectTo: `${event.url.origin}/auth/callback`
			}
		});

		console.log('->> REGISTER');
		console.log(data);

		// @ts-expect-error: Omit password from the original form data
		const { password, ...registerUserData } = form.data;

		if (error) {
			if (error instanceof AuthApiError && error.status === 400) {
				return fail(400, {
					form,
					success: false,
					message: 'Invalid form data.'
				});
			}

			const cookies = event.cookies.getAll();

			cookies.forEach(({ name }) => {
				event.cookies.delete(name, { path: '/' });
			});

			return fail(500, {
				form,
				success: false,
				message: error.message
			});
		}

		const insertUser = await insertUserToDatabase(event.fetch, {
			...registerUserData,
			id: data.user?.id
		});

		console.log('Insert user status');
		console.log(insertUser);

		if (!insertUser.success) {
			return fail(409, {
				form,
				success: false,
				message: insertUser.message
			});
		}

		const insertPowerCards = await insertRandomPowerCards(event.fetch, data.user?.id);

		if (!insertPowerCards.success) {
			return fail(500, {
				form,
				success: false,
				message: insertPowerCards.message
			});
		}

		return {
			form,
			success: true,
			message: 'Please check your email for confirmation.'
		};
	}
};

async function insertUserToDatabase(
	fetch: (input: URL | RequestInfo, init?: RequestInit | undefined) => Promise<Response>,
	data: User
) {
	const response = await fetch(`${BACKEND_URL}/register`, {
		method: 'POST',
		body: JSON.stringify(data),
		headers: {
			'Content-Type': 'application/json'
		}
	});

	console.log('Inserting user to database...');
	console.log(data);

	if (response.status === 409) {
		return {
			code: 409,
			message: 'User already exists. Please reverify your email.',
			success: false
		};
	}

	if (!response.ok) {
		return {
			code: 500,
			message: 'Unexpected server error',
			success: false
		};
	}

	return {
		code: 200,
		message: 'Successfully registered',
		success: true
	};
}

// Get 3 random power cards by default
async function insertRandomPowerCards(
	fetch: (input: URL | RequestInfo, init?: RequestInit | undefined) => Promise<Response>,
	userId: string | undefined
) {
	if (!userId) {
		return {
			code: 500,
			message: 'User ID not found',
			success: false
		};
	}

	const response = await fetch(`${BACKEND_URL}/power_cards`, {
		method: 'POST',
		body: JSON.stringify({
			user_id: userId
		}),
		headers: {
			'Content-Type': 'application/json'
		}
	});

	if (!response.ok) {
		return {
			code: 500,
			message: 'Unexpected server error',
			success: false
		};
	}

	return {
		code: 200,
		message: 'Successfully registered',
		success: true
	};
}
