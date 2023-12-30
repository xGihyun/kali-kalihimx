import { LoginSchema } from '$lib/schemas';
import { redirect, type Actions, fail } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { superValidate } from 'sveltekit-superforms/server';
import { AuthApiError } from '@supabase/supabase-js';

export const load: PageServerLoad = async () => {
	return {
		form: await superValidate(LoginSchema)
	};
};

// This should probably be in '/' since the +page.svelte here is obsolete
export const actions: Actions = {
	default: async (event) => {
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
