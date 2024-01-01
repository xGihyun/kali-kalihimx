import { BACKEND_URL } from '$env/static/private';
import { CACHE_DURATION } from '$lib';
import type { Section, User } from '$lib/types';
import { fail, type Actions } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { superValidate } from 'sveltekit-superforms/server';
import { DeleteSectionsSchema } from '$lib/schemas';

export const load: PageServerLoad = async ({ fetch, setHeaders, url }) => {
	const limit = url.searchParams.get('limit') || 5;
	const skip = Number(url.searchParams.get('skip')) || 0;
	const sections = url.searchParams.get('sections');

	const getUsers = async () => {
		const response = await fetch(
			`${BACKEND_URL}/users?order_by=score&order=desc&skip=${skip}${
				sections ? `&section=${sections}` : `&limit=${limit}`
			}`,
			{
				method: 'GET'
			}
		);
		const users: User[] = await response.json();

		return users;
	};

	const getUserCount = async () => {
		const response = await fetch(`${BACKEND_URL}/users/count`, {
			method: 'GET'
		});
		const { total } = await response.json();

		return (total as number) || 0;
	};

	const getSections = async () => {
		const response = await fetch(`${BACKEND_URL}/sections`, { method: 'GET' });
		const sections: Section[] = await response.json();

		return sections;
	};

	const foo = Promise.all([getUsers(), getSections(), getUserCount()]);

	setHeaders({ 'cache-control': `max-age=0, s-maxage=${CACHE_DURATION}, proxy-revalidate` });

	return {
		lazy: {
			foo
		},
		skip,
		filteredSections: sections,
		form: await superValidate(DeleteSectionsSchema)
	};
};

export const actions: Actions = {
	delete: async (event) => {
		const form = await superValidate(event, DeleteSectionsSchema);

		console.log('Forced: ', form.data.force);

		console.log('->> FORM DATA');
		console.log(form.data);

		if (!form.valid || form.data.sections.length < 1) {
			return fail(400, {
				form,
				success: false
			});
		}

		const response = await event.fetch(`${BACKEND_URL}/users?force=${form.data.force}`, {
			method: 'DELETE',
			body: JSON.stringify(form.data.sections),
			headers: {
				'Content-Type': 'application/json'
			}
		});

		if (!response.ok) {
			console.log(await response.text());
			console.log(response.status);

			return fail(response.status, {
				form,
				success: false
			});
		}

		// const deletePromises = form.data.sections.map((user_id) => {
		// 	return event.locals.supabase.auth.admin.deleteUser(user_id);
		// });
		//
		// const results = await Promise.all(deletePromises);
		//
		// results.forEach(({ error }, index) => {
		// 	if (error) {
		// 		console.error(`Error deleting user with id ${form.data.sections[index]}: `, error);
		// 	} else {
		// 		console.log(`User with id ${form.data.sections[index]} deleted successfully`);
		// 	}
		// });

		return {
			form,
			success: true
		};
	}
};
