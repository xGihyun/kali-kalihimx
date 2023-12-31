import type { ArnisMatch, Matchmake, Section } from '$lib/types';
import { fail, type Actions } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { superValidate } from 'sveltekit-superforms/server';
import { arnisMatchSchema } from '$lib/schemas';
import { BACKEND_URL } from '$env/static/private';

export const load: PageServerLoad = async ({ fetch, setHeaders }) => {
	const response = await fetch(`${BACKEND_URL}/sections`, { method: 'GET' });
	const sections: Section[] = await response.json();

	setHeaders({ 'cache-control': `max-age=0, s-maxage=${60 * 2}, proxy-revalidate` });

	return {
		sections,
		form: await superValidate(arnisMatchSchema)
	};
};

export const actions: Actions = {
	default: async (event) => {
		const form = await superValidate(event, arnisMatchSchema);

		console.log('Matchmaking...');

		if (!form.valid) {
			console.log('Invalid matchmake data.');
			return fail(400, {
				form,
				result: null,
				success: false,
				message: 'Invalid form data'
			});
		}

		const matches = await matchmake(event.fetch, form.data);

		if (!matches) {
			return {
				form,
				result: null,
				success: false,
				message: 'Server error. Try again.'
			};
		}

		console.log('Matchmaking successful.');

		return {
			form,
			result: matches,
			success: true,
			message: 'Success'
		};
	}
};

async function matchmake(
	fetch: (input: URL | RequestInfo, init?: RequestInit | undefined) => Promise<Response>,
	payload: ArnisMatch
) {
	const response = await fetch(`${BACKEND_URL}/matchmake`, {
		method: 'POST',
		body: JSON.stringify(payload),
		headers: {
			'Content-Type': 'application/json'
		}
	});

	if (!response.ok) {
		console.log(await response.text());

		return;
	}

	const matches: Matchmake[] = await response.json();

	return matches;
}
