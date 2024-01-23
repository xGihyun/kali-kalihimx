import { fail, type Actions } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { superValidate } from 'sveltekit-superforms/server';
import { EmailSchema } from '$lib/schemas';
import { AuthApiError } from '@supabase/supabase-js';

export const load: PageServerLoad = async () => {
	return {
		form: await superValidate(EmailSchema)
	};
};

export const actions: Actions = {
	default: async (event) => {
		const form = await superValidate(event, EmailSchema);

		if (!form.valid) {
			return fail(400, {
				form,
				success: false,
				message: 'Invalid form data.'
			});
		}

		const { data, error } = await event.locals.supabase.auth.resend({
			type: 'signup',
			email: form.data.email,
			options: {
				emailRedirectTo: `${event.url.origin}/auth/callback`
			}
		});

		console.log('Email reverification...');
		console.log(data);
		console.log(error);

		if (error) {
			if (error instanceof AuthApiError && error.status === 400) {
				return fail(400, {
					form,
					success: false,
					message: 'Invalid form data.'
				});
			}

			return fail(500, {
				form,
				success: false,
				message: 'Server error. Please try again later.'
			});
		}

		return {
			form,
			success: true,
			message: 'Success! Please check your email.'
		};
	}
};
