import { BACKEND_URL } from '$env/static/private';
import type { PageServerLoad } from './$types';
import type { PowerCard, User } from '$lib/types';

export const load: PageServerLoad = async ({ fetch, params, locals, setHeaders }) => {
	const { user_id } = params;
	const current_user_id = locals.user_id;

	const getUser = async () => {
		const response = await fetch(`${BACKEND_URL}/users/${user_id}`, {
			method: 'GET'
		});

		const user: User = await response.json();

		return user;
	};

	const getPowerCards = async () => {
		const response = await fetch(`${BACKEND_URL}/power_cards`, {
			method: 'POST',
			body: JSON.stringify({
				user_id
			}),
			headers: {
				'Content-Type': 'application/json'
			}
		});

		const powerCards: PowerCard[] = await response.json();

		return powerCards;
	};

	setHeaders({ 'cache-control': `max-age=120, must-revalidate` });

	return {
		user: await getUser(),
		powerCards: await getPowerCards(),
		currentUserId: current_user_id
	};
};
