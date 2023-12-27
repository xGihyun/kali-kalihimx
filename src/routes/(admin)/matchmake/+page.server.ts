import { CACHE_DURATION } from '$lib';
import { BACKEND_URL } from '$lib/server';
import type { Matchmake, Section } from '$lib/types';
import { fail, type Actions } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { superValidate } from 'sveltekit-superforms/server';
import { arnisMatchSchema } from '$lib/schemas';

export const load: PageServerLoad = async ({ fetch, setHeaders }) => {
	const response = await fetch(`${BACKEND_URL}/sections`, { method: 'GET' });
	const sections: Section[] = await response.json();

	setHeaders({ 'cache-control': `max-age=${CACHE_DURATION}, must-revalidate` });

	return {
		sections,
		form: await superValidate(arnisMatchSchema)
	};
};

export const actions: Actions = {
	default: async (event) => {
		const form = await superValidate(event, arnisMatchSchema);

		if (!form.valid) {
			return fail(400, {
				form,
				result: null,
				success: false
			});
		}

		const response = await event.fetch(`${BACKEND_URL}/matchmake`, {
			method: 'POST',
			body: JSON.stringify(form.data),
			headers: {
				'Content-Type': 'application/json'
			}
		});

		if (response.ok) {
			const matches: Matchmake[] = await response.json();

			return {
				form,
				result: matches,
				success: true
			};
		}

		return {
			form,
			result: null,
			success: false
		};
	}
};
