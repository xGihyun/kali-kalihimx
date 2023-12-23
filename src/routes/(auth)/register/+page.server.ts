import { BACKEND_URL } from '$lib/server';
import { redirect, type Actions } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import type { Section } from '$lib/types.ts';
import { CACHE_DURATION } from '$lib';
import { parse } from 'valibot';
import { RegisterSchema } from '$lib/schemas';

export const load: PageServerLoad = async ({ locals, fetch, setHeaders }) => {
	if (locals.user_id) {
		redirect(302, '/');
	}

	const response = await fetch(`${BACKEND_URL}/sections`, {
		method: 'GET'
	});

	const sections: Section[] = await response.json();

	setHeaders({ 'cache-control': `max-age=${CACHE_DURATION}, must-revalidate` });

	return {
		sections
	};
};

export const actions: Actions = {
	default: async ({ request }) => {
		const formData = await request.formData();
		const formEntries = Object.fromEntries(formData.entries());

		const userData = parse(RegisterSchema, {
			...formEntries,
			age: Number(formEntries.age),
			contact_number: Number(formEntries.contact_number),
			sex: Number(formEntries.sex)
		});

		console.log(userData);

		const response = await fetch(`${BACKEND_URL}/register`, {
			method: 'POST',
			body: JSON.stringify(userData),
			headers: {
				'Content-Type': 'application/json'
			}
		});

		if (response.ok) {
			redirect(303, '/login');
		}

		if (response.status === 409) {
			console.error('User already exists.');
		} else {
			console.error('Something unexpected happened.');
		}
	}
};
