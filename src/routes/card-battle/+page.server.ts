import { BACKEND_URL } from '$env/static/private';
import type { PageServerLoad } from './$types';

type MatchDate = {
	created_at: string;
	card_deadline: string;
};

export const load: PageServerLoad = async ({ setHeaders, locals, depends }) => {
	const session = await locals.getSession();
	const user_id = session?.user.id;

	const getLatestMatches = async () => {
		if (!user_id) return null;

		const response = await fetch(`${BACKEND_URL}/matches/latest_date`, {
			method: 'POST',
			body: JSON.stringify({
				user_id
			}),
			headers: {
				'Content-Type': 'application/json'
			}
		});

		const matches: MatchDate | null = await response.json();

		if (matches) {
			const foo = new Date(matches.created_at);
			const bar = new Date(matches.card_deadline);

			console.log(bar);

			return {
				created_at: foo,
				card_deadline: bar
			};
		}

		return null;
	};

	depends('card_battle:timer');

	setHeaders({ 'cache-control': `max-age=10, must-revalidate` });

	return {
		matchDate: await getLatestMatches()
	};
};
