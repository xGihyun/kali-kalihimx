import { fail, type Actions, redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { superValidate } from 'sveltekit-superforms/server';
import { LoginSchema } from '$lib/schemas';
import { AuthApiError } from '@supabase/supabase-js';

export const load: PageServerLoad = async ({ url }) => {
	const code = url.searchParams.get('code');

	if (!code) {
		console.log('User not verified to reset password.');
		redirect(307, '/');
	}

	return {
		form: await superValidate(LoginSchema)
	};
};

export const actions: Actions = {
	default: async (event) => {
		const form = await superValidate(event, LoginSchema);

		if (!form.valid) {
			return fail(400, {
				form,
				success: false,
				message: 'Invalid form data.'
			});
		}

		const { error } = await event.locals.supabase.auth.updateUser({
			password: form.data.password
		});

		console.log('Update password.');
		console.log(error);

		if (error) {
			if (error instanceof AuthApiError && error.status === 400) {
				return fail(400, {
					form,
					success: false,
					message: 'Invalid form data.'
				});
			}

			return fail(error.status || 500, {
				form,
				success: false,
				message: 'Server error. Please try again later.'
			});
		}

		return {
			form,
			success: true,
			message: 'Success!'
		};
	}
};
