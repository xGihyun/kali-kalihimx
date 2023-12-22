import { BACKEND_URL } from '$lib/server';
import { redirect, type Actions } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import type { Register, Section } from '$lib/types.ts';
import { CACHE_DURATION } from '$lib';
import { email, number, object, parse, string } from 'valibot';

export const load: PageServerLoad = async ({ fetch, setHeaders }) => {
	const response = await fetch(`${BACKEND_URL}/sections`, {
		method: 'GET'
	});

	const sections: Section[] = await response.json();

	setHeaders({ 'cache-control': `max-age=${CACHE_DURATION}, must-revalidate` });

	return {
		sections
	};
};

const RegisterSchema = object({
	email: string([email()]),
	password: string(),
	section: string(),
	first_name: string(),
	last_name: string(),
	age: number(),
	contact_number: number(),
	sex: number()
});

export const actions: Actions = {
	default: async ({ request, locals }) => {
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
			redirect(302, '/login');
		}

		if (response.status === 409) {
			console.error('User already exists.');
		} else {
			console.error('Something unexpected happened.');
		}
	}
};
