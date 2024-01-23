import { fail, type Actions } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { superValidate } from 'sveltekit-superforms/server';
import { ResetPasswordSchema } from '$lib/schemas';

export const load: PageServerLoad = async () => {
	return {
		form: await superValidate(ResetPasswordSchema)
	};
};

export const actions: Actions = {
	default: async (event) => {
		const form = await superValidate(event, ResetPasswordSchema);

		if (!form.valid) {
			return fail(400, {
				form,
				message: 'Invalid form data.'
			});
		}

		const { error } = await event.locals.supabase.auth.resetPasswordForEmail(form.data.email);

		console.log('Reset password for email');
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
			message: 'Success! Please check your email.'
		};
	}
};
