import { fail, type Actions } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { superValidate } from 'sveltekit-superforms/server';
import { LoginSchema } from '$lib/schemas';

export const load: PageServerLoad = async () => {
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

		if (error) {
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
